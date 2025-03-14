import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams,useNavigation } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import NativeDropDown from '@/components/NativeDropDown';
import { booksService } from '@/services/booksService';
import { BookDB } from '@/lib/types';
import { db } from '@/lib/db';
import { books, DbBook } from '@/db/schema';
import { FlashList } from '@shopify/flash-list';
import BookItem from '@/components/BookItem';
import Book from '@/components/Book';

async function getBooks(): Promise<DbBook[]>{
    const data = await booksService.getBooks();
    return data;
}   

export default function Books() {

    const {filter} = useLocalSearchParams();
    const navigation = useNavigation();
    const [bookList, setBookList] = useState<DbBook[]>([]);
    
    console.log(filter);

    const [search, setSearch] = useState('');
  

 
 

    useEffect(() => {
        navigation.setOptions({
            headerTitle: filter
        })
        const loadBooks = async () => {
            const data = await getBooks();
            setBookList(data);
           
        }
        loadBooks();
    }, [])

    useEffect(() => {
        console.log(bookList);
    }, [bookList])

  return (
    <ScrollView className="flex-1 ">
        <SearchBar 
            onChangeText={(text: string) => setSearch(text)} 
            value={search} 
            placeholder="Search"
            showBorder={false} 
        />  
        <View className="flex flex-row justify-between items-center px-4 ">
            <Text className=" font-base text-lg text-white/40">{bookList.length} Books</Text>
            <NativeDropDown items={[]} onSelect={() => {}} type='filter' />
        </View>
        {
            bookList.length < 0 ? (
                    <Text className='text-white text-base font-medium'>No books found</Text>
            ) : ( <>
            <FlashList data={bookList} renderItem={({item}) => <Book book={item} />} estimatedItemSize={120} />
          
           
            </>)

        }
       
    </ScrollView>
  )
}
