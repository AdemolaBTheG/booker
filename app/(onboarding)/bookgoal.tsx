import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Link } from 'expo-router'

export default function BookGoal() {
    const [goal, setGoal] = useState(10)
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12">
        <Text className='text-3xl text-center text-white font-bold'>How many books do you want to read this year?</Text>
        <Text className='text-center text-white/60'>Your Reading Journey Starts with a Goal – What’s Yours?</Text>
    </View>
    <View className='flex items-center justify-center mt-36'>
        <View className="flex-row flex items-center justify-between  w-full px-12">
            <Pressable className='' onPress={() => setGoal(goal - 1)}>
            <Icon name='remove-circle-outline' size={56} color='rgb(255,255,255)' type='ionicons' />
            </Pressable>
            <Text className='text-white text-7xl font-bold'>{goal}</Text>
            <Pressable className='' onPress={() => setGoal(goal + 1)}>
                <Icon name='add-circle-outline' size={56} color='rgb(255,255,255)' type='ionicons' />
            </Pressable>
        </View>
    </View>
        <Link href='/notifications'>
        <Text className='text-white text-center text-lg font-bold'>Continue</Text>
        </Link>
    </View>
  )
}