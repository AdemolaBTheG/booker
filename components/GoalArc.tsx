import { View, Text } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'

const {width} = Dimensions.get('window')
const {height} = Dimensions.get('window')

export default function GoalArc() {

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
    const foregroundPath = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`
    const skiaForegroundPath = Skia.Path.MakeFromSVGString(foregroundPath)

    if(!skiaBackgroundPath) {
        return (
            <View>
                <Text>GoalArc</Text>
            </View>
        )
    }

  
  return (
      <Canvas style={{height: '100%', width: width}}>
        <Path path={skiaBackgroundPath} style='stroke' strokeCap='round' strokeWidth={strokeWidth} color='grey' />
      </Canvas>
      
  )
}