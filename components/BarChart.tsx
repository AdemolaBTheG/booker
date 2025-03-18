import { Bar, CartesianChart,useChartPressState } from "victory-native"
import { LinearGradient, vec,useFont,Circle,Line, Canvas, Text as SKText } from "@shopify/react-native-skia"
import Animated,{ SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import { View,Text, Pressable } from "react-native"
import NativeDropDown from "./NativeDropDown"
import { useEffect, useState } from "react"
import { Icon } from "./Icon"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useQuery } from "@tanstack/react-query"
import { booksService, TimeSeriesResult, TimeUnit } from "@/services/booksService"
import { Book, ReadingSession } from "@/lib/types"
import { DbReadingSession } from "@/db/schema"
import { isSameDay } from "date-fns"

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons)



type BarChartProps = {

  color: string,
  type: 'pages' | 'minutes',
  data: TimeSeriesResult[] | undefined
  timeUnit: TimeUnit,
}

type BarChartData = {
  hour: number,
  data: number
}



export default function BarChart({color,type,data,timeUnit}: BarChartProps) {

  const animatedHeight = useSharedValue(160)
  const animatedIconRotation = useSharedValue(0)
  

  
  const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12) //Initializing fonts
  const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 14)

  const {state,isActive} = useChartPressState({x:0,y:{data:0}}) //Initializing chart press state
  const yValue: SharedValue<string> = useDerivedValue(() => {
    return state.y.data.value.value + (type === 'pages' ? " pages" : " minutes"); //Tooltip initalizing
  },[state])

  const textYPosition = useDerivedValue(() => {
    return state.y.data.position.value - 15
  },[yValue])

  const textXPosition = useDerivedValue(() => {

    if(!font){
      return 0;
    }
    return (state.x.position.value - toolTipFont?.measureText(yValue.value.toString())?.width! / 2 )
  },[state,toolTipFont]) 

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
      animatedHeight.value = withTiming(160)
      animatedIconRotation.value = withTiming(180)
    }else{
      animatedHeight.value = withTiming(0)
      animatedIconRotation.value = withTiming(0)
    }

  }

  
  
  return (  
    <View style={{flex:1,paddingHorizontal:16,paddingVertical:8,gap:8,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:16}}>
      <Pressable className="flex-row  justify-between items-center" onPress={onPress}>
      <View className="">
      <Text className="text-white/60 text-base font-medium">{type === 'pages' ? 'PAGES' : 'MINUTES'}</Text>
      <Text  style={{color:color,fontWeight:'bold',fontSize:32,textAlign:'left'}}  > {type === 'pages' 
    ? data?.reduce((sum, entry) => sum + entry.totalPages, 0) 
    : data?.reduce((sum, entry) => sum + entry.totalMinutes, 0)} <Text style={{color:'rgba(255,255,255,0.5)',fontSize:16,textAlign:'left'}} className="font-semibold">{type === 'minutes' ? 'Minutes' : 'Pages'}</Text></Text>
      

        </View>
        <AnimatedIonicons style={animatedIconStyle} name="chevron-down" size={24} color="rgba(255,255,255,0.5)"  />
      </Pressable>
      <Animated.View style={animatedStyle}>
      {data && data.length > 0 ? (
           <CartesianChart
           data={data}
           
           /**
            * 👇 the xKey should map to the property on data of you want on the x-axis
            */
           xKey="timeKey"
           /**
            * 👇 the yKey is an array of strings that map to the data you want
            * on the y-axis. In this case we only want the listenCount, but you could
            * add additional if you wanted to show multiple song listen counts.
            */
           domainPadding={{ left: 20, right: 20, top: 20 }}
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
           
           }}
           yKeys={type === 'pages' ? ["totalPages"] : ["totalMinutes"]}>
            
            
           {({ points, chartBounds }) => (
             <>
               <Bar
               chartBounds={chartBounds}  // 👈 chartBounds is needed to know how to draw the bars
               points={points[type === 'pages' ? "totalPages" : "totalMinutes"]}
               color={color}
               animate={{type:'spring'}}
               roundedCorners={{
                 topLeft:4,
                 topRight:4,
               }}
                // 👈 points is an object with a property for each yKey
             />
               {isActive && (
                 <>
                   <SKText x={textXPosition} y={textYPosition} font={toolTipFont} color="white" text={yValue.value.toString()} /> 
       
       
                     
                 </>
                   
                   )}
             </>
           
       
             
           )}
         </CartesianChart>
        ) : (
          <Text>No data</Text>
        )}
      </Animated.View>
    </View>
    
  )
}


function Tooltip({x,y}: {x: SharedValue<number>,y: SharedValue<number>}){
  return (
    <Circle cx={x} cy={y} r={4} color="white" />
  )
}
