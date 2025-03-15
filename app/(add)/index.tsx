import { Icon } from '@/components/Icon'
import { Link, router } from 'expo-router'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Pressable, FlatList } from 'react-native'
import { booksService } from '@/services/booksService'
import { Book } from '@/lib/types'
import { FlashList } from '@shopify/flash-list'
import BookItem from '@/components/BookItem'
import { Image as ExpoImage } from 'expo-image'
import { useQuery } from '@tanstack/react-query'
import SearchBar from '@/components/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'

function skeletonBookItem(){
    return(
        <View className='flex-row flex-1 justify-between mt-5'>
            <View className='flex-row w-full justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                    <View className='w-20 h-32 rounded-xl bg-white/10' />
                    <View className='flex-col gap-1 max-w-[150px]'>
                        <View className='h-[18px] w-36 bg-white/10 rounded' />
                        <View className='h-4 w-24 bg-white/10 rounded mt-1' />
                    </View>
                </View>
                <View className='h-[31px] w-[108px] bg-white/10 rounded-lg' />
            </View>
        </View>

    )
}

// Book card component for horizontal lists


export default function Index() {

    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const skeletonItems = Array(10).fill(null);  // Show 6 skeleton items
    const debouncedQuery = useDebounce(query, 500); // 500ms delay
    
    // Sample bestsellers - in production this would come from an API
    

    const { data, isLoading } = useQuery<Book[]>({
        queryKey: ['books', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.length <= 2) return [];
            return await booksService.searchBooks(debouncedQuery);
        },
        enabled: debouncedQuery.length > 2
    });

    // Fetch bestsellers
   

    useEffect(() => {
        if (data) {
            setBooks(data);
        }
       
      
    }, [data]);

  return (
    <View className='flex-1'>
        <SearchBar onChangeText={setQuery} value={query} placeholder='Search' showBorder={true} />
     <ScrollView className='flex-1 px-4' contentInsetAdjustmentBehavior='automatic'>
       
      

        <View className='flex-1 mt-2'>

         {
            query.length != 0 ? (
                <FlashList 
                    data={isLoading ? skeletonItems : books} 
                    renderItem={isLoading ? skeletonBookItem : BookItem} 
                    estimatedItemSize={120}
                />
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className='text-white text-lg font-normal'>Powered by Google</Text>
                    </View>
                   
            )}
        
        </View>
        
        


    </ScrollView>
    </View>
   
  )
}

