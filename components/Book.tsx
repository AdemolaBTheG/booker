import { View, Text } from 'react-native'
import React from 'react'
import { DbBook } from '@/db/schema'
import {Image} from 'expo-image'
import { Icon } from './Icon'

export default function Book({book}: {book: DbBook}) {
  return (
    <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
        <Image source={{uri: book.thumbnail}} className="rounded-xl" style={{width: 100, height: 150, borderRadius:16}} contentFit='cover' />
        <View className="flex-col gap-1 items-start justify-center max-w-[150px]">
            <Text numberOfLines={2} style={{ lineHeight: 16 }}
 ellipsizeMode="tail" className='text-white text-base font-semibold'>{book.title}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" className='text-white/40 text-xs' >{book.authors}</Text>
        </View>
        </View>
    </View>
  )
}