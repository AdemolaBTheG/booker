import { View, Text, ScrollView, ImageBackground, Pressable, Alert, ActivityIndicator } from 'react-native'
import React, {  useEffect, useMemo, useState } from 'react'
import { Image } from 'expo-image'
import { Link, router, useLocalSearchParams } from 'expo-router';
import { booksService, TimeSeriesResult, TimeUnit } from '@/services/booksService';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
import {  NewBook } from '@/lib/types';
import Donut from '@/components/Donut';
import BarChart from '@/components/BarChart';
import LineChart from '@/components/LineChart';
import NativeDropDown from '@/components/NativeDropDown';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LongestStreak from '@/components/LongestStreak';
import { FlashList } from '@shopify/flash-list';
import Purchases from 'react-native-purchases';

const MemoizedBookDetail = React.memo(BookDetail)
const MemoizedLongestStreak = React.memo(LongestStreak);

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

const editItem = [
  {
    key: '0',
    title: 'Edit',
  },
  {
    key: '1',
    title: 'Delete',
  },
]
export function Seperator(){
  return (
    <View className='w-[90%] h-[1px] bg-white/20 my-6 mx-auto' />
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
    const [isActive, setIsActive] = useState(false);
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
      const getCustomerInfo = async () => {
        const customerInfo = (await Purchases.getCustomerInfo()).entitlements.active['Plus'] !== undefined
        setIsActive(customerInfo);
      }
      getCustomerInfo();
    }, []);
 

    const changeTimeUnit = React.useCallback(async (time: string) => {
      let newData: TimeSeriesResult[] = [];

      if(!isActive){
        router.push('/paywall')
        return;
      }
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
    }, [bookId]);

    const onChangeItem = React.useCallback((item: string) => {
      if(item === 'Edit'){
          router.push(`/${bookId}/edit`);
      }
      if(item === 'Delete'){
          Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Delete', style: 'destructive', onPress: async () => {
                  await booksService.deleteBook(Number(bookId));
                  queryClient.invalidateQueries({ queryKey: ['bookCount'] }); 
                  queryClient.invalidateQueries({ queryKey: ['countOfFilters'] });
                  router.replace('/');
              }}
          ]);
      }
  }, [bookId]);
   


    const DESIRED_HEIGHT = 210; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = useMemo(() => Math.round(DESIRED_HEIGHT * aspectRatio), [DESIRED_HEIGHT, aspectRatio]); //calculated width of the image

  if(!readingSessions || !book){
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size='large' color='#513EC7' />
      </View>
    )
  }

  return (
    <ImageBackground source={{uri: book?.thumbnail?.replace('http://', 'https://')}}   className='flex-1 '>
      <BlurView intensity={80} className='flex-1 '>
      <View className="flex-row items-center justify-between p-4 mt-20">
            <Pressable onPress={() => router.back()} className='rounded-full flex items-center justify-center'><Icon name='chevron-back' size={28} color='white' type='ionicons' /></Pressable>
            <Text className='text-white text-lg font-medium flex-1 text-center' >{book?.title}</Text>
            <NativeDropDown items={editItem} type='item' onSelect={onChangeItem}/>
          </View>
      <ScrollView className='flex-1 '>
       
    
       
         
          <View className='flex items-center justify-center '>
            
          <View className='mt-12'>
            <Image source={{uri: book?.thumbnail?.replace('http://', 'https://')}} cachePolicy='memory-disk' transition={300}  contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 20}} />
          </View>
          <View>
          </View>
          <View className="flex items-center gap-1 mt-6 px-4">
              <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
              <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
            </View>
            <View className='mt-6'>

            {
              readingSessions && readingSessions.length > 0 && readingSessions[readingSessions.length - 1].startedAtPage + readingSessions[readingSessions.length - 1].pagesRead >= book.pages ? (
                <Icon name='checkmark-circle-outline' size={64} color='#22c55e' type='ionicons'  />
              ) : (
                <Link href={`/(books)/${bookId}/timer`}  className="mt-6    rounded-full flex items-center justify-center"><Icon name='play-circle-outline' size={64} color='#513EC7' type='ionicons' /></Link>
              )
            }
                      </View>

            <View className="flex-1 w-full  items-center justify-center mt-12  py-4  bg-black rounded-t-[28px]">
           <View className='flex-col  w-full '>
            <View className='px-4'>
            <Text className="text-white text-xl font-medium mt-6"> Logs </Text>
            <View className="flex flex-row items-center justify-between w-full mt-3 px-4 bg-white/15 py-3 rounded-2xl"> 
              <View className="flex-col items-center justify-center gap-2">
                <View className="flex-col items-start justify-center">
                  {readingSessions && readingSessions.length > 0 ? (
                    <>
                      <Text className="text-white text-base font-medium">
                        {(readingSessions[readingSessions.length - 1]?.startedAtPage || 0) + 
                          (readingSessions[readingSessions.length - 1]?.pagesRead || 0)} out of {book.pages} pages read
                      </Text>
                      <Text className="text-white/60 text-base font-medium">
                        Reading since {readingSessions[0]?.ended_at ? new Date(readingSessions[0].ended_at).toLocaleDateString() : 'N/A'}
                      </Text>
                      <Text className='text-white/60 text-base text-center font-medium mt-2'>
                        {readingSessions.reduce((acc, session) => acc + (session.pagesRead || 0), 0) / (readingSessions.length || 1)} pages / session
                      </Text>
                    </>
                  ) : (
                    <Text className="text-white text-base font-medium">No reading sessions yet</Text>
                  )}
                </View>
              </View>
              <Donut 
                percentage={readingSessions && readingSessions.length > 0 
                  ? ((readingSessions[readingSessions.length - 1]?.pagesRead || 0) + 
                     (readingSessions[readingSessions.length - 1]?.startedAtPage || 0)) / book.pages * 100 
                  : 0} 
                max={100} 
              />
            </View>
            
            </View>
            <View className='mt-3 px-4'>
            <MemoizedLongestStreak bookId={Number(bookId)}/>
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
              {
                readingSessions && readingSessions.length > 0 ? (   <FlashList estimatedItemSize={120} horizontal={true} data={readingSessions}  showsHorizontalScrollIndicator={false} renderItem={({item}) => (
                  <>
                    {item.notes && (
                  <View className="flex items-start justify-between   w-[300px] h-[100px] mt-3 p-4 bg-white/15 rounded-2xl ml-4"> 
                  <Text className='text-white text-base font-medium ' numberOfLines={2} >{item.notes}</Text>
                  <View className="flex-row items-center justify-between mt-4 w-full">
                    <Text className='text-white/80 text-base font-medium'>{new Date(item.ended_at).toLocaleDateString()}</Text>
                    <Text className='text-white/80 text-base font-medium'>Pages {item.startedAtPage} - {item.startedAtPage + item.pagesRead}</Text>
                  </View>
                </View>
                )}
                  </>
                
                )} />) : (
                  <View className='flex items-center justify-center '>
                    <Text className='text-white text-base font-medium'>No notes yet</Text>
                  </View>
                )
              }
         
            </View>
            
    
            
          
          
            <Seperator/>
            <Text className="text-white text-xl font-medium px-4"> About </Text>
            <View className="flex items-center justify-between  w-full mt-3 px-4 "> 
              <MemoizedBookDetail book={book} />
            </View>
           </View>
          
           
          </View>
          </View>
    
      
      
        


      
   

    </ScrollView>
    
      </BlurView>
    </ImageBackground>
    
  )
}