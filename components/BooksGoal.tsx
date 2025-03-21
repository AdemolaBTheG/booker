import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import { useGoalStore } from '@/stores/goalStore';
import { booksService } from '@/services/booksService';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Icon } from './Icon';
export default function BooksGoal() {
    const {bookGoal} = useGoalStore()
    const {data : readingSessionsByBook} = useQuery({
        queryKey: ['readingSessionsByBook'],
        queryFn: () => booksService.getReadingSessionsByBook()
    })

    console.log(readingSessionsByBook?.length)
    const DESIRED_HEIGHT = 130;
  const aspectRatio = 42.67/61.33; 
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  return (
 <>
       <FlashList 
        horizontal={true}
        data={Array.from({length: bookGoal}, (_, index) => index + 1)}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => {
          return readingSessionsByBook?.[item - 1] ? (
            <Image source={{uri: readingSessionsByBook?.[item - 1]?.books?.thumbnail}} style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT,borderRadius: 12,marginLeft: 12}} />
          ) : (
            <View style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT,borderRadius: 12,marginLeft: 12, backgroundColor: 'rgba(255,255,255,0.15)',alignItems: 'center', justifyContent: 'center'}}>
                <Text className='text-white/40 text-lg font-medium'>{item}</Text>
            </View>
          );
        }}
        estimatedItemSize={DESIRED_HEIGHT}
      />
      {bookGoal - (readingSessionsByBook?.length ?? 0) > 0 ? (
      <Text className='text-white text-lg font-regular text-center mt-2 px-4'>Only <Text className='font-semibold'>{bookGoal - (readingSessionsByBook?.length ?? 0)} more books </Text>to go in order to reach your goal, keep reading!</Text>
      ) : (
        <Text className='text-white text-lg font-regular text-center mt-2 px-4'><Text className='font-semibold'>Well done!</Text> You've sucessfully reached your goal, keep reading!</Text>
      )}



      </>

           
      
   
  )
}