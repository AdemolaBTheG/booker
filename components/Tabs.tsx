import { View, Text, Pressable, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'

type TabItem = {
    label: string
}

type TabsProps = {
    data: TabItem[],
    selectedIndex: number,
    onChange: (index: number) => void,
}

export default function Tabs({data, selectedIndex, onChange}: TabsProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = 100 / data.length;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: selectedIndex,
      useNativeDriver: true,
      tension: 70,
      friction: 12
    }).start();
  }, [selectedIndex]);

  return (
    <View className="flex-row bg-white/10 rounded-lg p-1 mx-4 mt-4 relative">
      <Animated.View 
        className="absolute top-1 bottom-1 bg-white/20 rounded-md"
        style={{
          width: `${tabWidth}%`,
          transform: [{
            translateX: slideAnim.interpolate({
              inputRange: [0, data.length - 1],
              outputRange: ['0%', `${100 - tabWidth}%`]
            })
          }]
        }}
      />
      {data.map((item, index) => {
        const isActive = selectedIndex === index;
        return (
          <Pressable 
            key={index}
            onPress={() => onChange(index)}
            className={`flex-1 py-2 z-10 items-center justify-center`}
          >
            <Text 
              className={`text-sm font-semibold ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  )
}