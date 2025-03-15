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


export type TimeSeriesResult = {
    timeKey: string;  // Can be day "2023-05-01", month "2023-05", etc.
    totalPages: number;
    totalSessions: number;
    averagePages: number;
    averageMinutes: number;
    totalMinutes: number;
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

}

export const booksService = new BooksService();