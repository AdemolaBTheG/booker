import { Link} from 'expo-router'
import React, { useEffect } from 'react'
import { View,Text } from 'react-native'

import Purchases from 'react-native-purchases'
import Toast from 'react-native-toast-message'


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
    async function test() {
      const customerInfo = await Purchases.getCustomerInfo()
      const activeEntitlements = customerInfo.entitlements.active["Plus"]
      console.log(activeEntitlements)
      if(activeEntitlements) {
        console.log("User has Plus")
      } else {
        console.log("User does not have Plus")
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
