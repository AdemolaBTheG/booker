import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Icon } from '@/components/Icon'
import DatePicker from '@/components/DatePicker'

export default function Notifications() {
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12 w-full">
        <Text className='text-3xl text-center text-white font-bold'><Text className='text-cta'>Double</Text> Your Reading with <Text className='text-cta'>Notifications</Text></Text>
        <Text className='text-center text-white/60'>Get Your Personal Nudge — Tailored Notifications to Keep You on Track</Text>
        <View className="flex-col gap-4 w-full items-center justify-center mt-20">
            <View className="flex-row justify-between items-center w-full bg-white/15 rounded-xl p-3">
                <Text className="text-white  text-lg">Amount</Text>
                <View className="flex-row justify-center items-center gap-12">
                    <Pressable className='bg-white rounded-xl p-2'>
                        <Icon name='add' size={24} color='rgb(255, 255, 255,0.15)' type='material'/>
                    </Pressable>
                    <Text className="text-white  text-lg">10x</Text>
                    <Pressable className='bg-white rounded-xl p-2'>
                        <Icon name='remove' size={24} color='rgb(255, 255, 255,0.15)' type='material'/>
                    </Pressable>
                </View>
            </View>
            <View className='w-full '>
            <View className="flex-row justify-between items-center w-full  bg-white/15  rounded-t-xl rounded-tr-xl p-3" >
                <Text className='text-white text-lg'>From</Text>
                <DatePicker date={new Date()} mode='time' onChange={() => {}} />
            </View>
            <View className='w-full h-[0.8px] bg-white/20'/>
            <View className="flex-row justify-between items-center w-full bg-whit
            e/15 rounded-bl-xl rounded-br-xl p-3">
                <Text className='text-white text-lg'>To</Text>
                <DatePicker date={new Date()} mode='time' onChange={() => {}} />
            </View>
            </View>
           
        </View>

    </View>
    </View>
  )
}