import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { cn } from './Typography';

interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({
  className,
  containerClassName,
  icon = <Search size={20} color="#9CA3AF" />, // Default to search icon if none provided but requested
  ...props
}: InputProps) {
  return (
    <View
      className={cn(
        'flex-row items-center h-12 bg-gray-100 rounded-lg px-4 border border-gray-200 focus:border-primary',
        containerClassName
      )}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <TextInput
        className={cn(
          'flex-1 text-base font-body text-neutral-900',
          className
        )}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
}
