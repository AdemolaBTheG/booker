import { View, Text, useWindowDimensions, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, memo } from 'react'
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'

type SegmentedControlProps = {
    options: string[],
    selectedOption: string,
    onOptionPress?: (option: string) => void
}

const TabItem = memo(({ option, isSelected, width, onPress }: { 
    option: string, 
    isSelected: boolean, 
    width: number,
    onPress: () => void 
}) => (
    <TouchableOpacity 
        style={{ width }} 
        className='flex items-center justify-center py-1'
        onPress={onPress}
    >
        <Text className={`text-white text-xs font-medium py-1 `}>
            {option}
        </Text>
    </TouchableOpacity>
));

function SegmentedControl({ options, selectedOption, onOptionPress }: SegmentedControlProps) {
    const { width: windowWidth } = useWindowDimensions()
    const segmentedControlWidth = windowWidth - 40
    const tabWidth = segmentedControlWidth / options.length

    const rStyle = useAnimatedStyle(() => ({
        left: withTiming(options.indexOf(selectedOption) * tabWidth )
    }), [selectedOption])

    const handlePress = useCallback((option: string) => {
        onOptionPress?.(option)
    }, [onOptionPress])

    return (
        <View 
            className='flex-row h-16 bg-white/15  ' 
            style={{ width: segmentedControlWidth, borderRadius: 8 }}
        >
            <Animated.View 
                className='absolute' 
                style={[{ width: tabWidth }, styles.activeBoxStyle, rStyle]}
            />
            {options.map((option) => (
                <TabItem 
                    key={option}
                    option={option}
                    isSelected={selectedOption === option}
                    width={tabWidth}
                    onPress={() => handlePress(option)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    activeBoxStyle: {
        height: '80%',
        top: '10%',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 4,
    }
})

export default memo(SegmentedControl)
