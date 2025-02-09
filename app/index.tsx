import { Link } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import {booksService} from '@/services/booksService'
export default function index() {
  
  return (
    <View className='flex-1 items-center justify-center'>
        <Link className='text-white' href='/(tabs)'>Go to Home</Link>
    </View>
  )
}
