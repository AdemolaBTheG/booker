import BarChart from '@/components/BarChart'
import BooksGoal from '@/components/BooksGoal'
import Calendar from '@/components/Calendar'
import GoalArc from '@/components/GoalArc'
import LineChart from '@/components/LineChart'
import LongestStreak from '@/components/LongestStreak'
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


  
  return (
   <ScrollView className='flex-1  bg-black'>
    <View className="flex-1  justify-center">
    <GoalArc />
    <StatsSeperate showBorder={false}/>
    <Text className='text-white text-xl font-semibold text-left px-4'>Yearly Reading Goal</Text>
      <HeaderSeperator />
        <BooksGoal />
        <View className='px-4 mt-6'>
      <LongestStreak bookId={-1}/>
      </View>
      

      <StatsSeperate showBorder={true}/>
      <Text className='text-white text-xl font-medium text-left px-4'>Calendar</Text>
      <HeaderSeperator />
      <View className='flex px-4'>
        <Calendar/>
      </View>
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


