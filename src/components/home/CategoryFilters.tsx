import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Label, cn } from '../ui/Typography';

const categories = [
  'ALL',
  'CAREER & SKILLS',
  'CURRENT AFFAIRS',
  'LIFESTYLE',
  'TECHNOLOGY',
];

export function CategoryFilters() {
  const router = useRouter();
  const [active, setActive] = useState('ALL');

  return (
    <View className="bg-gray-50 py-3 border-b border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => {
              const slug = cat === 'ALL' ? 'all' : cat.toLowerCase().replace(/\s+/g, '-');
              setActive(cat);
              router.push(`/category/${slug}`);
            }}
            className={cn(
              'px-4 py-2 rounded-full flex-row items-center',
              active === cat ? 'bg-primary' : 'bg-white border border-gray-200'
            )}
          >
            {active !== cat && (
              <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            )}
            <Label
              className={cn(
                'text-xs font-bold tracking-wider',
                active === cat ? 'text-white' : 'text-gray-600'
              )}
            >
              {cat}
            </Label>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
