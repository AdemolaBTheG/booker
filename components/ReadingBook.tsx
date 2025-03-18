import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Icon } from './Icon'
import { booksService } from '@/services/booksService'
import { useQuery } from '@tanstack/react-query'
import { Image } from 'expo-image'
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import { Link } from 'expo-router'
import ProgressBar from './ProgressBar'

const DESIRED_HEIGHT = 100;
const aspectRatio = 42.67/61.33;
const CALCULATED_WIDTH = Math.round(DESIRED_HEIGHT * aspectRatio);

export default function ReadingBook() {
    const [isOpen, setIsOpen] = useState(false)
    
    const {data} = useQuery({
        queryKey: ['books'],
        queryFn: () => booksService.getAllBooksWithLatestSession()
    })

  return (
    <View className='flex-col items-center justify-center'>
      <Pressable className='flex-row items-center justify-between w-full px-4' onPress={() => setIsOpen(!isOpen)}>
        <Text className='text-white text-xl font-semibold'>Currently Reading</Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color='white' type='ionicons' />
      </Pressable>
      
      {isOpen && (
        <Animated.View 
          className='w-full mt-4' 
          entering={FadeInUp} 
          exiting={FadeOutUp} 
          layout={LinearTransition.springify()}
        >
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 4, paddingRight: 16 }}
          >
            {data?.map((book) => (
              book.latestSession && (
                
                <Animated.View 
                  key={book.id} 
                  className='flex-row bg-white/15 px-3 py-3 items-center justify-center mr-4' 
                  style={{borderRadius: 28}} 
                  entering={FadeInUp} 
                  exiting={FadeOutUp} 
                  layout={LinearTransition.springify()}
                >
                  <View className="flex-row   gap-3">
                    <Image 
                      source={{uri: book.thumbnail.replace('http://', 'https://')}} 
                      contentFit='cover' 
                      style={{width: CALCULATED_WIDTH, height: DESIRED_HEIGHT, borderRadius: 12}} 
                    />
                    <View className='flex-col gap-1' style={{width: 170}}>
                      <Text 
                        className='text-white text-base font-medium' 
                        style={{lineHeight: 16}} 
                        numberOfLines={2} 
                        ellipsizeMode='tail'
                      >
                        {book.title}
                      </Text>
                      <Text className=' font-medium' numberOfLines={2} 
 style={{fontSize:12, height: 35, color: 'rgba(255,255,255,0.5)'}}>
                        {book.authors}
                      </Text>
                      {book.latestSession && book.latestSession.pagesRead > 0 && (
                        <ProgressBar 
                          progress={(book.latestSession.pagesRead + book.latestSession.startedAtPage) / book.pages}
                        />
                      )}
                    </View>
                  </View>
                  <Link href={`/(books)/${book.id}/timer`}>
                    <Icon 
                      name="play-circle" 
                      size={42} 
                      color='#513EC7' 
                      type='ionicons' 
                    />
                  </Link>
                </Animated.View>
              )
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  )
}