import { Book } from '@/lib/types';
import { booksService } from '@/services/booksService';
import { Link, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, } from 'react-native'
import { Image } from 'expo-image';
import { Icon } from '@/components/Icon';


function Seperator(){
  return(
    <View className='w-full h-[1px] bg-white/20 my-3' />
  )
}


type BookDetailItemProps = {
  icon: string;
  label: string;
  value: string | number | string[] | undefined;
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

function BookDetail({ book }: { book: Book }) {
  const details = [
    { icon: "menu-book",type: 'material', label: 'Pages', value: book?.pageCount },
    { icon: "earth",type: 'ionicons', label: 'Publisher', value: book?.publisher },
    { icon: "calendar-month",type: 'material', label: 'Published', value: book?.publishedDate },
    { icon: "barcode",type: 'ionicons', label: 'ISBN 10', value: book?.isbn_10 },
    { icon: "barcode",type: 'ionicons', label: 'ISBN 13', value: book?.isbn_13 },


    // Add more fields as needed
  ];

  return (
    <View className='flex-col gap-4'>
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
export default function BookDetails() {


  const PLACEHOLDER_BLURHASH = 'L5P?:p~q-;M{%jxuNGRj.8t7t7Rj';

  const DESIRED_HEIGHT = 240;
  const aspectRatio = 42.67/61.33; 
  const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);
  console.log(CALCULATED_WIDTH,DESIRED_HEIGHT);
    const {id} = useLocalSearchParams<{id: string}>();
    
    const [book,setBook] = useState<Book | null>(null);
    const fetchBookDetails = async () => {
      try{

            const results = await booksService.getBookDetails(id);
        if(results.thumbnail){
          await Image.prefetch(results.thumbnail?.replace('http://', 'https://'));
        }
        setBook(results);
      } catch (error) {
        console.log(error);
      }
    
    };



    useEffect(() => {
    
        fetchBookDetails();
    }, [id]);

  return (

      <ScrollView className='flex-1  px-4'>
        <View className='flex-1 items-center'>
        <View className=' mt-16'>
          <Image source={{uri: book?.thumbnail?.replace('http://', 'https://')}} cachePolicy='disk' placeholder={PLACEHOLDER_BLURHASH} contentFit='cover' style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 16}} />
        </View>

        <View className="flex items-center gap-1 mt-6">
          <Text className='text-center text-white text-xl font-bold'>{book?.title}</Text>
          <Text className='text-center text-white/80 text-base font-semibold'>{book?.authors}</Text>
        </View>

        <Link href={{pathname: `/[book]/edit`, params: {book: id}}} className="inline-flex btn-primary gap-1 mt-6 p-3 w-full "><Icon name='add' size={24} color='white' type='material' /><Text className='text-white text-base font-semibold'>Add To Library</Text></Link>


        <View className='mt-10 flex-1 w-full px-4'>
          <Text className='text-white text-lg font-semibold text-left'>About</Text>
          <Text className='text-white/80 text-base font-semibold text-left mt-4'>{book?.description || 'No description available'}</Text>
          <Seperator />
          {
            book && <BookDetail book={book} />
          }
          

        </View>   
        </View>
        


      </ScrollView>
      

    
    
    
    


 
      

  )
}

