import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from "react";
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Icon } from "@/components/ui/Icon";
import { Pressable } from "react-native";

export default function RootLayout() {
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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      <Stack 
        screenOptions={{
          contentStyle: {
            
          },
        }} 
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(add)" 
          options={{ 
            headerShown: true,
          }} 
        />
      
       
      </Stack>
    </GestureHandlerRootView>
  );
}
