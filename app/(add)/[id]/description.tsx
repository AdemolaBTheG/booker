import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { Book } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { DbBook } from '@/db/schema';

export default function Description() {

    const {id} = useLocalSearchParams<{id: string}>();
    const {data} = useQuery<Book | DbBook>({
        queryKey: ['details',id],
        queryFn: async () => {
            if(id === '-1') throw new Error('Could not get details');
            let dbBook = await booksService.getBookById(id);
            
            if(!dbBook) {
                let book = await booksService.getBookDetails(id);
                if(!book) throw new Error('Could not get details');
                return book;
            }
            return dbBook;
        }
    })

  
  return (
    <ScrollView className='flex-1  px-4 '>
        <View className='mt-8 flex-1 items-center '>
            <Text className='text-white text-2xl font-semibold text-left '>By Publisher</Text>
            <View className='h-1 w-1/5 bg-white/20 my-6 rounded-2xl'/>
            <Text className='text-white/80 text-xl font-medium text-left '>{data?.description}</Text>
        </View>
     
    </ScrollView>
  )
}