import { View, Text } from 'react-native'
import React from 'react'
import RevenueCatUI from 'react-native-purchases-ui';
import { router } from 'expo-router';

export default function Paywall() {
  return (
    
    <View style={{ flex: 1 }}>
    <RevenueCatUI.Paywall 
      onDismiss={() => {
        if(router.canGoBack()){
          router.back()
        }
        else{
          router.replace('/')
        }
      }}
    />
</View>
  )
}