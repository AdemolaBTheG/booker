import { View, Text } from 'react-native'
import React, { useState } from 'react'
import * as DropdownMenu from 'zeego/dropdown-menu'
import { Icon } from './Icon'

export type NativeDropDownProps = {
  items:Array<{
    key: string,
    title: string,
    icon?:string,
    iconAndroid?:string,
  }>
  onSelect: (value: string) => void,

  type: 'stats' | 'edit' | 'filter' | 'add'
}

export default function NativeDropDown({ items, onSelect,type }: NativeDropDownProps) {

  const [selectedItem, setSelectedItem] = useState<NativeDropDownProps['items'][number]  | null>(type === 'edit' ? null : items[0])
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <View className=' flex-row items-center gap-2 '>
        
        
          {type === 'edit' ? (
            <>
              <Text className='text-white text-base font-medium'>{selectedItem?.title || 'Not selected'} </Text>
          <Icon name="chevron-expand" size={24} color="white" type="ionicons" />
            </>
          ) : type === 'filter' ? (
            <Icon name="swap-vert" size={24} color="white" type="material" />
          ) :  type === 'stats' ? (
            <View className='flex-row items-center gap-2 border border-white/20 rounded-2xl px-3 py-2'>
            <Text className='text-white text-base font-medium'>{selectedItem?.title || 'Not selected'}</Text>
            <Icon name="chevron-down" size={24} color="white" type="ionicons" />
            </View>
          ) : type === 'add' ? (
            <>
            <Icon name="add-circle" className='mr-4' size={32} color="#513EC7" type="material" />
            </>
          ) : (
            <></>
          )}
            

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
                name:item.icon ,
                size:24,
                color:'white'
              }
            }
             >

            </DropdownMenu.ItemIcon>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Group>
      </DropdownMenu.Content>
   
    </DropdownMenu.Root>
  )
}