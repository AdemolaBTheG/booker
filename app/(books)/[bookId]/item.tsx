import { View, Text, ScrollView, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Link, useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { DbBook } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
export default function BookItem() {
 
    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const [book, setBook] = useState<DbBook | null>(null);
    useEffect(() =>{

        const fetchBook = async () => {
            const book = await booksService.getBookById(bookId);
            setBook(book);
        }

        fetchBook();

    },[bookId])

    if(!book){
        return <View className='flex-1 items-center justify-center'>
            <Text>Loading...</Text>
        </View>
    }
    const DESIRED_HEIGHT = 260; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); //calculated width of the image



  return (
    <ImageBackground source={{uri: book?.thumbnail?.replace('http://', 'https://')}} className='flex-1 '>
      <BlurView intensity={100} className='flex-1 '>
      <ScrollView className='flex-1 '>
      <View className='flex-1 items-center justify-center px-4'>
      <View className='mt-16'>
        <Image source={{uri: book?.thumbnail?.replace('http://', 'https://')}} cachePolicy='disk'  contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 20,borderColor:"white",borderWidth:1}} />
      </View>
      <View className="flex items-center gap-1 mt-6">
          <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
          <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
        </View>
        <Link href={`/(books)/${bookId}/timer`}  className="mt-6  p-4 bg-cta rounded-full flex items-center justify-center"><Icon name='play' size={32} color='white' type='ionicons' /></Link>
      </View>
    

    </ScrollView>
      </BlurView>
    </ImageBackground>
    
  )
}