import React from 'react'
import { Stack } from 'expo-router'

export default function SettingsLayout() {
  return (
    <Stack
    screenOptions={{
        
        contentStyle:{
            backgroundColor: '#000000',
          
        },
    
        headerStyle:{
            backgroundColor: '#000000',
        },
        headerTitleStyle:{
            color: 'white',
        },
        
    }}>
        <Stack.Screen name="index" options={{
            headerTitle: 'Settings',
            headerStyle: {
                backgroundColor: '#000000',
            },
            
            headerTitleStyle: {
                color: 'white',
            },
        }} />
    </Stack>
  )
}