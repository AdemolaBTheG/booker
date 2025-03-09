import GoalArc from '@/components/GoalArc'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'

export default function Statistics() {
  return (
   <ScrollView className=' bg-black'>
      <GoalArc />
      <Text className='text-white text-2xl font-bold' >This is the statistics page</Text>
   </ScrollView>
  )
}
