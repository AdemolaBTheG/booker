import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { Suspense, useEffect, useRef } from "react";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from "@/components/Icon";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator, Alert, AppState, Platform } from "react-native";
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator'
import migrations from '@/drizzle/migrations'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { drizzle } from "drizzle-orm/expo-sqlite";
import {PostHogProvider} from 'posthog-react-native'
import { Text } from "react-native";
import Toast,{BaseToast} from 'react-native-toast-message';
import Purchases from 'react-native-purchases';
Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);


export default function RootLayout() {

  const expoDb = openDatabaseSync("books.db", {enableChangeListener: true, useNewConnection: true});
  const db = drizzle(expoDb);
  useDrizzleStudio(db)
  
  const {success,error} = useMigrations(db,migrations)
  
  const queryClient = new QueryClient()

 

  useEffect(() => {

    if (Platform.OS === 'ios') {
      console.log("Were are on ios")
      if(process.env.EXPO_PUBLIC_REVENUECAT_IOS){
        Purchases.configure({apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS as string});
      }
      else{
        Alert.alert('No API Key Found', 'Please add a RevenueCat API Key to the .env file')
      }
    }
  },)

  // AppState tracking for timer
  

  // Global AppState listener for timer updates from any screen


  useEffect(() => {
    if(success){
      console.log('Migrations successful')
    }
    if(error){
      console.error('Migrations failed',error)
    }
  },[success,error])

  SplashScreen.preventAutoHideAsync();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {

    success: (props: any) => (
      <BaseToast
      {...props}
      style={{borderLeftColor: 'green',backgroundColor: '#1B1B1B', borderBottomRightRadius: 8, borderTopRightRadius: 8}}
      contentContainerStyle={{backgroundColor: '#1B1B1B', borderBottomRightRadius: 8, borderTopRightRadius: 8}}
      text1Style={{color: 'white',fontSize: 16,fontWeight: 'semibold',}}
      text2Style={{color: 'rgba(255,255,255,0.5)',fontSize: 12,}}
      />
    )
  }

  return (
      <Suspense fallback={<ActivityIndicator size="large"/>}>
        <SQLiteProvider
         databaseName="books.db"
          options={{enableChangeListener: true}} 
          useSuspense>
            <PostHogProvider apiKey="phc_HjOdGfA46Ifh2JChDXT9iU2DWK1ITwuiPvdDQlrEGfi" options={{
                          host: "https://eu.i.posthog.com",
                          enableSessionReplay: true,
                          sessionReplayConfig: {
                              // Whether text inputs are masked. Default is true.
                              // Password inputs are always masked regardless
                              maskAllTextInputs: true,
                              // Whether images are masked. Default is true.
                              maskAllImages: true,
                              // Capture logs automatically. Default is true.
                              // Android only (Native Logcat only)
                              captureLog: true,
                              // Whether network requests are captured in recordings. Default is true
                              // Only metric-like data like speed, size, and response code are captured.
                              // No data is captured from the request or response body.
                              // iOS only
                              captureNetworkTelemetry: true,
                              // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 500ms
                              androidDebouncerDelayMs: 500,
                              // Deboucer delay used to reduce the number of snapshots captured and reduce performance impact. Default is 1000ms
                              iOSdebouncerDelayMs: 1000,
                          },

            }}>

                    <QueryClientProvider client={queryClient}>

          <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
    <Stack 
      screenOptions={{
        contentStyle: {
          backgroundColor: '#000000'
          
        
        },
      headerStyle: {
        backgroundColor: '#000000'
      },
      headerTitleStyle: {
        color: '#fff'
      },
      
      }} 
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false,
          headerBlurEffect: 'regular',
          headerTransparent: true,
        }} 
      />
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="(add)" 
        options={{ 
          headerShown: false,
          presentation: 'modal',
        
          

          
        }} 
      />
      <Stack.Screen 
        name="(books)/[filter]" 
        options={{ 
          headerShown: true,
          headerShadowVisible: true,
          headerTitle: '',
        }} 
        
      />
      <Stack.Screen 
        name="(books)/[bookId]/session" 
        options={{ 
          headerShown: true,
          headerTitle: 'Reading Session',
          presentation: 'modal',
        }} 
      />
    

      <Stack.Screen name="(books)/[bookId]/item" options={{
          headerShown: true,
          headerTitle: 'Book Details',
      }} />

      <Stack.Screen name="(books)/[bookId]/timer" options={{
          headerShown: false,
          headerTitle: 'Timer',
          presentation: 'fullScreenModal',
      }} />

      <Stack.Screen name="(settings)" options={{
        headerShown: false,
        presentation: 'modal',
      }} />

      <Stack.Screen name="paywall" options={{
        headerShown: false,
        presentation: 'fullScreenModal',
      }} />

     
    </Stack>
  </GestureHandlerRootView>
  </QueryClientProvider>
  </PostHogProvider>

  </SQLiteProvider>
  <Toast config={toastConfig} />

  </Suspense>
   
  );
}
