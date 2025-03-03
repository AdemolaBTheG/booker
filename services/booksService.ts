import { Book, NewBook } from '@/lib/types';
import supabase from '../lib/supabase';
import 'react-native-url-polyfill/auto';
import { drizzle, ExpoSQLiteDatabase, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { books } from '@/db/schema';
import { db } from '@/lib/db';
import { useSQLiteContext } from 'expo-sqlite';
import { count } from 'drizzle-orm';
import { DbBook } from '@/db/schema';
class BooksService {

    private db: ExpoSQLiteDatabase;
    constructor(){
        this.db = db;
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