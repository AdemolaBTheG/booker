import { View, Text } from 'react-native'
import React from 'react'
import { booksService } from '@/services/booksService'
import { Icon } from './Icon'
import { useQuery } from '@tanstack/react-query'
export default function LongestStreak({bookId}: {bookId: number}) {
  const {data: longestStreak} = useQuery({
    queryKey: ['longestStreak'],
    queryFn: () => {

        if(bookId === -1){
            return booksService.getLongestReadingStreak()
        }else{
            return booksService.getLongestBookReadingStreak(bookId)
        }
    }
  })

  const {data: currentStreak} = useQuery({
    queryKey: ['currentStreak'],
    queryFn: () => {
        if(bookId === -1){
            return booksService.getCurrentReadingStreak()
        }else{
            return booksService.getCurrentBookReadingStreak(bookId)
        }
    }
  })
  return (
    <View className="flex-row items-center justify-between  w-full">
        <View className="flex-row items-center gap-4 bg-white/15 p-4 rounded-2xl">
            <Icon name="local-fire-department" size={36} color="#FF9500" type="material" />
            <View className="flex-col">
                <Text className="text-white text-xl font-medium">{currentStreak} days</Text>
                <Text className="text-white/60 text-sm">Current streak</Text>
            </View>
        </View>
        <View className="flex-row items-center gap-4 bg-white/15 p-4 rounded-2xl">
            <Icon name="trophy" size={36} color="#FFD700" type="ionicons" />
            <View className="flex-col">
                <Text className="text-white text-xl font-medium">{longestStreak} days</Text>
                <Text className="text-white/60 text-sm">Longest streak</Text>
            </View>
        </View>
    </View>
  )
}