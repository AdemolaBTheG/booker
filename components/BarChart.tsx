import { Bar, CartesianChart,useChartPressState } from "victory-native"
import { LinearGradient, vec,useFont,Circle,Line, Canvas, Text } from "@shopify/react-native-skia"
import { SharedValue, useDerivedValue } from "react-native-reanimated"
import { View } from "react-native"

const data = Array.from({ length: 6 }, (_, index) => ({
  // Starting at 1 for Jaunary
  month: index + 1,
  // Randomizing the listen count between 100 and 50
  listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
}))


type BarChartProps = {

  color: string
}



export default function BarChart({color}: BarChartProps) {

  const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12)
  const toolTipFont = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 14)

  const {state,isActive} = useChartPressState({x:0,y:{listenCount:0}})
  const yValue: SharedValue<string> = useDerivedValue(() => {
    return state.y.listenCount.value.value + " pages";
  },[state])

  const textYPosition = useDerivedValue(() => {
    return state.y.listenCount.position.value - 15
  },[yValue])

  const textXPosition = useDerivedValue(() => {

    if(!font){
      return 0;
    }
    return (state.x.position.value - toolTipFont?.measureText(yValue.value.toString())?.width! / 2 )
  },[state,toolTipFont])

  return (  
    <CartesianChart
    data={data}
   chartPressState={state}
    /**
     * 👇 the xKey should map to the property on data of you want on the x-axis
     */
    xKey="month"
    /**
     * 👇 the yKey is an array of strings that map to the data you want
     * on the y-axis. In this case we only want the listenCount, but you could
     * add additional if you wanted to show multiple song listen counts.
     */
    domainPadding={{ left: 50, right: 50, top: 50 }}
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
      
    }}
    yKeys={["listenCount"]}>
     
     
    {({ points, chartBounds }) => (
      <>
        <Bar
        chartBounds={chartBounds}  // 👈 chartBounds is needed to know how to draw the bars
        points={points.listenCount}
        color={color}
        animate={{type:'spring'}}
        roundedCorners={{
          topLeft:4,
          topRight:4,
        }}
        barWidth={20}
         // 👈 points is an object with a property for each yKey
      />
        {isActive && (
          <>
              <Text x={textXPosition} y={textYPosition} font={toolTipFont} color="white" text={yValue.value.toString()} />


              
          </>
            
            )}
      </>
    

      
    )}
  </CartesianChart>
  )
}


function Tooltip({x,y}: {x: SharedValue<number>,y: SharedValue<number>}){
  return (
    <Circle cx={x} cy={y} r={4} color="white" />
  )
}
