import { ComponentProps } from 'react';
import Ionicons from '@expo/vector-icons/MaterialIcons';

type IconProps = {
  name: ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color?: string;
  className?: string;
};

export function Icon({ name, size = 24, color = 'white', className }: IconProps) {
  return (
    <Ionicons 
      name={name} 
      size={size} 
      color={color} 
      className={className}
    />
  );
} 