import { Icon } from '@/components/ui/Icon'
import { Link } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import { booksService } from '@/services/booksService'
import { Book } from '@/lib/types'
import { FlashList } from '@shopify/flash-list'


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

 function BookItem({item}: {item: Book}) {
  return (
    <Link key={item.id} href={`/(add)/${item.id}`}  className='flex-row flex-1 justify-between mt-5'>
    <View className='flex-row w-full  justify-between items-center'>
        <View className='flex-row gap-3 items-center'>


        <Image source={{ uri: item?.thumbnail?.replace('http://', 'https://')}} className='w-20 h-32 rounded-xl ' resizeMode='cover' />



            <View className='flex-col gap-1 max-w-[150px]'>
                <Text 
                    numberOfLines={2}
                    ellipsizeMode="tail" 
                    className='text-white text-base font-semibold'
                    style={{ lineHeight: 16 }}
                >
                    {item.title}
                </Text>
                
                <Text 
                    numberOfLines={2} 
                    ellipsizeMode="tail" 
                    className='text-white/40 text-sm'
                   
                >
                    {item.authors}
                </Text>
               


            </View>
        </View>
       
             <TouchableOpacity 
            className='inline-flex flex-row items-center gap-1 rounded-lg px-2 py-1'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}
        >
            <Icon name='add' size={24} color='white' type='material' />
            <Text className='text-white text-sm font-semibold'>Add Book</Text>
        </TouchableOpacity>
       

    </View>
</Link>
  )
}



function SearchBar({ onChangeText, value }: { onChangeText: (text: string) => void, value: string }) {
    return (
        <View className='flex items-center justify-center py-5 px-4 border-b border-white/20'>
            <View className='flex-row gap-1 items-center bg-white/10 rounded-2xl px-2 py-2'>
                <Icon 
                    name='search' 
                    size={28} 
                    color="rgba(255, 255, 255, 0.4)"
                    type='material'

                />
                <TextInput 
                    className='flex-1 text-white' 
                    placeholder='Search' 
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor='rgba(255, 255, 255, 0.4)'
                    textAlignVertical="center"
                    textAlign='left'
                    style={{fontSize: 18}}
                />
            </View>
        </View>
    )
}

export default function Index() {

    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const skeletonItems = Array(10).fill(null);  // Show 6 skeleton items


    useEffect(() => {
        if(!query.trim()) {
            setBooks([]);
            return;
        }
        if(query.length > 2){
            
            setIsLoading(true);

            const timeoutId = setTimeout(async () => {
                try {
                    console.log('Searching for:', query);
                    const results = await booksService.searchBooks(query);
                   
                    console.log(results[0].thumbnail);
                    if (!Array.isArray(results)) {
                        console.error('Results is not an array:', results);
                        setBooks([]);
                        return;
                    }

                    results.forEach(book => {
                       Image.prefetch(book.thumbnail?.replace('http://', 'https://'));
                    });
                    setBooks(results);
                } catch (error) {
                    console.error('Search failed:', {
                        error,
                        message: error instanceof Error ? error.message : 'Unknown error'
                    });
                    setBooks([]);
                } finally {
                    setIsLoading(false);
                }
            }, 500);
    
            return () => clearTimeout(timeoutId);

        }
       
    }, [query]);



  return (
    <View className='flex-1  '>

      <SearchBar onChangeText={setQuery} value={query} />
     <ScrollView className='flex-1 px-4' contentInsetAdjustmentBehavior='automatic'>
       
      

        <View className='flex-1 mt-2'>

         {
            query.length != 0 ?
            ( <FlashList data={isLoading ? skeletonItems : books} renderItem={isLoading ? skeletonBookItem :  BookItem}  estimatedItemSize={120}/>)


           : (<><Link href='/barcode'>
           
           <View className='flex-row items-center gap-4 py-4  p-2 border-white/20 border-b '>
                <Icon name='barcode-outline' size={28} color='white' type='ionicons' />
                <View className='flex-1'>
    
                    <Text className='text-white text-base font-semibold'>Add books via QR-Code</Text>
                    <Text className='text-white/40 text-sm '>Use your camera to scan a book's barcode and add it to your library instantly.</Text>
                </View>
            </View>
            </Link>
            <Link href='/manual'>
            <View className='flex-row items-center gap-4  py-4 p-2 border-white/20 border-b '>
                <Icon name='create' size={28} color='white' type='material' />
                <View className='flex-1'>
    
                    <Text className='text-white text-base font-semibold'>Manually add your book</Text>
                    <Text className='text-white/40 text-sm '>Enter your book's details yourself—perfect for custom or rare titles.</Text>
                </View>
            </View>
            </Link></>)
        }
        
        </View>
        
        


    </ScrollView>
    </View>
   
  )
}

