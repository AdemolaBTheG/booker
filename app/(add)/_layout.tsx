import { Icon } from '@/components/ui/Icon';
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

        <Stack.Screen name="index" options={{
            headerShown: false,
            headerTitle: 'Add Book',
            

        
            headerSearchBarOptions: {
                placeholder: 'Search',
                textColor: 'white',
            }
         

        }} />
        <Stack.Screen name="manual" options={{
            headerShown: true,
            headerTitle: 'Manually Add Book',
        }} />
        <Stack.Screen name="[id]" options={{
            headerShown: true,
            headerTitle: 'Book Details',
        }} />
        <Stack.Screen name="barcode" options={{
            headerShown: true,
            headerTitle: 'Barcode',
        }} />
    </Stack>
  )




}
