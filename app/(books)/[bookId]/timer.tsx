import { View, Text, ImageBackground, Pressable, TextInput } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { DbBook } from '@/db/schema';
import { router, useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
import { useTimerStore } from '@/stores/useTimerStore';
import Slider from '@react-native-community/slider';

export default function Timer() {
    const DESIRED_HEIGHT = 300; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); //calculated width of the image

    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const [book, setBook] = useState<DbBook | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const animationFrameRef = useRef<number>();

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

    // Animation frame loop for timer
    useEffect(() => {
        const updateTimer = () => {
            updateElapsedTime();
            console.log("Timer update:", getTotalElapsedTime());
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        };

        if (isRunning) {
            console.log("Starting timer animation loop");
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            console.log("Timer is not running");
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                console.log("Cleaning up animation frame");
            }
        };
    }, [isRunning, updateElapsedTime]);

    const handlePlayPause = () => {
        if(currentBookId !== bookId){
            setCurrentBookId(bookId);
          
            resetTimer();
        }

        console.log("Play/Pause pressed, current state:", isRunning);
        if (isRunning) {
            pauseTimer();
        } else {
            console.log("Starting timer with bookId:", bookId);
            startTimer(bookId);
        }
        console.log("After toggle, state is:", !isRunning);
    };

    return (
        <ImageBackground source={{uri: book?.thumbnail?.replace('http://', 'https://')}} className='flex-1'>
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
                    <Text className="text-white text-6xl font-bold mt-20">
                        {currentBookId != bookId ? "00:00" : formatTime(getTotalElapsedTime())}
                    </Text>
                    
                    <View className="flex-row gap-8 mt-20">
                        <Pressable 
                            className="border border-white/50 p-6 rounded-full"
                            onPress={resetTimer}
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
                            onPress={() => router.push('/session')}
                        >
                            <Icon name="stop" size={36} color="rgba(255,255,255,0.5)" type="ionicons"/>
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </ImageBackground>
    );
}