import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import { useGoalStore } from '@/stores/goalStore';
import { booksService } from '@/services/booksService';
import { useQuery } from '@tanstack/react-query';
export default function BooksGoal() {
    const {bookGoal} = useGoalStore()
    const {data} = useQuery({
        queryKey: ['readingSessionsByBook'],
        queryFn: () => booksService.getReadingSessionsByBook()
    })
    const DESIRED_HEIGHT = 110;
  const aspectRatio = 42.67/61.33; 
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  return (
    <View className='flex w-full'>
       <FlashList 
        horizontal={true}
        data={Array.from({length: bookGoal}, (_, index) => index + 1)}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View>
            <Text className='text-white text-lg font-medium'>{item}</Text>
            
          </View>
        )}
        estimatedItemSize={DESIRED_HEIGHT}
      />
    </View>

           
      
   
  )
}