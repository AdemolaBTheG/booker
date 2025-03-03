import { View, Text, Pressable } from 'react-native'
import {Image} from 'expo-image'
import React, { useEffect, useRef } from 'react'
import { useTimerStore } from '@/stores/useTimerStore'
import {Icon} from '@/components/Icon'
import { Link } from 'expo-router'
export default function TimerComponent() {


    const {currentBookTitle, currentBookAuthor, currentBookThumbnail,currentBookId,formatTime,getTotalElapsedTime,updateElapsedTime,isRunning,setCurrentBookId,resetTimer,pauseTimer,startTimer} = useTimerStore();
    console.log(currentBookThumbnail);
    const animationFrameRef = useRef<number>();
    const DESIRED_HEIGHT =60; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); 

    useEffect(() => {
        const updateTimer = () => {
            updateElapsedTime();
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        };

        if (isRunning) {
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            console.log("Timer is not running");
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRunning, updateElapsedTime]);

    const handlePlayPause = () => {
    

        console.log("Play/Pause pressed, current state:", isRunning);
        if (isRunning) {
            pauseTimer();
        } else {
            console.log("Starting timer with bookId:", currentBookId);
            startTimer(currentBookId ?? '');
        }
        console.log("After toggle, state is:", !isRunning);
    };

  return (
   
        <View  className="flex-1 px-4 py-2 flex-row items-center justify-between w-full " style={{backgroundColor: '#D9D9D9',borderRadius: 20}}>

        
      <View className="flex flex-row items-center gap-2">
      <Image source={{uri: currentBookThumbnail}} style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 10}} />

        <View className="flex flex-col gap-1 ">
            
            <Text numberOfLines={2} style={{maxWidth: 150, lineHeight: 16}} className="text-white text-base font-bold ">{currentBookTitle}</Text>
            <Text numberOfLines={1} className="text-white text-sm font-medium">{currentBookAuthor}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center gap-3 px-2">
        <Text className="text-white  font-bold" style={{fontSize: 20}}>{formatTime(getTotalElapsedTime())}</Text>
        <Pressable onPress={handlePlayPause}>
        <Icon name={isRunning ? "pause" : "play"} size={28} color="white" type="ionicons" />
        </Pressable>
      </View>
      </View>
  )
}