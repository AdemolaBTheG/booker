import { View, Text } from 'react-native'
import React from 'react'
import { DbBook } from '@/db/schema'
import {Image} from 'expo-image'
import { Icon } from './Icon'
import { Link } from 'expo-router'

export default function Book({book}: {book: DbBook}) {
  return (
    <Link href={ `/(books)/${book.id}/item`} className="flex-row items-center justify-between px-4 mt-5">
        <View className="flex-row items-center gap-2">
        <Image source={{uri: book.thumbnail}} className="rounded-xl "   style={{width: 80, height: 120, borderRadius:16}} contentFit='cover' />
        <View className="flex-col gap-1 items-start justify-center max-w-[150px]">
            <Text numberOfLines={2} style={{ lineHeight: 16 }}
 ellipsizeMode="tail" className='text-white text-base font-semibold'>{book.title}</Text>
            <Text numberOfLines={2} ellipsizeMode="tail" className='text-white/40 text-xs' >{book.authors}</Text>
        </View>
        </View>
    </Link>
  )
}