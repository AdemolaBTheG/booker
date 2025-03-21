import { View, Text, Pressable,  Platform } from 'react-native'
import React, { useState, useEffect, useRef  } from 'react'
import { Icon } from '@/components/Icon'
import DatePicker from '@/components/DatePicker'
import { router } from 'expo-router'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { registerForPushNotificationsAsync } from '@/lib/registerForPushNotificationsAsync';
export default function Notification() {

    const [amount, setAmount] = useState(1);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
      undefined
    );

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      useEffect(() => {
        registerForPushNotificationsAsync()
          .then(token => setExpoPushToken(token ?? ''))
          .catch((error: any) => setExpoPushToken(`${error}`));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
          responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);


      
  return (
    <View className='flex-1  items-center px-4'>
    <View className="flex-col items-center justify-center gap-2 mt-12 w-full">
        <Text className='text-3xl text-center text-white font-bold'><Text className='text-cta'>Double</Text> Your Reading with <Text className='text-cta'>Notifications</Text></Text>
        <Text className='text-center text-white/60'>Get Your Personal Nudge — Tailored Notifications to Keep You on Track</Text>
        <View className="flex-col gap-4 w-full items-center justify-center mt-20">
            <View className="flex-row justify-between items-center w-full bg-white/15 rounded-2xl p-3">
                <Text className="text-white  text-lg">Amount</Text>
                <View className="flex-row justify-center items-center gap-16">
                    <Pressable className='bg-white rounded-xl p-2' onPress={() => setAmount(amount - 1)}>
                        <Icon name='remove' size={24} color='rgb(255, 255, 255,0.15)' type='material'/>
                    </Pressable>
                    <Text className="text-white  text-lg">{amount}x</Text>
                    <Pressable className='bg-white rounded-xl p-2' onPress={() => setAmount(amount + 1)}>
                        <Icon name='add' size={24} color='rgb(255, 255, 255,0.15)' type='material'/>
                    </Pressable>
                </View>
            </View>
            <View className='w-full '>
            <View className="flex-row justify-between items-center w-full  bg-white/15  rounded-t-2xl rounded-tr-2xl p-3" >
                <Text className='text-white text-lg'>From</Text>
                <DatePicker date={new Date()} mode='time' onChange={() => {}} />
            </View>
            <View className='w-full h-[0.8px] bg-white/20'/>
            <View className="flex-row justify-between items-center w-full bg-white/15 rounded-bl-2xl rounded-br-2xl p-3">
                <Text className='text-white text-lg'>To</Text>
                <DatePicker date={new Date()} mode='time' onChange={() => {}} />
            </View>
            </View>
           
        </View>

    </View>
    <Pressable className="absolute bottom-24 bg-cta w-full rounded-2xl p-3" onPress={() => router.push('/notifications')}>
        <Text className='text-white text-center text-lg font-bold '>Continue</Text>
        </Pressable>
    </View>
  )
}