import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { CartesianChart, Line } from 'victory-native'
import { useFont } from '@shopify/react-native-skia'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Ionicons from "@expo/vector-icons/Ionicons"

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons)

const data = Array.from({ length: 6 }, (_, index) => ({
    // Starting at 1 for Jaunary
    month: index + 1,
    // Randomizing the listen count between 100 and 50
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))
export default function LineChart({color}:{color:string}) {
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12)
    const animatedIconRotation = useSharedValue(0)


    const animatedIconStyle = useAnimatedStyle(() => {
        return{
    
          transform: [{rotate: `${animatedIconRotation.value}deg`}]
        }
      });

  return (
    <Pressable style={{flex:1,padding:16,gap:8,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:16}} onPress={() => (console.log('pressed'))}>
          <View className="flex-row  justify-between items-center">
      <View className="flex-col  ">
      <Text className="text-white text-lg font-normal">Reading speed</Text>
      <Text style={{color:color,fontWeight:'bold',fontSize:28}}  >200</Text>

        </View>
        <AnimatedIonicons style={animatedIconStyle} name="chevron-down" size={24} color="rgba(255,255,255,0.5)"  />
      </View>
        <View style={{width:'100%',height:200}}>
    <CartesianChart data={data} xKey="month" yKeys={["listenCount"]} domainPadding={{ left: 20, right: 20, top: 20 }}
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
        const date = new Date(2023, value - 1);
        return date.toLocaleString("default", { month: "short" });
      },
      
    }}>
      {({ points }) => (
        //👇 pass a PointsArray to the Line component, as well as options.
        <Line
          points={points.listenCount}
          color={color}
          strokeWidth={3}
          animate={{ type: "timing", duration: 300 }}
        />
      )}
    </CartesianChart>
    </View>
    </Pressable>
    
  )
}