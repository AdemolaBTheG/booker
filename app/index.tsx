import { Link, Redirect, useRouter } from 'expo-router'
import React from 'react'
import { View,Text,Modal } from 'react-native'
import {booksService} from '@/services/booksService'
import Donut from '@/components/Donut'
import { CartesianChart, Bar} from 'victory-native'
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia"
import BarChart from '@/components/BarChart'




const data = Array.from({ length: 6 }, (_, index) => ({
  // Starting at 1 for Jaunary
  month: index + 1,
  // Randomizing the listen count between 100 and 50
  listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))
export default function Index() {
  
  return (
    
      <Redirect href="/(tabs)" />
  )
}
