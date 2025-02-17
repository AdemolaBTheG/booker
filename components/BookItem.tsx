import { Link } from 'expo-router'
import React from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { Icon } from './Icon'

import { Book } from '@/lib/types'

const PLACEHOLDER_BLURHASH = 'L5P?:p~q-;M{%jxuNGRj.8t7t7Rj';

export default function BookItem({item}: {item: Book}) {
    console.log(item.thumbnail)
  return (
    <View className='flex-row flex-1 justify-between mt-5'>
        
   
    <Link key={item.id} href={`/(add)/${item.id}`}  >
    <View className='flex-row w-full  justify-between items-center'>
        <View className='flex-row gap-3 items-center'>


        <Image 
            source={{ uri: item?.thumbnail?.replace('http://', 'https://') }} 
            className='w-20 h-32 rounded-xl'
        />



            <View className='flex-col gap-1 max-w-[150px]'>
                <Text 
                    numberOfLines={2}
                    ellipsizeMode="tail" 
                    className='text-white text-base font-semibold'
                    style={{ lineHeight: 16 }}
                >
                    {item.title}
                </Text>
                
                <Text 
                    numberOfLines={2} 
                    ellipsizeMode="tail" 
                    className='text-white/40 text-sm'
                   
                >
                    {item.authors}
                </Text>
               


            </View>
        </View>
       
             <TouchableOpacity 
            className='inline-flex flex-row items-center gap-1 rounded-lg px-2 py-1'
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }} onPress={() => console.log('add book')}
        >
            <Icon name='add' size={24} color='white' type='material' />
            <Text className='text-white text-sm font-semibold'>Add Book</Text>
        </TouchableOpacity>
       

    </View>
</Link>
</View>
  )
}


     
       
