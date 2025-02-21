import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

export default function Details() {

    const {book} = useLocalSearchParams<{book: string}>();
    console.log(book);
  return (
    <View>
      <Text>details</Text>
    </View>
  )
}