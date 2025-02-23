import { ScrollView, Text, TouchableOpacity, View, Pressable } from "react-native";
import { Icon } from '@/components/Icon';
import { FlashList } from "@shopify/flash-list";
import { Link, router } from "expo-router";
import { booksService } from "@/services/booksService";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/lib/db";
import { books } from "@/db/schema";
import { count } from "drizzle-orm";
const items = [

  {

    icon:'book',
    title: 'Library',
    href: '/library'
  },
  {

    icon:'collections',
    title: 'Collection',
    href: '/collection'
  },
  {

    icon:'category',
    title: 'Category',
    href: '/category'
  },
  {

    icon:'person',
    title: 'Author',
    href: '/author'
  },
  {

    icon:'house',
    title: 'Publisher',
    href: '/publisher'
  },
  



]


export default  function Index() {

  const {data} = useLiveQuery(db.select({ count: count() }).from(books));
  console.log(data);

  return (
    <ScrollView className="flex-1 bg-black">
       <View className="flex-1  px-4">
      <Text className="text-white text-4xl font-semibold mt-5">Booker</Text>
      <View className="rounded-lg bg-white/15 px-2 py-3 mt-10 gap-3 border border-white/20 flex items-center justify-center">
        <Text className="text-white/40  text-base text-center">Add Your First Book & Transform Your Reading Journey - Start Tracking Today!</Text>
        <TouchableOpacity onPress={() => router.push('/(add)')} className="bg-cta rounded-lg px-4 py-2 mt-2 flex-row items-center">
          <Icon name="add" size={20} type="material" />
          <Text  className="text-white font-semibold ml-1">Add Your First Book</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-6">
        <Text className="text-white text-xl font-semibold">Bookshelf</Text>
        <View className="flex-col mt-4 gap-3">
          {items.map((item) => (
            <Link href='/index' key={item.title} asChild>
              <Pressable className="flex-row items-center justify-between border border-white/20  bg-white/15 px-2 py-3 rounded-lg active:opacity-70"> 
                <View className="flex-row items-center gap-3">
                  <Icon name={item.icon as any} size={24} color="white" type="material" />
                  <Text className="text-white text-base font-semibold">{item.title}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-white/20 text-base font-semibold">{data?.[0]?.count}</Text>
                <Icon 
                  name="chevron-right" 
                  size={24} 
                  color="rgba(255, 255, 255, 0.2)"
                  type="material"
                />
                </View>
               
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
    </ScrollView>

  );
   
}
