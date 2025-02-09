import supabase from '../lib/supabase';
import 'react-native-url-polyfill/auto';

class BooksService {

    public async searchBooks(searchQuery: string){

      

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

    public async getBookDetails(volumeId: string){

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

}

export const booksService = new BooksService();