import { Link, Redirect, router, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View,Text,Modal, Button, Pressable } from 'react-native'
import {booksService} from '@/services/booksService'
import Donut from '@/components/Donut'
import { CartesianChart, Bar} from 'victory-native'
import { LinearGradient, Path, useFont, vec } from "@shopify/react-native-skia"
import BarChart from '@/components/BarChart'
import { Appearance, useColorScheme } from 'react-native';
import RevenueCatUI from 'react-native-purchases-ui';
import Purchases from 'react-native-purchases'
import Toast from 'react-native-toast-message'
import ProgressBar from '@/components/ProgressBar'
import { usePostHog } from 'posthog-react-native'

const data = Array.from({ length: 6 }, (_, index) => ({
  // Starting at 1 for Jaunary
  month: index + 1,
  // Randomizing the listen count between 100 and 50
  listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))
export default function Index() {
  const colorScheme = useColorScheme();
 
  const showToast = () => {
    Toast.show({
      text1: 'Book added',
      text2: 'Book added to your library',
      type: 'success',
      position: 'top',
      topOffset: 80,
    })
  }
  
  useEffect(() => {
    console.log('test')

    async function test() {
    try {
      console.log(process.env.EXPO_PUBLIC_REVENUECAT_IOS)
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        // Display packages for sale
        console.log(offerings)
      }
    } catch (e) {
      console.log(e)
    }

    }
    test()
  }, [])

  return (
    
    <View className='flex-1 bg-black items-center justify-center'>
      <Link href='/(onboarding)' asChild>
      <Text className='text-white'>Go to onboarding</Text>
      </Link>
      <Text className='text-white'>Go to home</Text>
      <Button title='Go to home' onPress={() => router.push('/(tabs)')} />
        <Pressable className='bg-white/60 p-2 rounded-md mt-16' onPress={() => showToast()}><Text className='text-white'>Show toast</Text></Pressable>
    </View>
  )
}
