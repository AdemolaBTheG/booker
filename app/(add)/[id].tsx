import { Book } from '@/lib/types';
import { booksService } from '@/services/booksService';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, } from 'react-native'
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/ui/Icon';
export default function BookDetails() {

  const PLACEHOLDER_BLURHASH = 'L5P?:p~q-;M{%jxuNGRj.8t7t7Rj';
  const DESIRED_HEIGHT = 240;
  const aspectRatio = 42.67/61.33; 
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  console.log(CALCULATED_WIDTH,DESIRED_HEIGHT);
    const {id} = useLocalSearchParams<{id: string}>();
     console.log(id);
    const [book,setBook] = useState<Book | null>(null);
    const fetchBookDetails = async () => {
        const results = await booksService.getBookDetails(id);
        console.log(results);
        setBook(results);
    };



    useEffect(() => {
    
        fetchBookDetails();
    }, [id]);

  return (

      <ScrollView className='flex-1  px-4'>
        <View className='flex-1 items-center'>
        <View className=' mt-16'>
          <Image source={{uri: book?.thumbnail}} cachePolicy='memory' placeholder={PLACEHOLDER_BLURHASH} contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 16}} />
        </View>

        <View className="flex items-center gap-1 mt-6">
          <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
          <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
        </View>

        <TouchableOpacity className="inline-flex flex-row items-center justify-center gap-2 mt-6 p-2 w-full bg-cta rounded-xl"><Icon name='add' size={20} color='white' /><Text className='text-white text-base font-semibold'>Add To Library</Text></TouchableOpacity>


        <View className='mt-10 w-full'>
          <Text className='text-white text-lg font-semibold text-left'>About</Text>
          <Text className='text-white/80 text-base font-semibold text-left'>{book?.description}</Text>
        </View>
        </View>
        

      </ScrollView>
      

    
    
    
    


 
      

  )
}

