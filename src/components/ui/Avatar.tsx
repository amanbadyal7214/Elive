import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import { cn, Label } from './Typography';

interface AvatarProps extends Omit<ImageProps, 'source'> {
  src?: string;
  fallback?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, fallback, size = 40, className, ...props }: AvatarProps) {
  return (
    <View
      className={cn('rounded-full overflow-hidden bg-gray-200 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          source={{ uri: src }}
          style={{ width: '100%', height: '100%' }}
          {...props}
        />
      ) : (
        <Label className="text-gray-500 font-bold" style={{ fontSize: size * 0.4 }}>
          {fallback || '?'}
        </Label>
      )}
    </View>
  );
}
