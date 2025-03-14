import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays, addDays } from 'date-fns';

const { width } = Dimensions.get('window');

// Create dummy data for the CURRENT month
const generateCurrentMonthData = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Generate 15 random reading sessions in the current month
  return Array.from({ length: 15 }, (_, i) => {
    // Generate random day in current month (1-28)
    const day = Math.floor(Math.random() * 28) + 1;
    // Generate random minutes (15-120)
    const minutes = Math.floor(Math.random() * 106) + 15;
    
    return {
      date: new Date(currentYear, currentMonth, day),
      minutes: minutes
    };
  });
};

// Use dynamically generated data for the current month
const READING_DATA = generateCurrentMonthData();

// Add a function to check if a date is today
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export default function ReadingHeatmap() {
  // Get all days in the current month
  const today = new Date();
  const currentMonth = today;
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  
  // Calculate intensity based on reading minutes
  const getIntensityLevel = (day: Date) => {
    const activity = READING_DATA.find(a => isSameDay(a.date, day));
    if (!activity) return 0;
    
    // Convert minutes to intensity level (0-4)
    if (activity.minutes >= 90) return 4;
    if (activity.minutes >= 60) return 3;
    if (activity.minutes >= 30) return 2;
    if (activity.minutes > 0) return 1;
    return 0;
  };

  // Get color based on intensity level
  const getHeatColor = (level: number) => {
    switch(level) {
      case 0: return 'rgba(255,255,255,0.05)';
      case 1: return '#0e4429'; // Light activity
      case 2: return '#006d32'; // Medium activity
      case 3: return '#26a641'; // High activity
      case 4: return '#39d353'; // Very high activity
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  // Calculate cell dimensions
  const CELL_GAP = 4;
  const CELLS_PER_ROW = 7; // 7 days in a week
  const CELL_SIZE = (width - 128  - (CELLS_PER_ROW - 1) * CELL_GAP) / CELLS_PER_ROW;
  
  // Group days by week - Monday to Sunday
  const weeks: (Date | undefined)[][] = [];
  let currentWeek: (Date | undefined)[] = [];
  
  days.forEach((day, index) => {
    // Convert day of week: 0 (Sunday) -> 6, 1 (Monday) -> 0, ..., 6 (Saturday) -> 5
    const dayOfWeek = day.getDay() === 0 ? 6 : day.getDay() - 1;
    
    // Fill in empty cells at the beginning of the month
    if (index === 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(undefined);
      }
    }
    
    currentWeek.push(day);
    
    // End of week is now when dayOfWeek is 6 (Sunday) instead of Saturday
    if (dayOfWeek === 6 || index === days.length - 1) {
      // Fill in empty cells at the end of the month
      if (index === days.length - 1 && dayOfWeek < 6) {
        for (let i = dayOfWeek + 1; i <= 6; i++) {
          currentWeek.push(undefined);
        }
      }
      
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get day names for header - Monday to Sunday
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={{ paddingHorizontal: 16, width: '100%' }}>
      <View 
        className="flex items-center justify-center rounded-xl overflow-hidden" 
        style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          paddingVertical: 16,
          paddingHorizontal: 16,
        }}
      >
        {/* Day headers */}
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          {dayNames.map((name, index) => (
            <View 
              key={index}
              style={{
                width: CELL_SIZE,
                marginRight: index < CELLS_PER_ROW - 1 ? CELL_GAP : 0,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{name}</Text>
            </View>
          ))}
        </View>
        
        {/* Calendar grid */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={{ flexDirection: 'row', marginBottom: CELL_GAP }}>
            {week.map((day, dayIndex) => {
              if (!day) {
                // Empty cell
                return (
                  <View
                    key={dayIndex}
                    style={{
                      width: CELL_SIZE,
                      height: CELL_SIZE,
                      marginRight: dayIndex < CELLS_PER_ROW - 1 ? CELL_GAP : 0,
                    }}
                  />
                );
              }
              
              const intensityLevel = getIntensityLevel(day);
              return (
                <View
                  key={dayIndex}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: getHeatColor(intensityLevel),
                    marginRight: dayIndex < CELLS_PER_ROW - 1 ? CELL_GAP : 0,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // Add a border if it's today
                    ...(isToday(day) ? {
                      borderWidth: 2,
                      borderColor: '#ffffff',
                    } : {})
                  }}
                >
                </View>
              );
            })}
          </View>
        ))}
        
        {/* Legend */}
        <View className="flex-row w-full items-center  gap-2 justify-center mt-6 " style={{alignSelf: 'flex-end',width: '100%'}}>
          <Text className="text-white/50 text-xs">Less</Text>
          <View className="flex-row">
            {[0, 1, 2, 3, 4].map(level => (
              <View 
                key={level}
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: getHeatColor(level),
                  marginLeft: 4,
                  borderRadius: 2,
                }}
              />
            ))}
          </View>
          <Text className="text-white/50 text-xs">More</Text>
        </View>
        
        {/* Reading minutes this month */}
        <View className="mt-6 items-center">
          <Text className="text-white text-base">
            {READING_DATA.reduce((total, day) => total + day.minutes, 0)} minutes read this month
          </Text>
        </View>
      </View>
    </View>
  );
} 