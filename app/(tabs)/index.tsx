import { ScrollView, Text, TouchableOpacity, View, Pressable } from "react-native";
import { Icon } from '@/components/Icon';
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { booksService } from "@/services/booksService";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/lib/db";
import { books } from "@/db/schema";
import { count } from "drizzle-orm";
import { useState, useMemo } from "react";
import Collapsible from "@/components/Collapsible";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReadingBook from "@/components/ReadingBook";
import { usePostHog } from "posthog-react-native";

const formatItems = [
  {
    icon:'book-open-page-variant',
    title: 'Paperback',
    href: '/library',
    type: 'materialCommunity'
  },
  {
    icon:'book-variant-multiple',
    title: 'Hardcover',
    href: '/library',
    type: 'materialCommunity'
  },
  {
    icon:'phone-portrait',
    title: 'eBook',
    href: '/library',
    type: 'ionicons'
  },
]

const ownershipItems = [
  {
    icon:'cart',
    title: 'Owned',
    href: '/collection',
    type: 'ionicons'
  },
  {
    icon:'lock-closed',
    title: 'Not Owned',
    href: '/category',
    type: 'ionicons'
  },
  {
    icon:'time',
    title: 'Borrowed',
    href: '/collection',
    type: 'ionicons'
  }
]
const libraryItems = [
  {
    icon:'library',
    title: 'Library',
    href: '/library',
    type: 'ionicons'
  },
  {
    icon:'book-clock',
    title: 'Reading',
    href: '/collection',
    type: 'materialCommunity'
  },
  {
    icon:'checkmark-done',
    title: 'Finished',
    href: '/category',
    type: 'ionicons'
  },
  {
    icon:'close',
    title: 'Cancelled',
    href: '/author',
    type: 'ionicons'
  },
]

export default  function Index() {
  const queryClient = useQueryClient();
  
  const { data: countOfFilters = {
    libraryCount: 0,
    readingCount: 0,
    finishedCount: 0,
    paperbackCount: 0,
    hardcoverCount: 0,
    ebookCount: 0,
    cancelledCount: 0,
    ownedCount: 0,
    notOwnedCount: 0,
    borrowedCount: 0
  }} = useQuery({
    queryKey: ['countOfFilters'],
    queryFn: async () => {
      return await booksService.getCountOfFilters();
    }
  });
  
  // Create the data arrays with count values from the query
  const formatItems = useMemo(() => [
    {
      icon: 'book-open-page-variant',
      title: 'Paperback',
      href: '/library',
      type: 'materialCommunity',
      count: countOfFilters.paperbackCount
    },
    {
      icon: 'book-variant-multiple',
      title: 'Hardcover',
      href: '/library',
      type: 'materialCommunity',
      count: countOfFilters.hardcoverCount
    },
    {
      icon: 'phone-portrait',
      title: 'eBook',
      href: '/library',
      type: 'ionicons',
      count: countOfFilters.ebookCount
    },
  ], [countOfFilters]);
  
  const libraryItems = useMemo(() => [
    {
      icon: 'library',
      title: 'Library',
      href: '/library',
      type: 'ionicons',
      count: countOfFilters.libraryCount
    },
    {
      icon: 'book-clock',
      title: 'Reading',
      href: '/collection',
      type: 'materialCommunity',
      count: countOfFilters.readingCount
    },
    {
      icon: 'checkmark-done',
      title: 'Finished',
      href: '/category',
      type: 'ionicons',
      count: countOfFilters.finishedCount
    },
    {
      icon: 'close',
      title: 'Cancelled',
      href: '/author',
      type: 'ionicons',
      count: countOfFilters.cancelledCount
    },
  ], [countOfFilters]);

  const ownershipItems = useMemo(() => [
    {
      icon:'cart',
      title: 'Owned',
      href: '/collection',
      type: 'ionicons',
      count: countOfFilters.ownedCount
    },
    {
      icon:'lock-closed',
      title: 'Not Owned',
      href: '/category',
      type: 'ionicons',
      count: countOfFilters.notOwnedCount
    },
    {
      icon:'time',
      title: 'Borrowed',
      href: '/collection',
      type: 'ionicons',
      count: countOfFilters.borrowedCount
    }
  ], [countOfFilters]);

  // Other ownership items can be handled similarly
  
  return (
    <View className="flex-1 bg-black">
     
       <ScrollView className="flex-1 bg-black">
       
       <View className="flex-1 gap-8 mt-8  px-4">
       <ReadingBook />
     <Collapsible title="Bookshelf" data={libraryItems}/>
     <Collapsible title="Formats" data={formatItems}/>
     <Collapsible title="Ownership" data={ownershipItems}/>

     
    </View>
      <View className="mt-28"/>
    </ScrollView>
   
    </View>
   

  );
   
}
