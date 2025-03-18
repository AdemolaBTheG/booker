import { Book, NewBook, ReadingSession } from '@/lib/types';
import supabase from '../lib/supabase';
import 'react-native-url-polyfill/auto';
import {  ExpoSQLiteDatabase} from 'drizzle-orm/expo-sqlite';
import { books, DbReadingSession, readingSessions,DbBook } from '@/db/schema';
import { db } from '@/lib/db';
import { and, avg, count, eq, gte, lte, sql, SQL, sum,desc } from 'drizzle-orm';
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, addDays, addWeeks, addMonths, addYears, eachHourOfInterval } from 'date-fns';

export enum TimeUnit{
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year'
}

export type CountOfFilters = {
    libraryCount: number;
    readingCount: number;
    finishedCount: number;
    paperbackCount: number;
    hardcoverCount: number;
    ebookCount: number;
    cancelledCount: number;
    ownedCount: number;
    notOwnedCount: number;
    borrowedCount: number;
}

export type TimeSeriesResult = {
    timeKey: string;  // Can be day "2023-05-01", month "2023-05", etc.
    totalPages: number;
    totalSessions: number;
    averagePages: number;
    averageMinutes: number;
    totalMinutes: number;
  }

  export type BookWithLatestSession = {
    id: number;
    title: string;
    authors: string;
    thumbnail: string;
    pages: number;
    latestSession: {
      id: number;
      startedAtPage: number;
      pagesRead: number;
    } | null;
  }
class BooksService {

    private db: ExpoSQLiteDatabase;
    constructor(){
        this.db = db;
    }

    public async getReadingSessions():Promise<DbReadingSession[]>{
        try{
            return await this.db.select().from(readingSessions);
        }
        catch(error){
            console.error('Error getting reading sessions:', error);
            return [];
        }
    }

    public async getReadingSessionsByBook(){

        try{
            return await this.db.select().from(readingSessions).groupBy(readingSessions.bookId);
        }
        catch(error){
            console.error('Error getting reading sessions by book:', error);
            return [];
        }
    }

    public async getCountOfFilters(): Promise<CountOfFilters> {
        try {
            // Get total count of all books
            const totalBooks = await this.db.select({
                count: count()
            }).from(books);
            
            // Get count of reading books
            const readingBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.readingStatus, 'Reading'));
            
