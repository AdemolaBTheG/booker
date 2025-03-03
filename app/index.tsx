import { Link, Redirect, useRouter } from 'expo-router'
import React from 'react'
import { View,Text,Modal } from 'react-native'
import {booksService} from '@/services/booksService'
export default function index() {
  
  return (
    <View className='flex-1 items-center px-20 justify-center'>
     
        <Link className='text-white' href='/(tabs)'>Go to Home</Link>
        
    </View>
  )
}
