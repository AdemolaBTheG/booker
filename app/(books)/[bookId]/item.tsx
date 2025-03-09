import { View, Text, ScrollView, ImageBackground, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Link, useLocalSearchParams } from 'expo-router';
import { booksService } from '@/services/booksService';
import { DbBook } from '@/db/schema';
import { BlurView } from 'expo-blur';
import { Icon } from '@/components/Icon';
import { Book, NewBook, ReadingSession } from '@/lib/types';
import Donut from '@/components/Donut';
import { CartesianChart, Line } from 'victory-native'
import BarChart from '@/components/BarChart';



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
      <Text className='text-white/80 text-base font-semibold text-left ' >{book?.description}</Text>
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

    const {bookId} = useLocalSearchParams<{bookId: string}>(); //retrieve the book id from the url
    const [book, setBook] = useState<DbBook | null>(null);
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
     
    useEffect(() =>{

        const fetchBook = async () => {
            const book = await booksService.getBookById(bookId);
            setBook(book);
        }

        const fetchSessions = async () => {
            const sessions = await booksService.getSessionsByBookId(Number(bookId));
            console.log(sessions);
            console.log(sessions.length);
            setSessions(sessions);
        }
        
        const fetchBookStatistics = async () => {
            const statistics = await booksService.getBookStatistics(Number(bookId));
            console.log(statistics);
        } 

        fetchBook();
        fetchSessions();
        fetchBookStatistics();
    },[bookId])

    if(!book){
        return <View className='flex-1 items-center justify-center'>
            <Text>Loading...</Text>
        </View>
    }
    const DESIRED_HEIGHT = 260; //desired height of the image
    const aspectRatio = 42.67/61.33; //aspect ratio of the image
    const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio); //calculated width of the image



  return (
    <ImageBackground source={{uri: book?.thumbnail?.replace('http://', 'https://')}} className='flex-1 '>
      <BlurView intensity={100} className='flex-1 '>
      <ScrollView className='flex-1 '>
      <View className='flex-1 items-center justify-center '>
      <View className='mt-16'>
        <Image source={{uri: book?.thumbnail?.replace('http://', 'https://')}} cachePolicy='disk'  contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 20,borderColor:"white",borderWidth:1}} />
      </View>
      <View className="flex items-center gap-1 mt-6 px-4">
          <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
          <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
        </View>
        <Link href={`/(books)/${bookId}/timer`}  className="mt-6  p-4 bg-cta rounded-full flex items-center justify-center"><Icon name='play' size={32} color='white' type='ionicons' /></Link>

        <View className="flex-1 w-full h-full items-center justify-center mt-12 px-4 py-4  bg-black rounded-t-[28px]">
       <View className='flex-col items-start justify-start w-full px-4'>
       <Text className="text-white text-xl font-medium mt-6"> Logs </Text>
        <View className="flex flex-row items-center justify-between  w-full mt-3 px-4  bg-white/15 py-3 rounded-3xl"> 
          <View className="flex-col items-center justify-center gap-2">
            <View className="flex-col items-start justify-center">
            <Text className="text-white text-base font-medium">{sessions.length > 0 ? sessions[sessions.length - 1].pagesRead : 0} out of {book?.pages} pages read</Text>
            <Text className="text-white/60 text-base font-medium">Reading since {sessions.length > 0 ? new Date(sessions[sessions.length - 1].ended_at).toLocaleDateString() : 'N/A'}</Text>
            <Text className='text-white/60 text-base text- font-medium mt-2'>50 pages / session</Text>

            </View>

          </View>
          <Donut 
            percentage={sessions.length > 0 ? sessions[sessions.length - 1].pagesRead / book?.pages * 100 : 0} 
            max={100} 
          />
        </View>
        <Seperator />

        <Text className="text-white text-xl font-medium "> Statistics </Text>
        <View className="flex-1 items-center justify-center w-full mt-3 px-4 py-4 bg-white/15 rounded-xl">
        <View className="flex-1 flex-row w-full justify-between items-center ">
          <Text className='text-white text-xl font-medium text-left'>Pages read</Text>
          <Text className='text-white/80 text-base font-semibold text-right'>120</Text>
          </View> 
          <View style={{flex:1,height:'150',width:'100%',marginTop:12}}>
            <BarChart color='#2196F3'/>
          </View>
        </View>
        <View className="flex-1 items-center justify-center w-full mt-4 px-4 py-4 bg-white/15 rounded-xl">
        <View className="flex-1 flex-row w-full justify-between items-center">
          <Text className='text-white text-xl font-medium text-left'>Minutes read</Text>
          <Text className='text-white/80 text-base font-medium text-right'>120</Text>
          </View> 
          <View style={{flex:1,height:'150',width:'100%',marginTop:12}}>
            <BarChart color='#F44336'/>
          </View>
        </View>
        <Seperator/>
        <Text className="text-white text-xl font-medium "> Notes </Text>
        <FlatList horizontal={true} data={sessions} renderItem={({item}) => (
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

        
      
      
        <Seperator/>
        <Text className="text-white text-xl font-medium "> About </Text>
        <View className="flex items-center justify-between  w-full mt-3 px-4 "> 
          <BookDetail book={book} />
        </View>
       </View>
      
       
      </View>
      </View>

     
   

    </ScrollView>
    
      </BlurView>
    </ImageBackground>
    
  )
}