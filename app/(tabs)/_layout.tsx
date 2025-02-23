import { Icon } from '@/components/Icon'
import { Tabs, useRouter } from 'expo-router'
import React from 'react'
import { Pressable, View } from 'react-native'
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <Tabs
        
          screenOptions={{
            tabBarStyle: {
              
              backgroundColor: 'black',
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
              position: 'absolute',
            },
           
            
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
              headerShadowVisible: true,
              
              headerRight: () => (
                <Pressable 
                  onPress={() => router.push('/(add)')}


                  className='bg-cta rounded-full p-2 mr-4'
                >
                  <Icon name="add" size={20} color="white" type="material" />
  
                </Pressable>
              ),
              tabBarIcon: ({ color }) => (
                  <Icon name="home" color={color} size={24} type="material" />
              ),
          }} />
          <Tabs.Screen name="statistics" options={{
              title: 'Statistics',
              tabBarIcon: ({ color }) => (
                  <Icon name="auto-graph" color={color} size={24} type="material" />
              ),
          }} />
    
      
        



        </Tabs>
      

    </View>

  )
}
