import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { CartesianChart, Line } from 'victory-native'
import { useFont } from '@shopify/react-native-skia'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Ionicons from "@expo/vector-icons/Ionicons"
import { TimeSeriesResult, TimeUnit } from '@/services/booksService'

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons)

type LineChartProps = {
  color: string,
  timeUnit: TimeUnit,
  data: TimeSeriesResult[] | undefined
}


export default function LineChart({color,timeUnit,data}:LineChartProps) {

  useEffect(() => {
    console.log(data)
  },[data])
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12)
    const animatedHeight = useSharedValue(200)
    const animatedIconRotation = useSharedValue(0)


    const animatedStyle = useAnimatedStyle(() => { //Animation for the view
      return {
        height: animatedHeight.value,
        width: '100%'
      }
    })
  
  
    const animatedIconStyle = useAnimatedStyle(() => { //Animation for the icon
      return{
  
        transform: [{rotate: `${animatedIconRotation.value}deg`}]
      }
    });
  
    const onPress = () => {  //Handling the press event with animations
      if(animatedHeight.value === 0){
        animatedHeight.value = withTiming(200)
        animatedIconRotation.value = withTiming(180)
      }else{
        animatedHeight.value = withTiming(0)
        animatedIconRotation.value = withTiming(0)
      }
  
    }

  return (
    <Pressable style={{flex:1,paddingHorizontal:16,paddingVertical:8,gap:8,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:16}} onPress={onPress}>
          <View className="flex-row  justify-between items-center">
      <View className="flex-col  items-start justify-center">
      <Text className="text-white text-lg font-normal">Reading speed</Text>
      <Text style={{color:color,fontWeight:'bold',fontSize:28}}  >{
      data && data.length > 0 ? (data?.reduce((sum,entry) => sum + entry.averagePages,0) / data?.length).toFixed(2) : 0
      } <Text className='text-white/80 text-lg font-medium'>pages</Text></Text>

        </View>
        <AnimatedIonicons style={animatedIconStyle} name="chevron-down" size={24} color="rgba(255,255,255,0.5)"  />
      </View>
        <Animated.View style={animatedStyle}>
          {data && data.length > 0 ? (
             <CartesianChart data={data} xKey="timeKey" yKeys={["averagePages"]} domainPadding={{ left: 20, right: 20, top: 20 }}
             axisOptions={{
               /**
                * 👇 Pass the font object to the axisOptions.
                * This will tell CartesianChart to render axis labels.
                */
               font,
               labelColor: "white",
               /**
                * 👇 We will also use the formatXLabel prop to format the month number
                * from a number to a month name.
                */
               formatXLabel: (value) => {
                 // Extract hour from timeKey (assuming format "YYYY-MM-DD HH")
                 console.log(value)
                 switch(timeUnit) {
                   case TimeUnit.HOUR:
                     // For hours: "2023-05-01 14" → "14h"
                     const hour = value.split(' ')[1];
                     return `${hour}h`;
                     
                   case TimeUnit.DAY:
                     // For days: "2023-05-01" → "May 1"
                     const date = new Date(value);
                     return date.toLocaleDateString(undefined, { weekday: 'short' });
                     
                   case TimeUnit.MONTH:
                     // For months: "2023-05" → "May"
                     console.log(value)
                     const [first, second,day] = value.split('-');
                     return day;
                     
                   case TimeUnit.YEAR:
                     // For years: "2023" → "2023"
                     const [year, month] = value.split('-');
         const monthDate = new Date(parseInt(year), parseInt(month)-1, 1);
         return monthDate.toLocaleDateString(undefined, { month: 'short' });
                     
                   default:
                     return value;
                 }
               },
               
             }}>
               {({ points }) => (
                 //👇 pass a PointsArray to the Line component, as well as options.
                 <Line
                   points={points.averagePages}
                   color={color}
                   strokeWidth={3}
                   animate={{ type: "timing", duration: 300 }}
                   connectMissingData={true}
                 />
               )}
             </CartesianChart>
          ) : (
            <View className='flex-1 items-center justify-center'>
              <Text className='text-white text-lg font-normal'>No data</Text>
            </View>
          )}
   
    </Animated.View>
    </Pressable>
    
  )
}