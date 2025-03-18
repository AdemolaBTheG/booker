import { View, Text, TextInput,  } from 'react-native'
import React from 'react'
import { Icon } from './Icon'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export default function SearchBar({ onChangeText, value,placeholder,showBorder }: { onChangeText: (text: string) => void, value: string,placeholder: string,showBorder: boolean }) {

   

    return (
        <View className={  `flex items-center justify-center py-5 border-b ${showBorder ? 'border-white/20' : 'border-none'}`} style={{paddingVertical:16,paddingHorizontal:16}}>
            <Animated.View className='flex-row gap-1 items-center bg-white/10  px-4 py-3' style={{borderRadius:16}}>
                <Icon 
                    name='search' 
                    size={28} 
                    color="rgba(255, 255, 255, 0.4)"
                    type='material'

                />
                <TextInput 
                    className='flex-1 text-white' 
                    placeholder={placeholder} 
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor='rgba(255, 255, 255, 0.4)'
                    textAlignVertical="center"
                    textAlign='left'
                    style={{fontSize: 18}}
                />
            </Animated.View>
        </View>
    )
}