import { View, Text, ScrollView } from 'react-native'
import React, {  useState, useMemo } from 'react'
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import SearchBar from '@/components/SearchBar';
import NativeDropDown from '@/components/NativeDropDown';
import { booksService } from '@/services/booksService';
import { DbBook } from '@/db/schema';
import { FlashList } from '@shopify/flash-list';
import Book from '@/components/Book';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@/components/Icon';

export default function Books() {
    const {filter, title} = useLocalSearchParams();
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
        <>
       
        {booksData?.length && booksData?.length > 0 ? (
            <ScrollView className="flex-1">
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
            </ScrollView>
        ) : (
            <View className="flex-1 items-center mt-48 px-4 w-full">
                <Icon name='library' size={128} color='white' type='ionicons' />
                <Text className="text-white text-lg text-center mt-2">No Books found. {'\n'}Add a Book to your library.</Text>
                <Link href='/(add)' className='bg-cta px-4 py-2 rounded-xl w-full mt-4' asChild>
                    <Text className="text-white text-lg text-center">Add a Book</Text>
                </Link>
            </View>
        )}

</>
       
    );
}
