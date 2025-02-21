import { useLocalSearchParams } from 'expo-router';

import { Icon } from '@/components/Icon'
import NativeDropDown from '@/components/NativeDropDown'
import { Link } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Pressable, TextInput,Image } from 'react-native'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { Book } from '@/lib/types';
import { booksService } from '@/services/booksService';
import * as ImagePicker from 'expo-image-picker';
import { useQuery } from '@tanstack/react-query';


const handlePress = (key:string) => {
  console.log(key)
}




const  readingStatus = [
  {
    key: '1',
    title: 'Reading',
    icon: 'book',
    iconAndroid: 'menu_book_24px',
  },
  {
    key: '2',
    title: 'Finished',
    icon: 'checkmark',
    iconAndroid: 'check_24px',
  },
  {
    key: '3',
    title: 'Cancelled',
    icon: 'xmark',
    iconAndroid: 'close_24px',
  },

]

const ownershipStatus = [
  {
    key: '1',
    title: 'Owned',
    icon: 'cart',
  },
  {
    key: '2',
    title: 'Not Owned',
    icon: 'xmark.circle',
    iconAndroid: 'favorite_24px',
  },
  {
    key: '3',
    title: 'Borrowed',
    icon: 'clock',
    iconAndroid: 'menu_book_24px',
  },
  
]

const bookFormats = [

  {
    key: '1',
    title: 'Paperback',
    icon: 'book',
    iconAndroid: 'menu_book_24px',
  },
  {
    key: '2',
    title: 'Hardcover',
    icon: 'book.closed',
    iconAndroid: 'menu_book_24px',
  },
  {
    key: '3',
    title: 'Audiobook',
    icon: 'headphones',
    iconAndroid: 'menu_book_24px',
  },
  {
    key: '4',
    title: 'eBook',
    icon: 'iphone',
    iconAndroid: 'menu_book_24px',
  },
 
 
]

function Seperator(){

  return(
    <View className="w-full h-px bg-white/10 px-0"/>
  )
}


export default function Edit() {



const {book} = useLocalSearchParams<{book: string}>();
const [image, setImage] = useState<string | null>(null);
const [editBook, setEditBook] = useState<Book | null>(null);
 const {data} = useQuery<Book>({
  queryKey: ['book', book],
  queryFn: async () => {
    if (book === "-1") throw new Error('Creating new book');
    return await booksService.getBookDetails(book);
   
  }
})

useEffect(() => {
  if (data) {
    setEditBook(data);
  }
}, [data]);


const pickImageAsync = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    selectionLimit: 1,

    quality: 1,
  });
  console.log(result);
  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
}
console.log(book);


  
  return (
    <View className='flex-1 '>
    
      <ScrollView className={`flex-1 px-4 `}>
       <View className='flex  items-center justify-center'>
       <Pressable onPress={pickImageAsync}>
          {
            image ? (<Image source={{uri: image}} className='w-28 h-40 rounded-xl border-white border-2' resizeMode='cover' />) : (   <View className="flex items-center justify-center border w-28 mx-auto h-40 border-white/10 bg-white/15 rounded-xl">
              <Icon name='add' size={28} className='' color='white' type='material' />
            </View>) 
          }
     

        </Pressable>
       </View>
        
      
        <View className='mt-5 gap-2'>
        <Text className='text-white text-sm font-medium px-2 '>Book Details</Text>
        <View className="flex flex-col   items-center  justify-center bg-white/15 rounded-xl border-white/10 border">
          <View className="flex flex-row p-3 justify-between w-full border-b   items-center  border-white/10">
              <Text className='text-white/40 font-semibold'>Title</Text>
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' value={editBook?.title} onChangeText={(text) => {
              if (editBook) {
                setEditBook({
                  ...editBook,
                  title: text
                });
              }
             }}/>
          </View>

          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='  text-white/40 font-semibold'>Author</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Author' value={editBook?.authors?.toString()}
             onChangeText={(text) => {
              if (editBook) {
                setEditBook({
                  ...editBook,
                  authors: text.split(',')
                });
                console.log(editBook);
              }
             }} />
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='text-white/40 font-semibold'>Pages</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Pages' value={editBook?.pageCount?.toString()} />
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='text-white/40 font-semibold'>Format</Text>
            
         <NativeDropDown items={bookFormats} onSelect={handlePress} />
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='text-white/40 font-semibold pr-2'>Publisher</Text>
            
            <TextInput className="flex-1 text-white"
             textAlign='right'
             placeholder='Enter Publisher' value={editBook?.publisher} />
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='text-white/40 font-semibold'>Year</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Year' value={editBook?.publishedDate} />
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full border-b border-white/10  items-center  ">
              <Text className='text-white/40 font-semibold'>ISBN 10</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter ISBN 10' value={editBook?.isbn_10} />
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full    items-center  ">
              <Text className='text-white/40 font-semibold'>ISBN 13</Text>
            
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter ISBN 13' value={editBook?.isbn_13} />
            
          
          </View>
        </View>
        <View className=' flex mt-7 gap-2'>
          <Text className='text-white text-sm font-medium px-2'>Description</Text>
          <TextInput placeholder='Add your Description here' multiline={true} textAlignVertical='top'   className="h-40 w-full text-white bg-white/15 rounded-xl border-white/10 border px-3 py-3" value={editBook?.description}/>
        </View>

        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Reading Acivity</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Reading Status</Text>
          <NativeDropDown items={readingStatus} onSelect={handlePress} />
        </View>
        </View>
        <View className="flex flex-col mt-7 gap-2 mb-40">
        <Text className='text-white text-sm font-medium px-2'>Collection & Ownership</Text>
        <View className="flex flex-row items-center justify-between p-3  border bg-white/15 border-white/10 rounded-xl">
         <Text className="text-white/40 font-semibold">Ownership Status</Text>
         <NativeDropDown items={ ownershipStatus} onSelect={handlePress} />
        </View>
        </View>
       
      </ScrollView>
      <View  className="absolute bottom-0 flex  left-0 right-0 bg-black   border-t border-white/10">
      <View className='flex-row items-center justify-center p-4'>
      <Pressable onPress={() => console.log("Hello")} className='btn-primary gap-1 mb-12 p-4 w-full '>
            <Icon name='add' size={28} color='white' type='material' />
            <Text className='text-white text-lg font-semibold'>Add To Library</Text>
          </Pressable>
      </View>
         
        </View>
    
    </View> 

      
   
      
  )
}
