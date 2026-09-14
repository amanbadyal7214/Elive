import { Text, TextProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TypographyProps extends TextProps {
  className?: string;
}

export function Headline({ className, ...props }: TypographyProps) {
  return (
    <Text
      className={cn('font-headline text-4xl text-neutral-900', className)}
      {...props}
    />
  );
}

export function Body({ className, ...props }: TypographyProps) {
  return (
    <Text
      className={cn('font-body text-base text-neutral-900', className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: TypographyProps) {
  return (
    <Text
      className={cn('font-label text-sm text-neutral-900 font-medium', className)}
      {...props}
    />
  );
}
