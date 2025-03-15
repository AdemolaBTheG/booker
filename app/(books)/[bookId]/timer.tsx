import { View, Text, ImageBackground, Pressable, AppState, Alert } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { DbBook } from '@/db/schema';
import { router, useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';

// Types
interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
}

// Isolated timer display component
const TimerDisplay = React.memo(({ milliseconds }: { milliseconds: number }) => {
  // Format milliseconds to MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <Text className="text-white text-6xl font-bold mt-20">
      {formatTime(milliseconds)}
    </Text>
  );
});

// Timer controls component
const TimerControls = React.memo(({ 
  isRunning, 
  onPlayPause, 
  onReset,
  onStop 
}: { 
  isRunning: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onStop: () => void;
}) => {
  return (
    <View className="flex-row gap-8 mt-20">
      <Pressable 
        className="border border-white/50 p-6 rounded-full"
        onPress={onReset}
      >
        <Icon name="timer" size={36} color="rgba(255,255,255,0.5)" type="ionicons" />
      </Pressable>
      
      <Pressable 
        className="bg-cta p-6 rounded-full"
        onPress={onPlayPause}
      >
        <Icon 
          name={isRunning ? 'pause' : 'play'} 
          size={36} 
          color="white" 
          type="ionicons"
        />
      </Pressable>
      
      <Pressable 
        className="border border-white/50 p-6 rounded-full"
        onPress={onStop}
      >
        <Icon name="stop" size={36} color="rgba(255,255,255,0.5)" type="ionicons" />
      </Pressable>
    </View>
  );
});

export default function Timer() {
  const DESIRED_HEIGHT = 300; 
  const aspectRatio = 42.67/61.33;
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const [book, setBook] = useState<DbBook | null>(null);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
  });

  // Use interval instead of animation frame for more predictable updates
  const intervalRef = useRef<NodeJS.Timeout>();
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimestampRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      const book = await booksService.getBookById(bookId);
      setBook(book);
    };
    fetchBook();
  }, [bookId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Going to background
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        if (timerState.isRunning) {
          // Record when app went to background
          backgroundTimestampRef.current = Date.now();
          
          // Stop interval when in background
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
          }
        }
      } 
      // Coming back to foreground
      else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        if (timerState.isRunning && backgroundTimestampRef.current) {
          const now = Date.now();
          // Calculate time spent in background (no cap)
          const backgroundDuration = now - backgroundTimestampRef.current;
          
          console.log('Background time:', backgroundDuration / 1000, 'seconds');
          
          // Update timer with background time (no cap applied)
          setTimerState(prev => ({
            ...prev,
            elapsedTime: prev.elapsedTime + backgroundDuration,
          }));
          
          // Restart interval
          startTimerInterval();
          
          backgroundTimestampRef.current = null;
        }
      }
      
      appStateRef.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [timerState.isRunning]);

  // Timer interval logic
  const startTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    lastTickTimeRef.current = Date.now();
    
    // Use setInterval instead of requestAnimationFrame for more predictable timing
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = now;
        return;
      }
      
      const delta = now - lastTickTimeRef.current;
      
      // Skip very large time jumps within the interval itself
      if (delta > 2000) {
        console.warn('Timer: Large delta detected within interval', delta);
        lastTickTimeRef.current = now;
        return;
      }
      
      setTimerState(prev => ({
        ...prev,
        elapsedTime: prev.elapsedTime + delta,
      }));
      
      lastTickTimeRef.current = now;
    }, 100); // Update at 10fps for better battery life
  }, []);

  // Start or stop interval based on timer state
  useEffect(() => {
    if (timerState.isRunning) {
      startTimerInterval();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      lastTickTimeRef.current = null;
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, startTimerInterval]);

  // Timer control handlers
  const handlePlayPause = useCallback(() => {
    setTimerState(prev => {
      if (prev.isRunning) {
        return { ...prev, isRunning: false };
      } else {
        return { 
          ...prev, 
          isRunning: true, 
          startTime: Date.now()
        };
      }
    });
  }, []);

  const handleReset = useCallback(() => {
    setTimerState({
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    });
  }, []);

  const handleStop = useCallback(() => {
    router.push(`/(books)/${bookId}`);
  }, [bookId, timerState.elapsedTime]);

  return (
    <ImageBackground 
      source={{uri: book?.thumbnail?.replace('http://', 'https://')}} 
      className='flex-1'
      style={{backgroundColor: '#000'}}
    >
      <BlurView intensity={100} className='flex-1 items-center justify-center'>
        <View className="flex-row w-full mt-16 px-4 justify-between items-center">
            <Pressable onPress={() => {timerState.elapsedTime  === 0 ? router.back() : Alert.alert('Are you sure you want to leave?', 'You will lose all your reading progress', [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Leave', style: 'destructive', onPress: () => router.back()},
            ])}}>
            <Icon name="close" size={28} color="white" type="ionicons" />
            </Pressable>
        </View>
        <View className='flex-1 items-center mt-24'>
          <Image 
            source={{uri: book?.thumbnail?.replace('http://', 'https://')}} 
            cachePolicy='disk'  
            contentFit='cover' 
            style={{
              width: CALCULATED_WIDTH, 
              height: DESIRED_HEIGHT, 
              borderRadius: 20, 
              shadowColor: 'rgba(0,0,0,0.5)', 
              shadowOffset: {width: 0, height: 2}, 
              shadowOpacity: 0.25, 
              shadowRadius: 3.84
            }}
          />
          
          {/* Timer display component */}
          <TimerDisplay milliseconds={timerState.elapsedTime} />
          
          {/* Timer controls component */}
          <TimerControls 
            isRunning={timerState.isRunning}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onStop={() => router.push(`/(books)/${bookId}/session?time=${timerState.elapsedTime}`)}
          />
        </View>
      </BlurView>
    </ImageBackground>
  );
}