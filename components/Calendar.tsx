import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { Icon } from './Icon';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { de } from 'date-fns/locale';

const DAYS_OF_WEEK = ['S', 'M', 'D', 'M', 'D', 'F', 'S']; // German days abbreviation

export default function Calendar() {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);

    useEffect(() => {
        const firstDayOfMonth = startOfMonth(currentDate);
        const lastDayOfMonth = endOfMonth(currentDate);
        const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
        setDaysInMonth(daysInMonth);
        setCurrentDate(currentDate);
        console.log(daysInMonth)
    }, []);


    const getEmptyCellsBefore = () =>{
        const firstDayOfMonth = startOfMonth(currentDate);
        const dayOfWeek = getDay(firstDayOfMonth);
        return Array(dayOfWeek).fill(null);
    }
    
    const getEmptyCellsAfter = () =>{

        const lastDayOfMonth = endOfMonth(currentDate);
        const dayOfWeek = getDay(lastDayOfMonth);
        return Array(7 - dayOfWeek).fill(null);
    }

    const isToday = (date: Date) => {
        return isSameDay(date, new Date());
    }

 
  return (
    <View className="flex-col  items-center justify-center  bg-white/15  rounded-2xl">
        <View className="flex-row  items-center justify-between  w-full px-4 mt-4" >
            <Pressable onPress={() => setCurrentDate(subMonths(currentDate, 1))}><Icon name="chevron-back" size={24} color="rgba(255,255,255,0.5)" type="ionicons" /></Pressable>
            <Text className="text-white text-lg">{format(currentDate, 'MMMM ')}</Text>
            <Pressable onPress={() => setCurrentDate(addMonths(currentDate, 1))}><Icon name="chevron-forward" size={24} color="rgba(255,255,255,0.5)" type="ionicons" /></Pressable>
        </View>
        <View style={{width: 320, flexDirection: 'row', flexWrap: 'wrap',gap: 4,justifyContent: 'center',marginTop: 12}}>
        {DAYS_OF_WEEK.map((day, index) => (
            <View key={index} style={{width: 40, justifyContent: 'center', alignItems: 'center'}}>
                <Text className="text-white text-lg">{day}</Text>
            </View>
        ))}
        {getEmptyCellsBefore().map((_, index) => (
            <View key={index} style={{width: 40, height: 60}}></View>
        ))}
       {daysInMonth.map((day, index) => (
        <View key={index} style={{width: 40, height: 60, borderRadius: 8, borderColor:  isToday(day) ? 'rgb(255,255,255)' : 'rgba(255,255,255,0.15)', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text className="text-white/40 text-base">{format(day, 'd')}</Text>
        </View>
       ))}
       {getEmptyCellsAfter().map((_, index) => (
        <View key={index} style={{width: 40, height: 60}}/>
       ))}
    </View>
    </View>
    
  );
}