import { Icon } from '@/components/ui/Icon'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <BlurView intensity={80} style={{ flex: 1 }}>
        <Tabs
        
          screenOptions={{
            
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
              position: 'absolute',
            },
            tabBarBackground: () => (
              <BlurView 
                intensity={80} 
                tint="dark"
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ),
            
            headerStyle: {
              backgroundColor: '#000000',
            },
            
         
            headerTitleStyle: {
              color: 'white',
            },

            headerShadowVisible: true,
            tabBarActiveTintColor: 'white',
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
           
          }}>
          <Tabs.Screen name="index" options={{
              headerShown: true,
              headerTitle: 'Home',
              headerRight: () => (
                <Pressable 
                  onPress={() => router.push('/(add)')}


                  className='bg-cta rounded-full p-2 mr-4'
                >
                  <Icon name="add" size={20} color="white" />
  
                </Pressable>
              ),
              tabBarIcon: ({ color }) => (
                  <Icon name="home" color={color} size={24} />
              ),
          }} />
          <Tabs.Screen name="statistics" options={{
              title: 'Statistics',
              tabBarIcon: ({ color }) => (
                  <Icon name="auto-graph" color={color} size={24} />
              ),
          }} />
        <Tabs.Screen name="(add)" options={{
            href: null,
        }} />
        



        </Tabs>
      </BlurView>

    </View>

  )
}
