import { Book, NewBook, ReadingSession } from '@/lib/types';
import supabase from '../lib/supabase';
import 'react-native-url-polyfill/auto';
import {  ExpoSQLiteDatabase} from 'drizzle-orm/expo-sqlite';
import { books, DbReadingSession, readingSessions,DbBook } from '@/db/schema';
import { db } from '@/lib/db';
import { count, eq, sum } from 'drizzle-orm';
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

    public async getSessionsByBookId(bookId: number):Promise<DbReadingSession[]>{
        try{
            return await this.db.select().from(readingSessions).where(eq(readingSessions.bookId, bookId));
        }
        catch(error){
            console.error('Error getting sessions by book ID:', error);
            return [];
        }
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

    public async getBookById(id: string): Promise<DbBook>{
        try{
            if(!id){
                throw new Error('ID is required');
            }
            const idNumber = Number(id);
            const book = (await this.db.select().from(books)).find(book => book.id === idNumber);

            if(!book){
                throw new Error('Book not found');
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

}

export const booksService = new BooksService();