import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import NativeDropDown from '@/components/NativeDropDown';
import { booksService } from '@/services/booksService';
import { BookDB } from '@/lib/types';
import { db } from '@/lib/db';
import { books, DbBook } from '@/db/schema';
import { FlashList } from '@shopify/flash-list';
import BookItem from '@/components/BookItem';
import Book from '@/components/Book';
import { useQuery } from '@tanstack/react-query';

async function getBooks(): Promise<DbBook[]>{
    const data = await booksService.getBooks();
    return data;
}   

export default function Books() {
    const {filter, title} = useLocalSearchParams();
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    
    const {data: booksData} = useQuery({
        queryKey: ['books', filter, title],
        queryFn: async () => {
            if(filter === 'Library') {
                return await booksService.getBooks();
            } else {
                return await booksService.getBooksByFilter(title as string, filter as string);
            }
        }
    });

    // Filter books based on search term (do filtering before rendering)
    const filteredBooks = useMemo(() => {
        if (!booksData) return [];
        if (!search.trim()) return booksData;
        
        return booksData.filter(book => 
            book.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [booksData, search]);



    return (
        <ScrollView className="flex-1">
            {booksData?.length && booksData?.length > 0 ? (
                <>
                    <SearchBar 
                        onChangeText={(text: string) => setSearch(text)} 
                        value={search} 
                        placeholder="Search for book"
                        showBorder={false} 
                    />  
                    <View className="flex flex-row justify-between items-center px-4">
                        <Text className="font-base text-lg text-white/40">
                            {filteredBooks.length} {filteredBooks.length > 1 ? 'Books' : 'Book'}
                        </Text>
                        <NativeDropDown items={[]} onSelect={() => {}} type='filter' />
                    </View>
                    <FlashList
                        data={filteredBooks} // Use filtered data here
                        renderItem={({item}) => <Book book={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        estimatedItemSize={120}
                    />
                </>
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white/40 text-lg">No books found</Text>
                </View>
            )}
        </ScrollView>
    );
}
