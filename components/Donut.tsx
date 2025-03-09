import { View, Text, Animated, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { Circle, G } from 'react-native-svg'

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
type AnimatedCircleRef = Circle & {
  setNativeProps: (props: object) => void;
};

// Add this type definition
type TextInputRef = TextInput & {
  setNativeProps: (props: {text: string}) => void;
};


interface DonutProps {
    percentage: number;
    max: number;
}
// Define constants outside the component
const RADIUS = 45;
const STROKE_WIDTH = 10;
const COLOR = '#513EC7';

export default function Donut({percentage, max}: DonutProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const radius = RADIUS;
    const strokeWidth = STROKE_WIDTH;
    const color = COLOR;
    const delay = 0;
    const duration = 500;
    const circleRef = useRef<AnimatedCircleRef>();
    const inputRef = useRef<TextInputRef>(null);
    const animation = (toValue: number) => {
        return Animated.timing(animatedValue, { toValue, duration,delay, useNativeDriver: true }).start();
    }

    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const strokeDashoffset = circleCircumference - (circleCircumference * percentage) / max;

    useEffect(() => {
     
        animation(percentage)
        animatedValue.addListener(v => {
            if (circleRef?.current) {
                const maxPercentage = 100 * v.value / max;
                const strokeDashoffset = circleCircumference - (circleCircumference * maxPercentage) / 100;
                circleRef.current.setNativeProps({
                    strokeDashoffset: strokeDashoffset,
                })
            }
            if (inputRef?.current) {
                inputRef.current.setNativeProps({
                    text: `${Math.round(v.value)}`,
                })
            }
        })

    
    },);

    return (
        <View style={styles.container}>
            <View style={styles.donutContainer}>
                <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                    <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                        <Circle cy={'50%'} cx={'50%'} stroke={color} strokeWidth={strokeWidth} fill="transparent" strokeOpacity={0.4} r={radius} />
                        <AnimatedCircle 
                            
                            ref={circleRef} 
                            cy={'50%'} 
                            cx={'50%'} 
                            stroke={color} 
                            strokeWidth={strokeWidth} 
                            fill="transparent" 
                            strokeDasharray={circleCircumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap='round' 
                            r={radius} 
                        />
                    </G>
                </Svg>
                <AnimatedTextInput
                    ref={inputRef}
                    underlineColorAndroid="transparent"
                    editable={false}
                    defaultValue="0"
                    style={styles.percentageText}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    donutContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: RADIUS * 2,  // 2x radius
        height: RADIUS * 2,  // 2x radius
    },
    percentageText: {
        position: 'absolute',
        textAlign: 'center',
        fontWeight: '600',
        color: '#513EC7',
        fontSize: 16,
        width: '100%',
        height: '100%',
        textAlignVertical: 'center'
    }
});