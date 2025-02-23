import { View, Text } from 'react-native'
import React, { useState } from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { Icon } from './Icon'

export type NativeDropDownProps = {
  items:Array<{
    key: string,
    title: string,
    icon:string,
    iconAndroid?:string,
  }>
  onSelect: (value: string) => void
}

export default function NativeDropDown({ items, onSelect }: NativeDropDownProps) {

  const [selectedItem, setSelectedItem] = useState<NativeDropDownProps['items'][number] | null>(null)
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className=' flex-row items-center gap-2 '>
          <Text className='text-white text-base font-medium'>{selectedItem?.title || 'Not selected'}</Text>
          <Icon name="chevron-expand" size={24} color="white" type="ionicons" />

        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
    

      
      <DropdownMenu.Group>
        {items.map((item) => (
          <DropdownMenu.Item  key={item.key} onSelect={() => {onSelect(item.title), setSelectedItem(item)}}>
            <DropdownMenu.ItemTitle>{item.title}</DropdownMenu.ItemTitle>
            <DropdownMenu.ItemIcon 
            ios={
              {
                name:item.icon,
                size:24,
                color:'white'
              }
            }
             androidIconName={item.iconAndroid}>

            </DropdownMenu.ItemIcon>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Group>
      </DropdownMenu.Content>
   
    </DropdownMenu.Root>
  )
}