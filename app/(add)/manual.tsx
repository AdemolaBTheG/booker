import { Icon } from '@/components/Icon'
import NativeDropDown from '@/components/NativeDropDown'
import { Link } from 'expo-router'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import * as DropdownMenu from 'zeego/dropdown-menu'


const  readingStatus = [
  {
    key: '1',
    title: 'Reading',
    icon: '',
    iconAndroid: 'book',
  },
  {
    key: '2',
    title: 'Finished',
    icon: 'checkmark',
    iconAndroid: 'book',
  },
  {
    key: '3',
    title: 'Cancelled',
    icon: 'book',
    iconAndroid: 'book',
  },

]

export default function Manual() {
  return (
      <ScrollView className='flex-1 px-4'>
      <View className="flex flex-row items-center justify-between p-3 mt-5 border bg-white/15 border-white/10 rounded-xl">
        <View className="flex flex-row items-center gap-3">
        <View className="w-14 h-20 bg-white rounded-lg"/>
          <View className=" flex-col ">
            <Text className="text-white text-lg font-semibold">Book Title</Text>
            <Text className="text-white/50 text-sm">Author Name</Text>
          </View>
        </View>
        <Link href="/#">
          <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.2)" type="material" />
        </Link>
        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Reading Acivity</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Reading Status</Text>
          <NativeDropDown items={[]} onSelect={function (value: string): void {
            throw new Error('Function not implemented.')
          } }/>
        </View>
        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Collection & Ownership</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Ownership Status</Text>
        </View>
        </View>
  
      </ScrollView>

    
      
   
      
  )
}
