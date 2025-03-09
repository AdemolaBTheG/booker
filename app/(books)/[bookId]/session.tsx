import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import SliderComponent from '@/components/SliderComponent'
import  { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DatePicker from '@/components/DatePicker';
import { DbBook } from '@/db/schema';
import { useLocalSearchParams } from 'expo-router';
import { DbReadingSession } from '@/db/schema';
import { useTimerStore } from '@/stores/useTimerStore';
import { booksService } from '@/services/booksService';
import { ReadingSession } from '@/lib/types';

export default function Session() {

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [sliderValue, setSliderValue] = useState(0);
    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const {accumulatedTime} = useTimerStore();
    const [book, setBook] = useState<DbBook | null>(null);
    const [totalReadPages, setTotalReadPages] = useState<number>(0);
    const [progress, setProgress] = useState<number>(0);
    const [bookNotes, setBookNotes] = useState<string>("");
    const onChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate;
        setDate(currentDate);
      };


      const addSession = async() =>{

        try{

            const session: ReadingSession = {
                bookId: parseInt(bookId as string),
                duration: accumulatedTime,
                ended_at: date?.getTime() || new Date().getTime(),
                startedAtPage: totalReadPages,
                notes: bookNotes,
                pagesRead: sliderValue,
            }

         
            await booksService.addReadingSession(session);
            console.log('Session added successfully');
        }
        catch(error){
            console.error('Error adding session:', {
                error,
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
      }


        
  
  

      useEffect(() =>{
        const fetchData = async() =>{
            const book = await booksService.getBookById(bookId as string);
            setBook(book);

            const startedAtPage = await booksService.getStartedAtPage(parseInt(bookId as string));
            if(startedAtPage){
                setTotalReadPages(startedAtPage);
            }




        }
        fetchData();
      }, [bookId]);

  return (
    <View className='flex-1 px-4'>
        <View className='flex-col items-center mt-12'>
            <Text className='text-white text-5xl font-bold'>{sliderValue}</Text>
            <Text className='text-white/60 text-xl font-base'>out of {book?.pages || 0} pages read</Text>
            <Text className="text-blue-600 text-lg font-medium mt-2">+{progress} pages</Text>

        </View>
        <View className='flex mt-4 items-center justify-center'>
            <SliderComponent step={1} value={sliderValue} onValueChange={(value) => {setSliderValue(value); setProgress(value - totalReadPages)}} min={totalReadPages} max={book?.pages || 0} width={340} height={10} />
        </View>
        <View className='flex items-center justify-center mt-12'>
            <View className='flex-row w-full items-center justify-center  mb-4'>
                <Text className='text-white/60 mb-2 text-base flex-1 '>Date</Text>
                <DatePicker date={date || new Date()} mode={"date"} onChange={onChange} />
                   <DatePicker date={date || new Date()} mode={"time"} onChange={onChange} />
            </View>

       
            
            <View className="flex-start flex items-start w-full ">
                <TextInput submitBehavior='blurAndSubmit' placeholder='Notes' value={bookNotes} onChangeText={setBookNotes} multiline={true} textAlignVertical='top' className="h-40 w-full text-white bg-white/15 rounded-xl border-white/10 border px-3 py-3 mt-3" />
            </View>
        </View>
        <View className="flex items-center justify-center  mt-48">
            <Pressable onPress={addSession} className='btn-primary w-full py-3'>
                <Text className='text-white text-lg font-medium'>Save Session</Text>
            </Pressable>
        </View>
      
    
    </View>
  )
}