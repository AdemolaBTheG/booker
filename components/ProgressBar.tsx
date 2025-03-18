import { View, Text, useColorScheme } from 'react-native'
import React from 'react'
import { Canvas, Path, Skia,Text as SkiaText, useFont } from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
const {width} = Dimensions.get('window')

type ProgressBarProps = {
    progress: number
}
export default function ProgressBar({progress}:ProgressBarProps) {
    
    
    const x1 = 5;
    const x2 = 170;
    const y1 = 10;
    const y2 = 10;
    const _STROKE_WIDTH = 5
    const backgroundPath = `M ${x1} ${y1} L ${x2} ${y2}`
    const skiaBackgroundPath = Skia.Path.MakeFromSVGString(backgroundPath)
    const skiaForegroundPath = Skia.Path.MakeFromSVGString(backgroundPath)
    const font = useFont(require('../assets/fonts/SpaceMono-Regular.ttf'), 12) //Initializing fonts


    if(!skiaBackgroundPath || !skiaForegroundPath) {
        return (
            <View>
                <Text>ProgressBar</Text>
            </View>
        )
    }
  return (
    
        <View className='flex-1 flex-col  w-full   justify-center' style={{width:170,height:"100%",gap:0}}>
            <Canvas style={{flex:1,height:20,width:width}}>
          <Path 
            path={skiaBackgroundPath} 
            style="stroke" 
            
            color="black" 
            strokeWidth={_STROKE_WIDTH} 
            strokeCap='round'
            start={0}
            end={1}
          />
          <Path 
            path={skiaForegroundPath} 
            style="stroke" 
            color="white" 
            strokeWidth={_STROKE_WIDTH}
            start={0}
            end={progress}
            strokeCap='round'
          />
        </Canvas>
        <Text style={{color:"white",fontSize:12,textAlign:"right"}} >{Math.round(progress * 100)}%</Text>
        </View>
        
  )
}