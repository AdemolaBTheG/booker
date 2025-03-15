import { View, Text, ScrollView, ImageBackground, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Link, router, useLocalSearchParams } from 'expo-router';
import { booksService, TimeSeriesResult, TimeUnit } from '@/services/booksService';
import { DbBook } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
import { Book, NewBook, ReadingSession } from '@/lib/types';
import Donut from '@/components/Donut';
import { CartesianChart, Line } from 'victory-native'
import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import NativeDropDown from '@/components/NativeDropDown';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const stats = [
  {
    key: '0',
    title: 'Today',
  },
  {
    key: '1',
    title: 'Week',
  },
  {
    key: '2',
    title: 'Month',
  },
  {
    key: '3',
    title: 'Year',
  },
  
]

export function Seperator(){
  return (
    <View className='w-full h-[1px] bg-white/20 my-6 px-4' />
  )
}


type BookDetailItemProps = {
  icon: string;
  label: string;
  value: string | number | string[] | null | undefined;
  type: 'ionicons' | 'material';
}

function BookDetailItem({ icon, label, value,type }: BookDetailItemProps) {
  
  return (
    <View className='flex-row items-start justify-between '>
      <View className="flex-row items-center gap-3 flex-shrink-0">
        <Icon name={icon as any} size={24} color='rgba(255, 255, 255, 0.8)' type={type} />
        <Text className='text-white/80 text-base font-semibold text-left'>{label}</Text>
      </View>


      <Text className='text-white text-base font-semibold  text-right flex-1 ' >{value ? value : 'N/A'}</Text>
    </View>
  )
}


 function  BookDetail({ book }: { book: NewBook }) {
  const details = [
    { icon: "menu-book",type: 'material', label: 'Pages', value: book?.pages },
    { icon: "earth",type: 'ionicons', label: 'Publisher', value: book?.publisher },
    { icon: "calendar-month",type: 'material', label: 'Published', value: book?.publishedDate },
    { icon: "barcode",type: 'ionicons', label: 'ISBN 10', value: book?.isbn_10 },
    { icon: "barcode",type: 'ionicons', label: 'ISBN 13', value: book?.isbn_13 },


    // Add more fields as needed
  ];

  return (
    <View className='flex-col w-full gap-4'>
       {book?.description  ? (
              <Pressable style={{paddingBottom: 24 }}  onPress={() => router.push(`/${book.id}/description`)}>
         
                  <Text className='absolute bottom-0 right-0 text-white font-bold'>Read More</Text>
              
                  <Text className='text-white/80 text-base font-medium text-left mt-4' numberOfLines={4} ellipsizeMode='tail'>{book?.description} </Text></Pressable>
            ) : (
              <Text className='text-white/80 text-base font-semibold text-left mt-4'>No description available</Text>
            )}
      <View className='w-full h-[0.5px] bg-white/20 my-3 '/>
      {details.map((detail, index) => (
        <BookDetailItem
          key={detail.label}
          icon={detail.icon}
          label={detail.label}
          value={detail.value}
          type={detail.type as 'ionicons' | 'material'}
        />
      ))}
    </View>
  )
}
export default function BookItem() {

    const queryClient = useQueryClient();
    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.HOUR)
      const {data} = useQuery<TimeSeriesResult[]>({
        queryKey: ['timeSeriesData'],
      queryFn: () => booksService.getHoursInDay(new Date(), Number(bookId))
    })

    const {data : readingSessions} = useQuery({
      queryKey: ['readingSessions'],
      queryFn: async() => {

          return await booksService.getSessionsByBookId(parseInt(bookId as string));
      }
    })

    const {data : book} = useQuery({
      queryKey: ['book'],
      queryFn: async() => {
        return await booksService.getBookById(bookId as string);
      }
    })
    useEffect(() => {
      if(readingSessions){
        console.log("These are the reading sessions", readingSessions);
      }
    }, [readingSessions])

    async function changeTimeUnit(time: string) {
      let newData: TimeSeriesResult[] = [];
      switch(time){
    
        case 'Today':
        newData = await booksService.getHoursInDay(new Date(), -1)
        setTimeUnit(TimeUnit.HOUR)
          break;
          case 'Week':
            newData = await booksService.getDaysInWeek(new Date(), -1)
            setTimeUnit(TimeUnit.DAY)
            break;
        case 'Month':
          newData = await booksService.getAllDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1, -1)
          setTimeUnit(TimeUnit.MONTH)
          break;
     
        case 'Year':
          newData = await booksService.getAllMonthsInYear(new Date().getFullYear(),-1)
          setTimeUnit(TimeUnit.YEAR)
          break;
      
      }
      queryClient.setQueryData(['timeSeriesData'], newData)
    }
     
   


    const DESIRED_HEIGHT = 260; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); //calculated width of the image



  return (
    <ImageBackground source={{uri: book?.thumbnail?.replace('http://', 'https://')}} className='flex-1 '>
      <BlurView intensity={100} className='flex-1 '>
      <ScrollView className='flex-1 '>
        {readingSessions && book && (
          <View className='flex-1 items-center justify-center '>
          <View className='mt-16'>
            <Image source={{uri: book?.thumbnail?.replace('http://', 'https://')}} cachePolicy='disk'  contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 20,borderColor:"white",borderWidth:1}} />
          </View>
          <View className="flex items-center gap-1 mt-6 px-4">
              <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
              <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
            </View>
            <Link href={`/(books)/${bookId}/timer`}  className="mt-6  p-4 bg-cta rounded-full flex items-center justify-center"><Icon name='play' size={32} color='white' type='ionicons' /></Link>
    
            <View className="flex-1 w-full  items-center justify-center mt-12  py-4  bg-black rounded-t-[28px]">
           <View className='flex-col  w-full '>
            <View className='px-4'>
            <Text className="text-white text-xl font-medium mt-6"> Logs </Text>
            <View className="flex flex-row items-center justify-between  w-full mt-3 px-4  bg-white/15 py-3 rounded-3xl"> 
              <View className="flex-col items-center justify-center gap-2">
                <View className="flex-col items-start justify-center">
                <Text className="text-white text-base font-medium">{readingSessions[readingSessions.length - 1].startedAtPage + readingSessions[readingSessions.length - 1].pagesRead} out of {book.pages} pages read</Text>
                <Text className="text-white/60 text-base font-medium">Reading since {new Date(readingSessions[0].ended_at).toLocaleDateString()}</Text>
                <Text className='text-white/60 text-base text- font-medium mt-2'>{ readingSessions?.reduce((acc, session) => acc + session.pagesRead, 0) / (readingSessions?.length || 1) } pages / session</Text>
    
                </View>
    
              </View>
              <Donut 
                percentage={readingSessions[readingSessions.length - 1].pagesRead + readingSessions[readingSessions.length - 1].startedAtPage / book.pages * 100} 
                max={100} 
              />
            </View>
            </View>
         
            <Seperator />
    
            <View className='flex-row  items-center justify-between px-4'>
              <Text className='text-white text-xl font-medium text-left '>Statistics</Text>
              <NativeDropDown  items={stats}  type="stats" onSelect={changeTimeUnit}/>
            </View>
            <View className="flex-1  gap-4 px-4 mt-2">
            <BarChart color='#F44336' type='pages'  data={data} timeUnit={timeUnit}/>
            <BarChart color='#2196F3' type='minutes'  data={data} timeUnit={timeUnit}/>
            <LineChart color='#ff7f0e' timeUnit={timeUnit} data={data}/>
            </View>
            
           
            
            <Seperator/>
            <Text className="text-white text-xl font-medium px-4"> Notes </Text>
            <View className="flex-1 w-full">
            <FlatList horizontal={true} data={readingSessions} showsHorizontalScrollIndicator={false} renderItem={({item}) => (
              <>
                {item.notes ? (
              <View className="flex items-start justify-between   w-[300px] h-[120px] mt-3 p-4 bg-white/15 rounded-2xl ml-4"> 
              <Text className='text-white text-base font-medium ' numberOfLines={2} >{item.notes}</Text>
              <View className="flex-row items-center justify-between mt-4 w-full">
                <Text className='text-white/80 text-base font-medium'>{new Date(item.ended_at).toLocaleDateString()}</Text>
                <Text className='text-white/80 text-base font-medium'>Pages {item.startedAtPage} - {item.startedAtPage + item.pagesRead}</Text>
              </View>
            </View>
            ) : (
              <></>
            )}
              </>
            
            )} />
            </View>
            
    
            
          
          
            <Seperator/>
            <Text className="text-white text-xl font-medium px-4"> About </Text>
            <View className="flex items-center justify-between  w-full mt-3 px-4 "> 
              <BookDetail book={book} />
            </View>
           </View>
          
           
          </View>
          </View>
    
         
        )

}
      
   

    </ScrollView>
    
      </BlurView>
    </ImageBackground>
    
  )
}