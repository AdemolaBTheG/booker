import { View, Text } from 'react-native'
import React from 'react'

export default function ReadGoal() {
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12">
        <Text className='text-3xl text-center text-white font-bold'>How much do you read in a day?</Text>
        <Text className='text-center text-white/60'>Your Reading Journey Starts with a Goal – What’s Yours?</Text>
    </View>
    </View>
  )
}