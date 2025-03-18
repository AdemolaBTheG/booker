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
import Calendar from '@/components/Calendar'
import { useQuery } from '@tanstack/react-query'

export default function Index() {
 
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
    
    <View className='flex-1 bg-black items-center justify-center w-full'>
      <Link href="/(tabs)/statistics">
        <Text className="text-white text-lg font-semibold">Go to statistics</Text>
      </Link>
      <Link href="/(onboarding)">
        <Text className="text-white text-lg font-semibold">Go to onboarding</Text>
      </Link>
    </View>
  )
}
