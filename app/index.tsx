import { Link, Redirect, router, useRouter } from 'expo-router'
import React from 'react'
import { View,Text,Modal, Button } from 'react-native'
import {booksService} from '@/services/booksService'
import Donut from '@/components/Donut'
import { CartesianChart, Bar} from 'victory-native'
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia"
import BarChart from '@/components/BarChart'
import { Appearance, useColorScheme } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';


const data = Array.from({ length: 6 }, (_, index) => ({
  // Starting at 1 for Jaunary
  month: index + 1,
  // Randomizing the listen count between 100 and 50
  listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))
export default function Index() {
  const colorScheme = useColorScheme();
  

  return (
    
    <View className='flex-1 bg-black items-center justify-center'>
      <Text className='text-white'>Go to home</Text>
      <Button title='Go to home' onPress={() => router.push('/(tabs)')} />
    </View>
  )
}
