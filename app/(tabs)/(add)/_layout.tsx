import { Icon } from '@/components/ui/Icon'
import { router, Stack } from 'expo-router'
import React from 'react'
import { Pressable } from 'react-native'

export default function AddLayout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: 'white',
      animation: 'slide_from_right',
      headerLeft: () => (
        <Pressable 
          onPress={() => router.back()}
          className="ml-4"
        >
          <Icon name="arrow-back" size={24} color="white" />
        </Pressable>
      ),
    }}
  >
    <Stack.Screen 
      name="index"
      options={{
        title: 'Add Book',
      }}
    />
  </Stack>
    
  )
}
