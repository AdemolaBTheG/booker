import { View, Text } from 'react-native'
import React from 'react'
import Slider from '@react-native-community/slider';

type SliderComponentProps = {
    value: number;
    onValueChange: (value: number) => void;
    min: number;
    max: number;
    width: number;
    height: number;
}
export default function SliderComponent({value, onValueChange, min, max, width, height}: SliderComponentProps) {
  return (
    <Slider
    value={value}
    onValueChange={onValueChange}
    minimumValue={min}
    maximumValue={max}
    style={{width: width, height: height}}
    />
    )
    }