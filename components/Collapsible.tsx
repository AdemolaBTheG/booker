import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Icon } from './Icon';
import Animated, { FadeInUp, FadeOutUp, LinearTransition,Easing, FadeInDown } from 'react-native-reanimated';
import { Link } from 'expo-router';

type CollapsibleProps = {
    title: string;
    data: {
        title: string;
        icon: string;
        type: string;
        href: string;
        count?: number;  // Add optional count property
    }[]
}

export default function Collapsible({title, data}: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Animated.View className="flex-col bg-white/15 rounded-xl p-4" layout={LinearTransition.springify()}>
            <Pressable className="flex-row items-center justify-between" onPress={() => setIsOpen(!isOpen)}>
                <Text className="text-white text-xl font-semibold">{title}</Text>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={24} type="ionicons" />
            </Pressable>
            
            {isOpen && (
                <Animated.View className="flex-col mt-2 gap-1" entering={FadeInUp} exiting={FadeOutUp} layout={LinearTransition.springify()}>
                    {data.map((item, index) => (
                        <Link href={`/(books)/${item.title}?title=${title}`} key={item.title}>
                            <Animated.View 
                                entering={FadeInUp} 
                                exiting={FadeOutUp} 
                                key={item.title} 
                                className="w-full flex-row items-center justify-between p-2" 
                                style={{
                                    borderBottomWidth: index === data.length - 1 ? 0 : 1, 
                                    borderBottomColor: 'rgba(255,255,255,0.1)'
                                }}
                                layout={LinearTransition.springify()}
                            >
                                <View className="flex-row items-center justify-center gap-4">
                                    <Icon name={item.icon as any} size={24} type={item.type as any} className='w-8 h-8' />
                                    <Text className="text-white text-left text-lg">{item.title}</Text>
                                </View>
                                
                                <View className="flex-row items-center gap-1">
                                    {/* Display count badge if available */}
                                    {item.count !== undefined && (
                                            <Text className="text-white/40 " style={{fontSize:16}}>{item.count}</Text>
                                      
                                    )}
                                    <Icon name="chevron-forward" color='rgba(255,255,255,0.4)' size={20} type="ionicons" />
                                </View>
                            </Animated.View>
                        </Link>
                    ))}
                </Animated.View>
            )}
        </Animated.View>
    )
}