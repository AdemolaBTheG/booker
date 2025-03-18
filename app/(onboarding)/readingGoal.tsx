import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import DatePicker from '@/components/DatePicker'
import { router } from 'expo-router'
import { useGoalStore } from '@/stores/goalStore'
import { DateTimePickerEvent } from '@react-native-community/datetimepicker'
export default function ReadingGoal() {
    const {readingGoal,updateReadingGoal} = useGoalStore()
    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        updateReadingGoal(selectedDate as Date)
      };

 

   const date = new Date(readingGoal)
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12 w-full">
        <Text className='text-3xl text-center text-white font-bold'>How much do you want to read in a day?</Text>
        <Text className='text-center text-white/60'>Get Your Personal Nudge — Tailored Notifications to Keep You on Track</Text>
    </View>
    <View className="flex-col gap-4 w-full items-center justify-center mt-20">
            <View className="flex-row justify-between items-center w-full bg-white/15 rounded-2xl p-3">
                <Text className="text-white  text-lg">Time</Text>
                <DatePicker date={date || new Date()} mode='time' onChange={onChange} />
            </View>
    </View>
    <Pressable className="absolute bottom-24 bg-cta w-full rounded-2xl p-3" onPress={() => router.push('/notifications')}>
        <Text className='text-white text-center text-lg font-bold '>Continue</Text>
        </Pressable>
    </View>
  )
}