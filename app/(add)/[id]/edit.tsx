import { useLocalSearchParams, useRouter } from 'expo-router';

import { Icon } from '@/components/Icon'
import NativeDropDown from '@/components/NativeDropDown'
import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Pressable, TextInput,Image } from 'react-native'
import { Book } from '@/lib/types';
import { booksService } from '@/services/booksService';
import * as ImagePicker from 'expo-image-picker';
import { useQuery } from '@tanstack/react-query';
import {Controller, useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { bookSchema } from '@/lib/types';
import { z } from 'zod';







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




export default function Edit() {
  const {id} = useLocalSearchParams<{id: string}>();
  const [editBook, setEditBook] = useState<Book | null>(null);
 const {data} = useQuery<Book>({
  queryKey: ['book', id],
  queryFn: async () => {
    if (id === "-1") throw new Error('Creating new book');
    return await booksService.getBookDetails(id);
   
  }
})
type BookForm = z.infer<typeof bookSchema>






const pickImageAsync = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    selectionLimit: 1,

    quality: 1,
  });
  console.log(result);
  
    if (!result.canceled) {

      form.setValue('thumbnail', result.assets[0].uri,{shouldDirty: true, shouldTouch: true,shouldValidate: true});
    }
  
}
  const  form = useForm<BookForm>({
    resolver: zodResolver(bookSchema),
 
  })


  useEffect(() => {
    if (data) {
      setEditBook(data);
  
      form.setValue('title', data.title);
      form.setValue('authors', data.authors || []);
      form.setValue('pages', data.pageCount?.toString() || '0');
      form.setValue('publisher', data.publisher || '');
      form.setValue('publishedDate', data.publishedDate || '');
      form.setValue('description', data.description || '');
      form.setValue('isbn_10', data.isbn_10 || '');
      form.setValue('isbn_13', data.isbn_13 || '');
      form.setValue('thumbnail', data.thumbnail || '');
     
    
    }
  }, [data]);

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);
  

  const onSubmit = async (data: BookForm) => {
    try {
      const bookData = {
        ...data,
        pages: parseInt(data.pages, 10),
        authors: data.authors?.join(',') || null,
      };
      await booksService.addBook(bookData);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

 
  return (
    <View className='flex-1 '>
    
      <ScrollView className={`flex-1 px-4 `}>
       <View className='flex  items-center justify-center'>
       <Pressable onPress={pickImageAsync}>
          {
            form.getValues('thumbnail') ? (<Image source={{uri: form.getValues('thumbnail')}} className='w-28 h-40 rounded-xl border-white border-2' resizeMode='cover' />) : (   <View className="flex items-center justify-center border w-28 mx-auto h-40 border-white/10 bg-white/15 rounded-xl">
              <Icon name='add' size={28} className='' color='white' type='material' />
            </View>) 
          }
     

        </Pressable>
       </View>
        
      
        <View className='mt-5 gap-2'>
        <Text className='text-white text-sm font-medium px-2 '>Book Details</Text>
        <View className="flex flex-col   items-center  justify-center bg-white/15 rounded-xl border-white/10 border">
          <View className="form-container ">
          <Text className={`form-label ${form.formState.errors.title ? 'text-red-500' : 'text-white/40'}`}>Title</Text>
          <Controller 
            control={form.control}
            name='title'
            render={({field: {onChange,value,onBlur}}) => (
              <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Title' 
             onChangeText={(text) => {
              onChange(text);
              form.getValues('title');
            }}
             onBlur={onBlur}
             value={value}
             />
            )}/>
          </View>

          <View className="form-container ">
              <Text className='form-label'>Author</Text>
            <Controller control={form.control} name='authors' render={({field: {onChange,value,onBlur}}) => (
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Author' 
             value={value?.join(',')} 
             onChangeText={onChange}
             onBlur={onBlur}
            />
            )}/>
          
          </View>
          <View className="form-container ">
              <Text className= {`form-label ${form.formState.errors.pages ? 'text-red-500' : 'text-white/40'}`}>Pages</Text>
            <Controller control={form.control} name='pages' render={({field: {onChange,value,onBlur}}) => (
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Pages' 
             onChangeText={onChange}
             onBlur={onBlur}
             value={value?.toString()} />
            )}/>
            
          
          </View>
          <View className="form-container ">
              <Text className= {`form-label ${form.formState.errors.format ? 'text-red-500' : 'text-white/40'}`}>Format</Text>
            
         <NativeDropDown items={bookFormats} onSelect={(title) => form.setValue('format',title,{shouldDirty: true, shouldTouch: true,shouldValidate: true})} isEdit={true} />
         <Controller control={form.control} name='format' render={({field: {onChange,value,onBlur}}) => (
         <TextInput className="hidden" 
         value={value} 
         onChangeText={onChange}
         onBlur={onBlur}
         />
         )}/>  
       
          
          </View>
          <View className="form-container ">
              <Text className='form-label '>Publisher</Text>
            
            <TextInput className="flex-1 text-white"
             textAlign='right'
             placeholder='Enter Publisher' value={editBook?.publisher} />
            
          
          </View>
          <View className="form-container ">
              <Text className='form-label'>Year</Text>
            
            <Controller control={form.control} name='publishedDate' render={({field: {onChange,value,onBlur}}) => (
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter Year' 
             onChangeText={onChange}
             onBlur={onBlur}
             value={value} />
            )}/>
            
          
          </View>
          <View className="form-container ">
              <Text className='form-label'>ISBN 10</Text>
            
            <Controller control={form.control} name='isbn_10' render={({field: {onChange,value,onBlur}}) => (
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter ISBN 10' 
             onChangeText={onChange}
             onBlur={onBlur}
             value={value} />
            )}/>
            
          
          </View>
          <View className="flex flex-row p-3 justify-between w-full    items-center  ">
              <Text className='form-label'>ISBN 13</Text>
            
            <Controller control={form.control} name='isbn_13' render={({field: {onChange,value,onBlur}}) => (
            <TextInput className="w-5/6 text-white"
             textAlign='right'
             placeholder='Enter ISBN 13' 
             onChangeText={onChange}
             onBlur={onBlur}
             value={value} />
            )}/>
            
          
          </View>
        </View>
        <View className=' flex mt-7 gap-2'>
          <Text className='text-white text-sm font-medium px-2'>Description</Text>
          <Controller control={form.control} name='description' render={({field: {onChange,value,onBlur}}) => (
          <TextInput placeholder='Add your Description here' multiline={true} textAlignVertical='top'   className="h-40 w-full text-white bg-white/15 rounded-xl border-white/10 border px-3 py-3" 
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          />
          )}/>
        </View>

        </View>
        <View className="flex flex-col mt-7 gap-2">
        <Text className='text-white text-sm font-medium px-2'>Reading Acivity</Text>
        <View className="form-select-container">
         <Text className= {`form-label ${form.formState.errors.readingStatus ? 'text-red-500' : 'text-white/40'}`}>Reading Status</Text>
          <NativeDropDown items={readingStatus} onSelect={(title) => form.setValue('readingStatus',title,{shouldDirty: true, shouldTouch: true,shouldValidate: true})} isEdit={true} />
        </View>
        </View>
        <View className="flex flex-col mt-7 gap-2 mb-40">
        <Text className='text-white text-sm font-medium px-2'>Collection & Ownership</Text>
        <View className="form-select-container">
         <Text className= {`form-label ${form.formState.errors.ownershipStatus ? 'text-red-500' : 'text-white/40'}`}>Ownership Status</Text>
         <NativeDropDown items={ ownershipStatus} onSelect={(title) => form.setValue('ownershipStatus',title,{shouldDirty: true, shouldTouch: true,shouldValidate: true})} isEdit={true} />
        </View>
        </View>
       
      </ScrollView>
      <View  className="absolute bottom-0 flex  left-0 right-0 bg-black   border-t border-white/10">
      <View className='flex-row items-center justify-center p-4'>
      <Pressable 
        onPress={form.handleSubmit(onSubmit)} 
        disabled={form.formState.isSubmitting}
        className='btn-primary gap-1 mb-12 p-4 w-full'
      >
        <Icon name='add' size={28} color='white' type='material' />
        <Text className='text-white text-lg font-semibold'>Add To Library</Text>
      </Pressable>
      </View>
         
        </View>
    
    </View> 

      
   
      
  )
}
