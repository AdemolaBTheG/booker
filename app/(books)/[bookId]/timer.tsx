import { View, Text, ImageBackground, Pressable, TextInput, AppState } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { DbBook } from '@/db/schema';
import { router, useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
import { useTimerStore } from '@/stores/useTimerStore';
import Slider from '@react-native-community/slider';

// Isolated timer display component
const TimerText = React.memo(({ time }: { time: string }) => {
  return (
    <Text className="text-white text-6xl font-bold mt-20">
      {time}
    </Text>
  );
});

export default function Timer() {
    const DESIRED_HEIGHT = 300; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); //calculated width of the image

    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const [book, setBook] = useState<DbBook | null>(null);
    const [displayTime, setDisplayTime] = useState('00:00');
    const { 
        isRunning, 
        startTimer, 
        pauseTimer, 
        resetTimer, 
        updateElapsedTime,
        formatTime,
        getTotalElapsedTime,
        currentBookId,
        setCurrentBookId,
        setCurrentBookTitle,
        setCurrentBookAuthor,
        setCurrentBookThumbnail
    } = useTimerStore();

    // For background/foreground handling
    const appState = useRef(AppState.currentState);
    const backgroundTimeStamp = useRef<number | null>(null);
    
    // Animation and interval refs
    const animationFrameRef = useRef<number>();
    const intervalRef = useRef<NodeJS.Timeout>();

    // Handle AppState changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            // Going to background
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                if (isRunning) {
                    // Store timestamp when going to background
                    backgroundTimeStamp.current = Date.now();
                    
                    // Cleanup timers when going to background
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                    }
                    
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            } 
            // Coming back to foreground
            else if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                if (isRunning && backgroundTimeStamp.current && currentBookId === bookId) {
                    // Calculate time spent in background
                    const now = Date.now();
                    const backgroundDuration = now - backgroundTimeStamp.current;
                    
                    // Add the background time to accumulated time in store
                    const store = useTimerStore.getState();
                    useTimerStore.setState({
                        accumulatedTime: store.accumulatedTime + backgroundDuration,
                        startTime: now // Reset start time
                    });
                    
                    // Update display immediately
                    updateElapsedTime();
                    setDisplayTime(formatTime(getTotalElapsedTime()));
                    
                    // Restart timers
                    setupTimers();
                    
                    backgroundTimeStamp.current = null;
                }
            }
            
            appState.current = nextAppState;
        });
        
        return () => {
            subscription.remove();
        };
    }, [isRunning, currentBookId, bookId]);

    // Helper function to set up both the animation frame and interval
    const setupTimers = useCallback(() => {
        // Clear existing timers
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Set up animation frame for internal timer logic
        const updateTimer = () => {
            updateElapsedTime();
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        };
        
        animationFrameRef.current = requestAnimationFrame(updateTimer);
        
        // Set up interval for UI updates (less frequent)
        intervalRef.current = setInterval(() => {
            if (currentBookId === bookId) {
                setDisplayTime(formatTime(getTotalElapsedTime()));
            }
        }, 1000); // Update display once per second
    }, [updateElapsedTime, currentBookId, bookId, formatTime, getTotalElapsedTime]);

    // Handle timer start/stop
    useEffect(() => {
        if (isRunning) {
            // Initial update
            if (currentBookId === bookId) {
                setDisplayTime(formatTime(getTotalElapsedTime()));
            }
            
            // Start timers
            setupTimers();
        } else {
            // Clean up timers when stopped
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
        
        return () => {
            // Clean up on unmount
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, setupTimers]);

    // Fetch book data
    useEffect(() => {
        const fetchBook = async () => {
            const book = await booksService.getBookById(bookId);
            setBook(book);
        }
        fetchBook();
    }, [bookId]);

    useEffect(() => {
        setCurrentBookTitle(book?.title ?? '');
        setCurrentBookAuthor(book?.authors ?? '');
        setCurrentBookThumbnail(book?.thumbnail ?? '');
    }, [book]);

    const handlePlayPause = useCallback(() => {
        if(currentBookId !== bookId){
            setCurrentBookId(bookId);
            resetTimer();
        }

        if (isRunning) {
            pauseTimer();
        } else {
            startTimer(bookId);
        }
    }, [isRunning, currentBookId, bookId]);

    const handleReset = useCallback(() => {
        resetTimer();
        setDisplayTime('00:00');
    }, []);

    return (
        <ImageBackground 
            source={{uri: book?.thumbnail?.replace('http://', 'https://')}} 
            className='flex-1'
            style={{backgroundColor: '#000'}} // Black background to prevent white flash
        >
            <BlurView intensity={100} className='flex-1 items-center justify-center'>
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
                    
                    {/* Memoized timer text to prevent re-renders */}
                    <TimerText 
                        time={currentBookId !== bookId ? "00:00" : displayTime} 
                    />
                    
                    <View className="flex-row gap-8 mt-20">
                        <Pressable 
                            className="border border-white/50 p-6 rounded-full"
                            onPress={handleReset}
                        >
                            <Icon name="timer" size={36} color="rgba(255,255,255,0.5)" type="ionicons"/>
                        </Pressable>
                        
                        <Pressable 
                            className="bg-cta p-6 rounded-full"
                            onPress={handlePlayPause}
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
                            onPress={() => router.push(`/(books)/${bookId}/session`)}
                        >
                            <Icon name="stop" size={36} color="rgba(255,255,255,0.5)" type="ionicons"/>
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </ImageBackground>
    );
}