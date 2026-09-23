import React from 'react';
import { View, ViewProps } from 'react-native';
import { Label, cn } from './Typography';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'px-2 py-1 rounded-full items-center justify-center flex-row',
  {
    variants: {
      variant: {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'bg-transparent border border-gray-200',
        light: 'bg-gray-100',
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        pink: 'bg-pink-100',
        red: 'bg-red-100',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

const textVariants = cva(
  'text-[10px] font-label font-bold uppercase tracking-wider',
  {
    variants: {
      variant: {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-gray-600',
        light: 'text-gray-700',
        blue: 'text-blue-700',
        green: 'text-green-700',
        pink: 'text-pink-700',
        red: 'text-red-700',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  label: string;
  icon?: React.ReactNode;
}

export function Badge({ label, variant, className, icon, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant, className }))} {...props}>
      {icon && <View className="mr-1">{icon}</View>}
      <Label className={cn(textVariants({ variant }))}>{label}</Label>
    </View>
  );
}
