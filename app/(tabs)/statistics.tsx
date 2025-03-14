import BarChart from '@/components/BarChart'
import BooksGoal from '@/components/BooksGoal'
import GoalArc from '@/components/GoalArc'
import { Icon } from '@/components/Icon'
import LineChart from '@/components/LineChart'
import NativeDropDown from '@/components/NativeDropDown'
import React from 'react'
import { View, Text, ScrollView } from 'react-native'

const stats = [
  {
    key: '0',
    title: 'Today',
  },
  {
    key: '1',
    title: 'Week',
  },
  {
    key: '2',
    title: 'Month',
  },
  {
    key: '3',
    title: 'Year',
  },
  

]

function StatsSeperator({showBorder}:{showBorder:boolean}) {
  return (
    <View className={`h-[1px] w-4/5 self-center  my-12 ${showBorder ? 'bg-white/20' : ''}`} />
  )
}
function StatsSeperate({showBorder}:{showBorder:boolean}) {
  return (
    <View className={`h-[1px] w-4/5 self-center  my-8 ${showBorder ? 'bg-white/20' : ''}`} />
  )
}

function HeaderSeperator() {
  return (
    <View className='h-[1px] w-full  mt-2' />
  )
}

export default function Statistics() {
  const ReadingHeatmap = require('@/components/ReadingHeatmap').default;
  
  return (
   <ScrollView className='flex-1  bg-black'>
    <View className="flex-1  justify-center">
    <GoalArc />
    <StatsSeperate showBorder={false}/>
    <Text className='text-white text-xl font-semibold text-left px-4'>Yearly Reading Goal</Text>
      <HeaderSeperator />
      <View className='flex-1 flex-col w-full h-full items-center justify-center'>
        <BooksGoal />
      </View>
      <Text className='text-white text-lg font-regular text-center mt-2 '>Only <Text className='font-semibold'>20 more books </Text>to go in order to reach your goal, keep reading!</Text>
      <HeaderSeperator />
      <HeaderSeperator />

      <LongestStreak/>
      <StatsSeperate showBorder={true}/>
      <Text className='text-white text-xl font-medium text-left px-4'>Reading Activity</Text>
      <HeaderSeperator />
        <ReadingHeatmap />
        <StatsSeperator showBorder={false} />
        <View className='flex-row items-center justify-between px-4'>
          <Text className='text-white text-xl font-medium text-left px-4'>Trends</Text>
          <NativeDropDown  items={stats}  type="stats" onSelect={() => {}}/>
        </View>
        <HeaderSeperator />
        <View className="flex-1 px-4 gap-4">
        <BarChart color='#F44336' type='pages' bookId='-1'/>
        <BarChart color='#2196F3' type='minutes' bookId='-1'/>
        <LineChart color='#ff7f0e'/>
        </View>
    </View>
   </ScrollView>
  )
}

function LongestStreak() {

  return (
    
    <View className="flex-1 flex-row  items-center gap-4 w-full p-4 ">
      <View className="bg-white/15 p-4 gap-1 rounded-xl flex-1">
      <View className="flex-row items-center justify-between ">
      <Text className='text-white/40  font-medium '>Current Streak</Text>

        <Icon name='flame' type='ionicons' size={28} color='red'/>
      </View>
        <Text className='text-white text-2xl font-semibold text-left'>100 days</Text>
        </View>
      <View className="bg-white/15 p-4 gap-1 rounded-xl flex-1">
      <View className="flex-row items-center justify-between">
      <Text className='text-white/40  font-medium text-left'>Longest Streak</Text>

        <Icon name='calendar' type='ionicons' size={28} color='rgba(255,255,255,0.4)'/>

      </View>
      <Text className='text-white text-2xl font-semibold text-left'>100 <Text className='text-white/40 text-lg  font-medium '>days</Text></Text>
      </View>
    </View>
  )



}
