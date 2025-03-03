import { Icon } from '@/components/Icon'
import { Link, router } from 'expo-router'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Pressable, FlatList } from 'react-native'
import { booksService } from '@/services/booksService'
import { Book } from '@/lib/types'
import { FlashList } from '@shopify/flash-list'
import BookItem from '@/components/BookItem'
import { Image as ExpoImage } from 'expo-image'
import { useQuery } from '@tanstack/react-query'
import SearchBar from '@/components/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'

function skeletonBookItem(){
    return(
        <View className='flex-row flex-1 justify-between mt-5'>
            <View className='flex-row w-full justify-between items-center'>
                <View className='flex-row gap-3 items-center'>
                    <View className='w-20 h-32 rounded-xl bg-white/10' />
                    <View className='flex-col gap-1 max-w-[150px]'>
                        <View className='h-[18px] w-36 bg-white/10 rounded' />
                        <View className='h-4 w-24 bg-white/10 rounded mt-1' />
                    </View>
                </View>
                <View className='h-[31px] w-[108px] bg-white/10 rounded-lg' />
            </View>
        </View>

    )
}

// Book card component for horizontal lists
function HorizontalBookCard({ book, onPress }: { book: Book, onPress: () => void }) {
  return (
    <Pressable 
      onPress={onPress} 
      className="mr-5 w-28 active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      }}
    >
      <View className="w-28">
        <ExpoImage
          source={{ uri: book?.thumbnail?.replace('http://', 'https://') }}
          style={{ 
            width: 112, 
            height: 168, 
            borderRadius: 8,
          }}
          contentFit="cover"
          cachePolicy="disk"
          transition={300}
        />
        <Text className="text-white mt-2 text-sm font-medium" numberOfLines={2}>
          {book.title}
        </Text>
        <Text className="text-white/60 text-xs mt-0.5" numberOfLines={1}>
          {book.authors}
        </Text>
      </View>
    </Pressable>
  );
}

