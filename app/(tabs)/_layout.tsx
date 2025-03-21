import { Icon } from '@/components/Icon'
import { Tabs, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, View, Text } from 'react-native'
import NativeDropDown from '@/components/NativeDropDown'
import Purchases from 'react-native-purchases'
import { useQuery } from '@tanstack/react-query'
import { booksService } from '@/services/booksService'

const addItems = [
  {
    key: '0',
    title: 'Search Books ',
    
  },
  {
    key: '1',
    title: 'Scan via QR Code',
    
  },
  {
    key: '2',
    title: 'Add Book Manually',
    
  },


]
export default function TabLayout() {

  const [isActive, setIsActive] = useState(false);

  const {data: bookCount} = useQuery({
    queryKey: ['bookCount'],

    queryFn: () => booksService.getBookCount(),
   
  })
  console.log("bookCount", bookCount)
  
  useEffect(() => {
    const getCustomerInfo = async () => {
      const customerInfo = (await Purchases.getCustomerInfo()).entitlements.active['Plus'] !== undefined
      setIsActive(customerInfo);
    }
    getCustomerInfo();
  }, []);
  const router = useRouter();
  console.log("isActive", isActive)

  function onSelect(title: string) {
    
   if(bookCount && bookCount > 3 && !isActive){
    router.push('/paywall')
   }
    if(title === 'Search Books '){
      router.push('/(add)')
    }
    if(title === 'Scan via QR Code'){
      router.push('/(add)/barcode')
    }
    if(title === 'Add Book Manually'){
      router.push('/(add)/-1/edit')
    }
    
    
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
 
      
        <Tabs
        
          screenOptions={{
            
            tabBarStyle: {
              
              backgroundColor: 'black',
              borderTopColor: 'rgba(255, 255, 255, 0.2)',
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
              
              headerLeft: () => (
                <Pressable className='inline-flex flex-row items-center gap-2 ml-4   px-4 py-1' onPress={() => router.push('/paywall')} >
                  <Text className='text-cta font-medium'>Get Plus</Text>
                  <Icon name="sparkles" size={20} color="#513EC7" type="ionicons" />
                </Pressable>
              ),
              headerRight: () => (
                  <NativeDropDown items={addItems} onSelect={onSelect} type='add' />


                  
                
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
              headerRight: () => (
                <Pressable className="mr-4" onPress={() => router.push('/(settings)')} >
                  <Icon name="settings-outline" color="white" size={24} type="ionicons" />
                </Pressable>
              )
          }} />
    
      
        



        </Tabs>
      

    </View>

  )
}
