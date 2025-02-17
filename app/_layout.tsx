import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { Suspense, useEffect } from "react";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from "@/components/Icon";
import { openDatabaseSync, SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator } from "react-native";
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator'
import { drizzle } from "drizzle-orm/expo-sqlite";
import migrations from '@/drizzle/migrations'
export default function RootLayout() {

  const expoDb = openDatabaseSync('books.db')
  const db = drizzle(expoDb)
  const {success,error} = useMigrations(db,migrations)

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

  return (
   
        <Suspense fallback={<ActivityIndicator size="large"/>}>
          <SQLiteProvider
           databaseName="books.db"
            options={{enableChangeListener: true}} 
            useSuspense>
            
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      <Stack 
        screenOptions={{
          contentStyle: {
            backgroundColor: '#000000'
          
          },
        
        }} 
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            headerShadowVisible: true,
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
          name="(permissions)" 
          options={{ 
            headerShown: false,
            presentation: 'card',
          }} 
        />
       
      </Stack>
    </GestureHandlerRootView>
    </SQLiteProvider>
    </Suspense>
   
  );
}