export default function Index() {

    const [query, setQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const skeletonItems = Array(10).fill(null);  // Show 6 skeleton items
    const [prefetchedImages, setPrefetchedImages] = useState<Set<string>>(new Set());
    const debouncedQuery = useDebounce(query, 500); // 500ms delay
    
    // Sample bestsellers - in production this would come from an API
    const [bestsellers, setBestsellers] = useState<Book[]>([]);
    const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);

    const { data, isLoading } = useQuery<Book[]>({
        queryKey: ['books', debouncedQuery],
        queryFn: async () => {
            if (debouncedQuery.length <= 2) return [];
            return await booksService.searchBooks(debouncedQuery);
        },
        enabled: debouncedQuery.length > 2
    });

    // Fetch bestsellers
    const { data: bestsellersData, isLoading: bestsellersLoading } = useQuery<Book[]>({
        queryKey: ['bestsellers'],
        queryFn: async () => {
            // In a real app, you'd call an API for bestsellers
            return await booksService.searchBooks('bestseller 2023');
        },
    });

    // Fetch trending books
    const { data: trendingData, isLoading: trendingLoading } = useQuery<Book[]>({
        queryKey: ['trending'],
        queryFn: async () => {
            // In a real app, you'd call an API for trending books
            return await booksService.searchBooks('trending fiction');
        },
    });

    useEffect(() => {
        if (data) {
            setBooks(data);
        }
        if (bestsellersData) {
            setBestsellers(bestsellersData.slice(0, 10));
        }
        if (trendingData) {
            setTrendingBooks(trendingData.slice(0, 10));
        }
    }, [data, bestsellersData, trendingData]);

  return (
    <View className='flex-1'>
        <SearchBar onChangeText={setQuery} value={query} placeholder='Search' showBorder={true} />
     <ScrollView className='flex-1 px-4' contentInsetAdjustmentBehavior='automatic'>
       
      

        <View className='flex-1 mt-2'>

         {
            query.length != 0 ? (
                <FlashList 
                    data={isLoading ? skeletonItems : books} 
                    renderItem={isLoading ? skeletonBookItem : BookItem} 
                    estimatedItemSize={120}
                />
            ) : (
                <View className="flex-1 px-4 py-6">
                    <Text className="text-white text-lg font-medium mb-5 px-1">Add to Library</Text>
                    
                    <View className="bg-[#121214] rounded-xl overflow-hidden mb-6">
                        <Link href="/barcode" asChild>
                            <Pressable className="active:bg-[#1c1c1e]">
                                <View className="p-3.5 border-b border-white/[0.03]">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center">
                                            <Icon name="barcode-outline" size={22} color="#3b82f6" type="ionicons" />
                                            <Text className="text-white/90 text-base font-medium ml-3.5">Scan Barcode</Text>
                                        </View>
                                        <Icon name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" type="ionicons" />
                                    </View>
                                    <Text className="text-white/50 text-xs ml-8 mr-6">
                                        Quickly add books by scanning ISBN barcodes
                                    </Text>
                                </View>
                            </Pressable>
                        </Link>
                        
                        <Link href={`/${-1}/edit`} asChild>
                            <Pressable className="active:bg-[#1c1c1e]">
                                <View className="p-3.5">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center">
                                            <Icon name="create-outline" size={22} color="#a855f7" type="ionicons" />
                                            <Text className="text-white/90 text-base font-medium ml-3.5">Manual Entry</Text>
                                        </View>
                                        <Icon name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" type="ionicons" />
                                    </View>
                                    <Text className="text-white/50 text-xs ml-8 mr-6">
                                        Create custom entries for books not in our database
                                    </Text>
                                </View>
                            </Pressable>
                        </Link>
                    </View>
                    
                    <Text className="text-white text-lg font-medium mb-5 px-1">Discover Books</Text>
                    
                    <View className="bg-[#121214] rounded-xl overflow-hidden mb-6">
                        <Link href="/ai-suggestions" asChild>
                            <Pressable className="active:bg-[#1c1c1e]">
                                <View className="p-3.5 border-b border-white/[0.03]">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center">
                                            <Icon name="bulb-outline" size={22} color="#f59e0b" type="ionicons" />
                                            <Text className="text-white/90 text-base font-medium ml-3.5">AI Suggestions</Text>
                                        </View>
                                        <Icon name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" type="ionicons" />
                                    </View>
                                    <Text className="text-white/50 text-xs ml-8 mr-6">
                                        Get personalized book recommendations based on your tastes
                                    </Text>
                                </View>
                            </Pressable>
                        </Link>
                        
                        <Link href="/trending" asChild>
                            <Pressable className="active:bg-[#1c1c1e]">
                                <View className="p-3.5">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <View className="flex-row items-center">
                                            <Icon name="trending-up" size={22} color="#10b981" type="ionicons" />
                                            <Text className="text-white/90 text-base font-medium ml-3.5">Browse Categories</Text>
                                        </View>
                                        <Icon name="chevron-forward" size={18} color="rgba(255,255,255,0.2)" type="ionicons" />
                                    </View>
                                    <Text className="text-white/50 text-xs ml-8 mr-6">
                                        Explore popular genres and reading categories
                                    </Text>
                                </View>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            )
        }
        
        {/* Bestsellers Section */}
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4 px-4">
                <Text className="text-white text-lg font-medium">Bestsellers</Text>
                <Pressable onPress={() => router.push('/bestsellers')}>
                    <Text className="text-blue-500">See All</Text>
                </Pressable>
            </View>
            
            {bestsellersLoading ? (
                <View className="px-4 flex-row">
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} className="mr-5 w-28">
                            <View className="w-28 h-42 bg-white/10 rounded-lg" />
                            <View className="h-3 w-24 bg-white/10 rounded mt-2" />
                            <View className="h-2 w-20 bg-white/10 rounded mt-1" />
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={bestsellers}
                    renderItem={({ item }) => (
                        <HorizontalBookCard 
                            book={item} 
                            onPress={() => router.push(`/(add)/${item.id}`)} 
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
                    ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                    decelerationRate="fast"
                    snapToInterval={128} // width of item (112) + margin (16)
                />
            )}
        </View>
        
        {/* Trending Books Section */}
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4 px-4">
                <Text className="text-white text-lg font-medium">Trending Now</Text>
                <Pressable onPress={() => router.push('/trending')}>
                    <Text className="text-blue-500">See All</Text>
                </Pressable>
            </View>
            
            {trendingLoading ? (
                <View className="px-4 flex-row">
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} className="mr-4 w-28">
                            <View className="w-28 h-40 bg-white/10 rounded-lg" />
                            <View className="h-3 w-20 bg-white/10 rounded mt-2" />
                            <View className="h-2 w-16 bg-white/10 rounded mt-1" />
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={trendingBooks}
                    renderItem={({ item }) => (
                        <HorizontalBookCard 
                            book={item} 
                            onPress={() => router.push(`/(add)/${item.id}`)} 
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 16 }}
                />
            )}
        </View>
        
        </View>
        
        


    </ScrollView>
    </View>
   
  )
}

