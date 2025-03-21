import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Dimensions } from 'react-native'
import { Canvas,Path, Skia } from '@shopify/react-native-skia'
import Animated, { ReduceMotion, useSharedValue, withTiming,Easing } from 'react-native-reanimated'
import { useGoalStore } from '@/stores/goalStore'
import { booksService } from '@/services/booksService'
import { useQuery } from '@tanstack/react-query';
const {width} = Dimensions.get('window')


export default function GoalArc() {
  
    const {readingGoal} = useGoalStore()
    const date = new Date(readingGoal);
    const goalMinutes = date.getHours() * 60 + date.getMinutes();
    console.log("This is the total minutes",goalMinutes)
    const strokeWidth = 10;
    const center = width / 2;
    const r = (width - strokeWidth) / 2 - 40;
    const startAngle = Math.PI;
    const endAngle = Math.PI * 2;
    const x1 = center - r * Math.cos(startAngle)
    const y1 = -r * Math.sin(startAngle) + center
    const x2 = center - r * Math.cos(endAngle)
    const y2 = -r * Math.sin(endAngle) + center

    const backgroundPath = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`
    const skiaBackgroundPath = Skia.Path.MakeFromSVGString(backgroundPath)
    const foregroundPath = `M ${x2} ${y2} A ${r} ${r} 1 0 1 ${x1} ${y1}`
    const skiaForegroundPath = Skia.Path.MakeFromSVGString(foregroundPath)
    const animatedProgress = useSharedValue(0);
    const {data: maxDuration} = useQuery({
        queryKey: ['maxDuration'],
        queryFn: () => booksService.getMaxDurationForToday()
    })
    const actualMinutes = maxDuration ? maxDuration / (1000 * 60) : 0;
    console.log("This is the actual minutes",actualMinutes)
    const percentage = Math.min(100, (actualMinutes / goalMinutes) );
    console.log("This is the percentage",percentage)
    useEffect(() => {
        animatedProgress.value = withTiming(percentage, {
            duration: 1500,
            easing: Easing.bezier(0.46, -0.09, 0.25, 1.06),
            reduceMotion: ReduceMotion.System,
          })
    },[])

    if(!skiaBackgroundPath || !skiaForegroundPath) {
        return (
            <View>
                <Text>GoalArc</Text>
            </View>
        )
    }

  
  return (
    <View style={{height: 205, width: width,alignItems: 'center',justifyContent: 'center'}}>
      <Canvas style={{flex:1,width:width}}>
        <Path path={skiaBackgroundPath} style='stroke' strokeCap='round' strokeWidth={strokeWidth} color='grey' />
        <Path path={skiaForegroundPath} style='stroke' strokeCap='round' start={0} end={animatedProgress} strokeWidth={strokeWidth} color='#513EC7' />
      </Canvas>
      <View  style={{position: 'absolute',flexDirection: 'column',alignItems: 'center',bottom: 0}}>
        <Text className='text-white text-lg font-medium'>Todays Reading Activity</Text>
        <Text className='text-white text-6xl font-medium '>{actualMinutes.toFixed(0)}:00</Text>
        <Text className='text-white text-base'>of your {goalMinutes}-Minutes-goal</Text> 
      </View>
      </View>
  )
}