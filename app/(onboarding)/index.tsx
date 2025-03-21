import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import Animated from 'react-native-reanimated'


const readingTypes = [

    {
        emoji: '📚',
        title: 'Book Lover',
    },
    {
        emoji: '🤓',
        title: 'Classic Enthusiast',
    },{
        emoji: '☕',
        title: 'Casual Reader',
    },
    {
        emoji: '📖',
        title: 'Series Devotee',
    },
    {
        emoji: '📰',
        title: 'Non-Fiction Fan',
    },{
        emoji: '📱',
        title:' Digital Reader',
        
    }
    
        
]

export default function Index() {

    const [isFocused, setIsFocused] = useState(-1);

    

    useEffect(() => {
        console.log(isFocused)
    }, [isFocused])
  return (
    <View className='flex-1  items-center px-4'>
        <View className="flex-col items-center justify-center gap-2 mt-12">
            <Text className='text-3xl text-center text-white font-bold'>What kind of a Reader are You?</Text>
            <Text className='text-center text-white/60'>Let's personalize your reading adventure, one page at a time</Text>
        </View>
        <View className="flex items-center justify-center w-full gap-4 mt-7">
            {readingTypes.map((type, index) => (
                <Pressable key={index} onPress={() => {setIsFocused(index); router.push('/bookgoal')}}   className={`flex-row gap-2 items-center justify-center p-3 w-full border  rounded-2xl ${isFocused === index ? 'bg-cta border-white' : ' border-white/20'}`}>
                    <Animated.Text className='text-2xl text-white'>{type.emoji}</Animated.Text>
                    <Text className='text-lg text-white'>{type.title}</Text>
                </Pressable>
            ))}

        </View>
    
    </View>
  )
}