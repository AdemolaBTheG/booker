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
import migrations from '@/drizzle/migrations'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { drizzle } from "drizzle-orm/expo-sqlite";



export default function RootLayout() {

  const expoDb = openDatabaseSync("books.db", {enableChangeListener: true, useNewConnection: true});
  const db = drizzle(expoDb);
  useDrizzleStudio(db)
  
  const {success,error} = useMigrations(db,migrations)
  
  const queryClient = new QueryClient()

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
          name="(books)/[filter]" 
          options={{ 
            headerShown: true,
            headerShadowVisible: true,
            headerTitle: '',
          }} 
        />
    
       
      </Stack>
    </GestureHandlerRootView>
    </QueryClientProvider>

    </SQLiteProvider>
    </Suspense>
   
  );
}
