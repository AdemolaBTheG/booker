import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
const amountOfBooks = 10;

export default function BooksGoal() {
    const DESIRED_HEIGHT = 110;
  const aspectRatio = 42.67/61.33; 
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  return (
            <FlashList 
        horizontal={true}
        data={Array.from({length: amountOfBooks}, (_, index) => index + 1)}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT,margin:8,backgroundColor: 'rgba(255,255,255,0.15)',borderRadius: 16,alignItems: 'center',justifyContent: 'center'}}>
            <Text className='text-white text-3xl font-regular'>{item}</Text>
          </View>
        )}
        estimatedItemSize={DESIRED_HEIGHT}
      />
      
   
  )
}