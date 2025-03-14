import { Bar, CartesianChart,useChartPressState } from "victory-native"
import { LinearGradient, vec,useFont,Circle,Line, Canvas, Text as SKText } from "@shopify/react-native-skia"
import Animated,{ SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import { View,Text, Pressable } from "react-native"
import NativeDropDown from "./NativeDropDown"
import { useEffect, useState } from "react"
import { Icon } from "./Icon"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useQuery } from "@tanstack/react-query"
import { booksService } from "@/services/booksService"
import { Book, ReadingSession } from "@/lib/types"
import { DbReadingSession } from "@/db/schema"
import { isSameDay } from "date-fns"

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons)

const DATA = Array.from({ length: 6 }, (_, index) => ({
  // Starting at 1 for Jaunary
  month: index + 1,
  // Randomizing the listen count between 100 and 50
  listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))


type BarChartProps = {

  color: string,
  type: 'pages' | 'minutes',
  bookId: string
}

type BarChartData = {
  hour: number,
  data: number
}



export default function BarChart({color,type,bookId}: BarChartProps) {

  const animatedHeight = useSharedValue(200)
  const animatedIconRotation = useSharedValue(0)

  const {data} = useQuery<DbReadingSession[]>({
    queryKey: ['details', bookId],
    queryFn: async () => {
      if(bookId === "-1") {
        return await booksService.getReadingSessions();
      }
      else{
        return await booksService.getSessionsByBookId(Number(bookId));
      }
    }
  })

  useEffect(() => {
    if(data){
      getEntries();
    }
  },[data])
  const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12) //Initializing fonts
  const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 14)
  const [dayData,setDayData] = useState<BarChartData[]>([]);

  const {state,isActive} = useChartPressState({x:0,y:{data:0}}) //Initializing chart press state
 /* const yValue: SharedValue<string> = useDerivedValue(() => {
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
  },[state,toolTipFont]) */

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

  const getEntries = () => {

    if(!data) return [];


    const entries = [];

   

    const DATA: BarChartData[] = []
    
    for (let index = 0; index < data.length; index++) {
      const element = data[index];

      if(isSameDay(new Date(element.ended_at),new Date())){
        entries.push(element);
      }
    }
    for(let index = 0; index < 24; index++){
      const hourData: BarChartData = {
        hour: index ,
        data: 0
      }
      hourData.data = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
      for(let index2 = 0; index2 < entries.length; index2++){
        const element = entries[index2];
     
        if(index  === new Date(element.ended_at).getHours()){
          console.log(index);
          hourData.data += element.pagesRead;
        }
      }
      DATA.push(hourData);
    }
    console.log(DATA);
    setDayData(DATA);
  }
 
  
  return (  
    <Pressable style={{flex:1,padding:16,gap:8,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:16}} onPress={onPress}>
      <View className="flex-row  justify-between items-center">
      <View className="flex-col  ">
      <Text className="text-white text-lg font-normal">{type === 'pages' ? 'Pages Read' : 'Minutes Spent'}</Text>
      <Text style={{color:color,fontWeight:'bold',fontSize:28}}  >200</Text>

        </View>
        <AnimatedIonicons style={animatedIconStyle} name="chevron-down" size={24} color="rgba(255,255,255,0.5)"  />
      </View>
      <Animated.View style={animatedStyle}>
        {dayData.length > 0 ? (
           <CartesianChart
           data={dayData}
           
         /* chartPressState={state}
           /**
            * 👇 the xKey should map to the property on data of you want on the x-axis
            */
           xKey="hour"
           /**
            * 👇 the yKey is an array of strings that map to the data you want
            * on the y-axis. In this case we only want the listenCount, but you could
            * add additional if you wanted to show multiple song listen counts.
            */
           domainPadding={{ left: 10, right: 10, top: 20 }}
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
              if(value.toString().length === 1){
                return `0${value} `;
              }
              return `${value} `;
            },
           
           }}
           yKeys={["data"]}>
            
            
           {({ points, chartBounds }) => (
             <>
               <Bar
               chartBounds={chartBounds}  // 👈 chartBounds is needed to know how to draw the bars
               points={points.data}
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
                     {/* <SKText x={textXPosition} y={textYPosition} font={toolTipFont} color="white" text={yValue.value.toString()} /> */}
       
       
                     
                 </>
                   
                   )}
             </>
           
       
             
           )}
         </CartesianChart>
        ) : (
          <Text>No data</Text>
        )}
      </Animated.View>
    </Pressable>
    
  )
}


function Tooltip({x,y}: {x: SharedValue<number>,y: SharedValue<number>}){
  return (
    <Circle cx={x} cy={y} r={4} color="white" />
  )
}
