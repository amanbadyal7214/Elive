import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { Label } from './Typography';
import { cn } from './Typography'; // Reuse cn from Typography or move to a utils file

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-md px-6 py-3',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-gray-100', // Assuming a light gray for secondary
        inverted: 'bg-neutral-900',
        outlined: 'bg-transparent border border-gray-300',
      },
      size: {
        default: 'h-12',
        sm: 'h-10 px-4',
        lg: 'h-14 px-8',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

const textVariants = cva(
  'text-base font-label font-medium',
  {
    variants: {
      variant: {
        primary: 'text-white',
        secondary: 'text-neutral-900',
        inverted: 'text-white',
        outlined: 'text-neutral-900',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  label: string;
  icon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  label,
  icon,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, className }))}
      activeOpacity={0.8}
      {...props}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Label className={cn(textVariants({ variant }))}>
        {label}
      </Label>
    </TouchableOpacity>
  );
}
