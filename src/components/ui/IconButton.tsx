import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './Typography';

const iconButtonVariants = cva(
  'items-center justify-center rounded-full',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        tertiary: 'bg-tertiary',
        destructive: 'bg-red-600', // Assuming a distinct red for delete/destructive actions
      },
      size: {
        default: 'h-10 w-10',
        sm: 'h-8 w-8',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

interface IconButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof iconButtonVariants> {
  icon: React.ReactNode;
}

export function IconButton({
  className,
  variant,
  size,
  icon,
  ...props
}: IconButtonProps) {
  return (
    <TouchableOpacity
      className={cn(iconButtonVariants({ variant, size, className }))}
      activeOpacity={0.8}
      {...props}
    >
      {icon}
    </TouchableOpacity>
  );
}
