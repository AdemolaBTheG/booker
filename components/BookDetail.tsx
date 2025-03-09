import { View, Text } from 'react-native'
import React from 'react'
import { Book } from '@/lib/types';
import { Icon } from './Icon';

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
  
  export default function  BookDetail({ book }: { book: Book }) {
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