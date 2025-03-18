import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Link, router } from 'expo-router'
import { useGoalStore } from '@/stores/goalStore'
export default function BookGoal() {
    const {bookGoal,increaseBookGoal,decreaseBookGoal} = useGoalStore()
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12">
        <Text className='text-3xl text-center text-white font-bold'>How many Books do you want to read this Year?</Text>
        <Text className='text-center text-white/60'>Your Reading Journey Starts with a Goal – What’s Yours?</Text>
    </View>
    <View className='flex items-center justify-center mt-36'>
        <View className="flex-row flex items-center justify-between  w-full px-12">
            <Pressable className='' onPress={() => decreaseBookGoal()}>
            <Icon name='remove-circle-outline' size={64} color='rgb(255,255,255)' type='ionicons' />
            </Pressable>
            <Text className='text-white text-7xl font-bold'>{bookGoal}</Text>
            <Pressable className='' onPress={() => increaseBookGoal()}>
                <Icon name='add-circle-outline' size={64} color='rgb(255,255,255)' type='ionicons' />
            </Pressable>
        </View>
       
    </View>
    <Pressable className="absolute bottom-24 bg-cta w-full rounded-2xl p-3" onPress={() => router.push('/readingGoal')}>
        <Text className='text-white text-center text-lg font-bold '>Continue</Text>
        </Pressable>
    </View>
    )
    }