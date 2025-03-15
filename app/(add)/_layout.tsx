import { Icon } from '@/components/Icon';
import { Stack } from 'expo-router'
import React, { memo, useCallback, useState } from 'react'
import { TextInput, View } from 'react-native'


export default function AddLayout() {
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
        
    }}
    >
n 
        <Stack.Screen name="index" options={{
            headerShown: false,
            

        
         
         

        }} />
 
     
        <Stack.Screen name="barcode" options={{
            headerShown: true,
            headerTitle: 'Barcode',
            headerShadowVisible: false,

        }} />
        
        <Stack.Screen name="[id]/edit" options={{
            headerShown: true,
            headerTitle: 'Book Edit',
        }} />
        <Stack.Screen name="[id]/details" options={{
            headerShown: true,
            headerTitle: 'Book Details',
        }} />
        <Stack.Screen name="[id]/description" options={{
            headerShown: true,
            headerTitle: 'Description',
        }} />
     
    </Stack>
  )




}
