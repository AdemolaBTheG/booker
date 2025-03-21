import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
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
  selected?: string,
  type: 'stats' | 'edit' | 'filter' | 'add' | 'item'
}

export default function NativeDropDown({ items, onSelect,type, selected }: NativeDropDownProps) {

  const foundItem = items.find(item => item.title === selected)
  console.log(selected)
  console.log( "foundItem", foundItem)
  const [selectedItem, setSelectedItem] = useState<NativeDropDownProps['items'][number] | null>(null)

  useEffect(() => {
    setSelectedItem(selected && foundItem ? foundItem : (items.length > 0 ? items[0] : null))
  }, [selected])


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
            <View className='flex-row items-center gap-2 border border-white/20 rounded-2xl px-3 py-3'>
            <Text className='text-white text-base font-medium'>{selectedItem?.title || 'Not selected'}</Text>
            <Icon name="chevron-down" size={24} color="white" type="ionicons" />
            </View>
          ) : type === 'add' ? (
            <>
            <Icon name="add-circle" className='mr-4' size={32} color="#513EC7" type="material" />
            </>
          ) : type === 'item' ? (
            <>
            <Icon name="ellipsis-horizontal-circle-outline" size={28} color="white" type="ionicons" />
            </>
          ) : (
            <></>
          )}
            

        </View>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
    

      
      <DropdownMenu.Group>
        {items.map((item) => (
          <DropdownMenu.Item  destructive={item.title === 'Delete'} key={item.key} onSelect={() => {onSelect(item.title), setSelectedItem(item)}}>
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