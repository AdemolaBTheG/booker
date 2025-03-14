import { ComponentProps } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleProp } from 'react-native';
import { ViewStyle } from 'react-native';



type IconProps = {
  type: 'material' | 'ionicons';
  name: ComponentProps<typeof MaterialIcons>['name'] | ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
};


export function Icon({ name, size = 24, color = 'white', className,type,style }: IconProps) {
  return (
    type === 'material' ? (
      <MaterialIcons 
        name={name as any} 
        size={size} 
        color={color} 
        className={className}
      />
    ) : (
      <Ionicons 
        name={name as any} 
        size={size} 
        color={color} 
        className={className}
      />
    )
  );
} 