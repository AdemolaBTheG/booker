import { Icon } from '@/components/Icon'
import NativeDropDown from '@/components/NativeDropDown'
import { Link } from 'expo-router'
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Pressable, TextInput } from 'react-native'
import * as DropdownMenu from 'zeego/dropdown-menu'


const handlePress = (key:string) => {
  console.log(key)
}

const  readingStatus = [
  {
    key: '1',
    title: 'Reading',
    icon: 'book',
    iconAndroid: 'menu_book_24px',
  },
  {
    key: '2',
    title: 'Finished',
    icon: 'checkmark',
    iconAndroid: 'check_24px',
  },
  {
    key: '3',
    title: 'Cancelled',
    icon: 'xmark',
    iconAndroid: 'close_24px',
  },

]

function Seperator(){

  return(
    <View className="w-full h-px bg-white/10 px-0"/>
  )
}


export default function Manual() {
  return (
    <View className='flex-1 '>
    
      <ScrollView className='flex-1 px-4'>


        <View className="flex items-center justify-center border w-28 mx-auto h-36 border-white rounded-xl">
          <Icon name='add' size={28} className='' color='white' type='material' />
        </View>
        <View className="flex flex-col p-3 mt-5 items-center gap-4 justify-center bg-white/15 rounded-xl border-white/10 border">
          <View className="flex flex-row justify-between w-full  items-center  border-white/10">
              <Text className='text-white/40 font-semibold'>Title</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='  text-white/40 font-semibold'>Author</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold'>Pages</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold'>Format</Text>
            
         <NativeDropDown items={[]} onSelect={handlePress} />
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold pr-2'>Publisher</Text>
            
            <TextInput className="flex-1 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold'>Year</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold'>ISBN 10</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>
          <View className="flex flex-row justify-between w-full  items-center">
              <Text className='text-white/40 font-semibold'>ISBN 13</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' />
            
          
          </View>

        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Reading Acivity</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Reading Status</Text>
          <NativeDropDown items={readingStatus} onSelect={handlePress} />
        </View>
        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Collection & Ownership</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Ownership Status</Text>
         <NativeDropDown items={ []} onSelect={handlePress} />
        </View>
        </View>
       
      </ScrollView>
      <View className="absolute bottom-0 flex  left-0 right-0 bg-black   border-t border-white/10">
      <View className='flex-row items-center justify-center p-4'>
      <Pressable onPress={() => console.log("Hello")} className='btn-primary gap-1 mb-12 p-4 w-full '>
            <Icon name='add' size={28} color='white' type='material' />
            <Text className='text-white text-lg font-semibold'>Add To Library</Text>
          </Pressable>
      </View>
         
        </View>
    </View> 

      
   
      
  )
}
