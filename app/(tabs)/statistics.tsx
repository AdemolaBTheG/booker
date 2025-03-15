import BarChart from '@/components/BarChart'
import BooksGoal from '@/components/BooksGoal'
import GoalArc from '@/components/GoalArc'
import { Icon } from '@/components/Icon'
import LineChart from '@/components/LineChart'
import NativeDropDown from '@/components/NativeDropDown'
import { TimeSeriesResult, TimeUnit } from '@/services/booksService'
import { booksService } from '@/services/booksService'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
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

  const queryClient = useQueryClient()
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR)
const {data} = useQuery<TimeSeriesResult[]>({
  queryKey: ['timeSeriesData'],
  queryFn: () => booksService.getHoursInDay(new Date(), -1)
})

async function changeTimeUnit(time: string) {
  let newData: TimeSeriesResult[] = [];
  switch(time){

    case 'Today':
    newData = await booksService.getHoursInDay(new Date(), -1)
    setTimeUnit(TimeUnit.HOUR)
      break;
      case 'Week':
        newData = await booksService.getDaysInWeek(new Date(), -1)
        setTimeUnit(TimeUnit.DAY)
        break;
    case 'Month':
      newData = await booksService.getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1, -1)
      setTimeUnit(TimeUnit.MONTH)
      break;
 
    case 'Year':
      newData = await booksService.getAllMonthsInYear(new Date().getFullYear(),-1)
      setTimeUnit(TimeUnit.YEAR)
      break;
  
  }
  queryClient.setQueryData(['timeSeriesData'], newData)
}


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
          <NativeDropDown  items={stats}  type="stats" onSelect={changeTimeUnit}/>
        </View>
        <View className="flex-1 px-4 gap-4 mt-2">
        <BarChart color='#F44336' type='pages'  data={data} timeUnit={timeUnit}/>
        <BarChart color='#2196F3' type='minutes'  data={data} timeUnit={timeUnit}/>
        <LineChart color='#ff7f0e' timeUnit={timeUnit} data={data}/>
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
