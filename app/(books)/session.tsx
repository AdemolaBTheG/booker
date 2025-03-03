import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'
import SliderComponent from '@/components/SliderComponent'

export default function Session() {
  return (
    <View className='flex-1 px-4'>
        <View className='flex-col items-center mt-12'>
            <Text className='text-white text-5xl font-bold'>220</Text>
            <Text className='text-white/60 text-xl font-base'>out of 320 pages read</Text>
            <Text className="text-blue-600 text-lg font-medium mt-2">+50 pages</Text>

        </View>
        <View className='flex mt-4 items-center justify-center'>
            <SliderComponent value={0} onValueChange={() => {console.log('value changed')}} min={0} max={100} width={340} height={10} />
        </View>
        <View className='flex items-center justify-center mt-8'>
            <View className='flex flex-row gap-5 w-full '>
                <TextInput placeholder='Date' className='form-select-container flex-1' />
                <TextInput placeholder='Time' className='form-select-container flex-1' />

            </View>
            <View  className='flex flex-row gap-5 w-full mt-4'>
            <TextInput placeholder='Reading Time' className='form-select-container flex-1' />
            <TextInput placeholder='Started at' className='form-select-container flex-1' />
            </View>
            <View className="flex-start flex items-start w-full mt-6">
            <TextInput  placeholder='Notes' multiline={true} textAlignVertical='top'   className="h-40 w-full text-white bg-white/15 rounded-xl border-white/10 border px-3 py-3 mt-3" />

            </View>
        </View>
        <View className="flex-1 items-center justify-center ">
            <Pressable className='btn-primary w-full py-3'>
                <Text className='text-white text-lg font-medium'>Save Session</Text>
            </Pressable>
        </View>
      

    </View>
  )
}