            // Get count of finished books
            const finishedBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.readingStatus, 'Finished'));

            const cancelledBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.readingStatus, 'Cancelled'));
            
            // Get count of books by format
            const paperbackBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.format, 'Paperback'));
            
            const hardcoverBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.format, 'Hardcover'));
            
            const ebookBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.format, 'eBook'));

            const ownedBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.ownershipStatus, 'Owned'));

            const notOwnedBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.ownershipStatus, 'Not Owned'));

            const borrowedBooks = await this.db.select({
                count: count()
            }).from(books).where(eq(books.ownershipStatus, 'Borrowed'));
            

            // Return consolidated results
            return {
                libraryCount: totalBooks[0].count,
                readingCount: readingBooks[0].count,
                finishedCount: finishedBooks[0].count,
                paperbackCount: paperbackBooks[0].count,
                hardcoverCount: hardcoverBooks[0].count,
                ebookCount: ebookBooks[0].count,
                cancelledCount: cancelledBooks[0].count,
                ownedCount: ownedBooks[0].count,
                notOwnedCount: notOwnedBooks[0].count,
                borrowedCount: borrowedBooks[0].count
            };
        }
        catch(error) {
            console.error('Error getting count of filters:', error);
            return {
                libraryCount: 0,
                readingCount: 0,
                finishedCount: 0,
                paperbackCount: 0,
                hardcoverCount: 0,
                ebookCount: 0,
                cancelledCount: 0,
                ownedCount: 0,
                notOwnedCount: 0,
                borrowedCount: 0
            };
        }
    }

    public async getBooksByFilter(category:string,filter: string):Promise<DbBook[]>{

        try{

            if(category === 'Bookshelf'){
                return await this.db.select().from(books).where(eq(books.readingStatus, filter));
            }
            else if(category === 'Formats'){
                return await this.db.select().from(books).where(eq(books.format, filter));
            }
            else {
                return await this.db.select().from(books).where(eq(books.ownershipStatus, filter));
            }


            
        }
        catch(error){
            console.error('Error getting books by filter:', error);
            return [];
        }


    }

    public async getLatestReadingSession(bookId: number):Promise<DbReadingSession | null>{
        try{
            const sessions = await this.db.select().from(readingSessions).where(eq(readingSessions.bookId, bookId)).orderBy(desc(readingSessions.id)).limit(1);

            return sessions.length > 0 ? sessions[0] : null;

        }
        catch(error){
            console.error('Error getting latest reading session:', error);
            return null;
        }
    }
    public async getSessionsByBookId(bookId: number):Promise<DbReadingSession[]>{
        try{
            return await this.db.select().from(readingSessions).where(eq(readingSessions.bookId, bookId));
        }
        catch(error){
            console.error('Error getting sessions by book ID:', error);
            return [];
        }
    }

   

    public async getBooksWithLatestSession(): Promise<BookWithLatestSession[]>{

        try{

            const booksWithSessions = await this.db.select({
                id: books.id,
                title: books.title,
                authors: books.authors,
                thumbnail: books.thumbnail,
                pages: books.pages
            }).from(books).innerJoin(readingSessions, eq(books.id, readingSessions.bookId)).groupBy(books.id);


            const booksWithLatestSession: BookWithLatestSession[] = [];

            for(const book of booksWithSessions){

                const latetstSession = await this.db.select().from(readingSessions).where(eq(readingSessions.bookId,book.id)).orderBy(desc(readingSessions.id)).limit(1);


                booksWithLatestSession.push({
                    id: book.id,
                    title: book.title,
                    authors: book.authors || '',
                    thumbnail: book.thumbnail || '',
                    pages: book.pages,
                    latestSession: {
                        id: latetstSession[0].id,
                        startedAtPage: latetstSession[0].startedAtPage,
                        pagesRead: latetstSession[0].pagesRead
                    }
                });
            }

            return booksWithLatestSession;
        }
        catch(error){
            console.error('Error getting books with latest session:', error);
            return [];
        }
     

    }

    public async getTimeSeriesData(timeUnit: TimeUnit, startDate: Date,endDate: Date, bookId: number = -1): Promise<TimeSeriesResult[]>{
        try{
           let groupByexpression: SQL<unknown>;
           let formatString: string;

           switch(timeUnit){

            case TimeUnit.HOUR:
                groupByexpression = sql`strftime('%Y-%m-%d %H', ${readingSessions.ended_at}/1000, 'unixepoch', 'localtime')`;
                formatString = 'yyyy-MM-dd HH';
                break;
            case TimeUnit.DAY:
                groupByexpression = sql`strftime('%Y-%m-%d', ${readingSessions.ended_at}/1000, 'unixepoch', 'localtime')`;
                formatString = 'yyyy-MM-dd';
                break;
            case TimeUnit.WEEK:
                groupByexpression = sql`strftime('%Y-%m-%d', ${readingSessions.ended_at}/1000, 'unixepoch', 'localtime')`;
                formatString = 'yyyy-MM-dd';
                break;
            case TimeUnit.MONTH:
                    groupByexpression = sql`strftime('%Y-%m', ${readingSessions.ended_at}/1000, 'unixepoch', 'localtime')`;
                    formatString = 'yyyy-MM';
                break;
            case TimeUnit.YEAR:
                groupByexpression = sql`strftime('%Y', ${readingSessions.ended_at}/1000, 'unixepoch')`;
                formatString = 'yyyy';
                break;
            default:
                throw new Error(`Unsupported time unit: ${timeUnit}`);
        }
        let conditions = and(
            gte(readingSessions.ended_at, startDate.getTime()),
            lte(readingSessions.ended_at, endDate.getTime())
        );
        if(bookId !== -1){
            conditions = and(conditions, eq(readingSessions.bookId, bookId));
        }
        
        const results = await this.db.select({
            timeKey: groupByexpression,
            totalPages: sum(readingSessions.pagesRead) ,
            totalSessions: count(),
            averagePages: avg(readingSessions.pagesRead),
            averageMinutes: sql `avg(${readingSessions.duration}) / 60000`,
            totalMinutes: sql `sum(${readingSessions.duration}) / 60000`
        })
        .from(readingSessions)
        .where(conditions)
        .groupBy(groupByexpression);

        console.log(results);

        return results.map(result => ({
            timeKey: String(result.timeKey),
            totalPages: Number(result.totalPages) || 0,
            totalSessions: Number(result.totalSessions) || 0,
            averagePages: Number(result.averagePages) || 0,
            averageMinutes: Number(result.averageMinutes) || 0,
            totalMinutes: Number(result.totalMinutes) || 0
        }));
        }
        catch(error){
            console.error('Error getting time series data:', error);
            return [];
        }
    }

    public async getAllDaysInMonth(year: number, month: number, bookId: number = -1): Promise<TimeSeriesResult[]> {
        const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
        const endDate = endOfMonth(startDate);
        
        return this.getCompleteTimeSeriesData(TimeUnit.DAY, startDate, endDate, bookId);
      }
      
      public async getAllMonthsInYear(year: number, bookId: number = -1): Promise<TimeSeriesResult[]> {
        const startDate = startOfYear(new Date(year, 0, 1));
        const endDate = endOfYear(startDate);
        
        return this.getCompleteTimeSeriesData(TimeUnit.MONTH, startDate, endDate, bookId);
      }
      

      public async getHoursInDay(date: Date, bookId: number = -1): Promise<TimeSeriesResult[]> {
        // Create start and end date for the specific day
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0); // Start of day
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999); // End of day
        
        return this.getCompleteTimeSeriesData(TimeUnit.HOUR, startDate, endDate, bookId);
    }

    public async getDaysInWeek(date: Date, bookId: number = -1): Promise<TimeSeriesResult[]> {
        // Create start and end date for the specific day
        const startDate = new Date(date);
        console.log(startDate.getDate() - (startDate.getDay() - 1))
        startDate.setDate(startDate.getDate() - (startDate.getDay() - 1));
        console.log(startDate) // Start of week (0-indexed, 0 = Sunday)
        
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + (7 - endDate.getDay())); // End of week (7 days from start)
        console.log(endDate)

        return this.getCompleteTimeSeriesData(TimeUnit.DAY, startDate, endDate, bookId);
    }
      
      

    

   public async getBookStatistics(bookId: number){
        try{
            const totalPagesRead = await this.db.select({total: sum(readingSessions.pagesRead),count: count()}).from(readingSessions).where(eq(readingSessions.bookId, bookId));
            
                if(totalPagesRead[0].total !== null && totalPagesRead[0].count !== null){
                    const averagePagesRead = Number(totalPagesRead[0].total) / Number(totalPagesRead[0].count);
                    return averagePagesRead;
                    
                }
                else{
                    return 0;
                }
        }
        catch(error){
            console.error('Error getting book statistics:', error);
            return [];
        }
    } 

    public async getBookById(id: string): Promise<DbBook | null>{
        try{
            if(!id){
                throw new Error('ID is required');
            }
            const idNumber = Number(id);
            const book = (await this.db.select().from(books)).find(book => book.id === idNumber);

            if(!book){
                return null;
            }

            return book;
            
            
        }
        catch(error){
            console.error('Error getting book by ID:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    public async getStartedAtPage(bookId: number):Promise<number>{
        try{
            const count = await this.db.$count(readingSessions);
            const startedAtPage = await this.db.select({ startedAtPage: readingSessions.startedAtPage }).from(readingSessions).where(eq(readingSessions.bookId, bookId));
            return startedAtPage[count-1].startedAtPage || 0;
        }
        catch(error){
            console.error('Error getting started at page:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

        public async getTotalReadPages(bookId: number):Promise<string>{
        try{
            const totalReadPages = await this.db.select({ total: sum(readingSessions.pagesRead) }).from(readingSessions).where(eq(readingSessions.bookId, bookId));
            return totalReadPages[0].total || '0';
        }
        catch(error){
            console.error('Error getting total read pages:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    public async addReadingSession(session: ReadingSession){

        try{

            if(!session){
                throw new Error('Session is required');
            }

            await this.db.insert(readingSessions).values(session);
        }
        catch(error){
            console.error('Error adding reading session:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }
  
    
    public async searchBooks(searchQuery: string): Promise<Book[]>{

      

        try{

            if(!searchQuery){
                throw new Error('Search query is required');
            }

                const {data,error} = await supabase.functions.invoke(`books/search?q=${searchQuery}`,
            {
                method: 'GET',
             
            })

             
                if(error){
                    console.error('Supabase Function Error:', {
                        message: error.message,
                        name: error.name,
                        details: error,
                    });
                    throw error;
                }


               return data;





     
           
        }
        catch(error){
            console.error('Error searching books:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }

    }

    public async getBooks(): Promise<DbBook[]> {
        try {    
            return await this.db.select().from(books);
           
        } catch(error) {
            console.error('Error getting books:', error);
            return [];
        }
    }

    public async getByISBN(isbn: string): Promise<Book>{

        try{


            if(!isbn){
                throw new Error('ISBN is required');
            }
            
            const {data,error} = await supabase.functions.invoke(`books/isbn/${isbn}`,{
                method: 'GET',
            })

            if(error){
                throw error;
            }

            return data;

        }catch(error){
            console.error('Error getting book by ISBN:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
        
    }

    public async getBookDetails(volumeId: string): Promise<Book>{

        try{
            if(!volumeId){
                throw new Error('Volume ID is required');
            }

            const {data,error} = await supabase.functions.invoke(`books/volumeId/${volumeId}`,{
                method: 'GET',
            })

            if(error){
                console.error('Supabase Function Error:', {
                    message: error.message,
                    name: error.name,
                    details: error,
                });
                throw error;
            }

            return data;

        }

        catch(error){
            console.error('Error getting book details:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    public async testConnection() {
        try {
            const { data, error } = await supabase.functions.invoke('books', {
                method: 'GET',
            });
            
            console.log('Connection test:', {
                success: !error,
                error: error?.message,
                data
            });
            
            return !error;
        } catch (error) {
            console.error('Connection test failed:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
            return false;
        }
    }

    public async addBook(book: NewBook){

        try{
            console.log('Adding book:', book);
            await this.db.insert(books).values(book)
            const amount = await db.select({ count: count() }).from(books);
            console.log(amount);


            }
        catch(error){
            console.error('Error adding book:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    }

    public async getCompleteTimeSeriesData(timeUnit: TimeUnit, startDate: Date, endDate: Date, bookId: number = -1): Promise<TimeSeriesResult[]> {
        try {
            // Get actual data from the database
            const actualData = await this.getTimeSeriesData(timeUnit, startDate, endDate, bookId);
            
            // Create a map for quick lookup of actual data
            const dataMap = new Map<string, TimeSeriesResult>();
            actualData.forEach(item => {
                dataMap.set(item.timeKey, item);
            });
            
            // Generate all time periods in the range
            let allPeriods: Date[] = [];
            let formatString: string;
            
            switch(timeUnit) {
                case TimeUnit.DAY:  
                    allPeriods = eachDayOfInterval({ start: startDate, end: endDate });
                    formatString = 'yyyy-MM-dd';
                    break;
                case TimeUnit.WEEK:
                    allPeriods = eachWeekOfInterval({ start: startDate, end: endDate });
                    formatString = 'yyyy-MM-dd';
                    break;
                case TimeUnit.MONTH:
                    allPeriods = eachMonthOfInterval({ start: startDate, end: endDate });
                    formatString = 'yyyy-MM';
                    break;
                case TimeUnit.YEAR:
                    allPeriods = eachYearOfInterval({ start: startDate, end: endDate });
                    formatString = 'yyyy';
                    break;
                case TimeUnit.HOUR:
                    allPeriods = eachHourOfInterval({ start: startDate, end: endDate });
                    formatString = 'yyyy-MM-dd HH';
                    break;
                default:
                    throw new Error(`Unsupported time unit: ${timeUnit}`);
            }
            
            // Create complete time series with zeros for missing data
            const completeData: TimeSeriesResult[] = allPeriods.map(date => {
                const timeKey = format(date, formatString);
                const existingData = dataMap.get(timeKey);
                
                if (existingData) {
                    return existingData;
                } else {
                    // Return a period with zero values
                    return {
                        timeKey,
                        totalPages: 0,
                        totalSessions: 0,
                        averagePages: 0,
                        averageMinutes: 0,
                        totalMinutes: 0
                    };
                }
            });
            
            return completeData;
        } catch(error) {
            console.error('Error getting complete time series data:', error);
            return [];
        }
    }

    // Convenience methods using the complete time series function
    public async getAllDaysInMonthComplete(year: number, month: number, bookId: number = -1): Promise<TimeSeriesResult[]> {
        const startDate = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
        const endDate = endOfMonth(startDate);
        
        return this.getCompleteTimeSeriesData(TimeUnit.DAY, startDate, endDate, bookId);
    }

    public async getAllMonthsInYearComplete(year: number, bookId: number = -1): Promise<TimeSeriesResult[]> {
        const startDate = startOfYear(new Date(year, 0, 1));
        const endDate = endOfYear(startDate);
        
        return this.getCompleteTimeSeriesData(TimeUnit.MONTH, startDate, endDate, bookId);
    }

    public async getWeeksInRangeComplete(startDate: Date, endDate: Date, bookId: number = -1): Promise<TimeSeriesResult[]> {
        return this.getCompleteTimeSeriesData(TimeUnit.WEEK, startDate, endDate, bookId);
    }

    /**
     * Gets all books with their latest reading session (if any)
     * Returns all books regardless of whether they have sessions
     */
    public async getAllBooksWithLatestSession(): Promise<BookWithLatestSession[]> {
        try {
            // First get all books
            const allBooks = await this.db.select({
                id: books.id,
                title: books.title,
                authors: books.authors,
                thumbnail: books.thumbnail,
                pages: books.pages
            }).from(books);

            // Prepare result array
            const booksWithLatestSession: BookWithLatestSession[] = [];

            // For each book, try to find its latest session
            for (const book of allBooks) {
                const latestSession = await this.db.select()
                    .from(readingSessions)
                    .where(eq(readingSessions.bookId, book.id))
                    .orderBy(desc(readingSessions.id))
                    .limit(1);

                booksWithLatestSession.push({ 
                    id: book.id,
                    title: book.title,
                    authors: book.authors || '',
                    thumbnail: book.thumbnail || '',
                    pages: book.pages,
                    latestSession: latestSession.length > 0 
                        ? {
                            id: latestSession[0].id,
                            startedAtPage: latestSession[0].startedAtPage,
                            pagesRead: latestSession[0].pagesRead
                        }
                        : null // No sessions for this book
                });
            }

            return booksWithLatestSession;
        }
        catch (error) {
            console.error('Error getting all books with latest session:', error);
            return [];
        }
    }
}

export const booksService = new BooksService();