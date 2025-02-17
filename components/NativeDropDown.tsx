import { View, Text } from 'react-native'
import React from 'react'
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
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Icon name="chevron-expand" size={24} color="rgba(255, 255, 255, 0.2)" type="ionicons" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
    

      <DropdownMenu.Item key="20">
        <DropdownMenu.ItemTitle>
          Not selected
        </DropdownMenu.ItemTitle>
      </DropdownMenu.Item>
      </DropdownMenu.Content>
   
    </DropdownMenu.Root>
  )
}