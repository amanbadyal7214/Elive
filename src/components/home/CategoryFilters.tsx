import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Label, cn } from '../ui/Typography';
import { useCategories } from '../../hooks/useCategories';

export function CategoryFilters() {
  const router = useRouter();
  const { categories, loading } = useCategories();
  const [active, setActive] = useState('ALL');

  // Include 'ALL' as the first option followed by main top-level API categories
  const filterList = [
    { id: 'all' as string | number, name: 'ALL', rawName: 'ALL' },
    ...(categories || []).map((cat) => ({
      id: cat.id as string | number,
      name: cat.name.toUpperCase(),
      rawName: cat.name,
    })),
  ];

  return (
    <View className="bg-gray-50 py-3 border-b border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {loading && categories.length === 0 ? (
          <View className="py-1 px-4 flex-row items-center">
            <ActivityIndicator size="small" color="#002249" />
          </View>
        ) : (
          filterList.map((item) => {
            const isActive = active === item.name;
            return (
              <TouchableOpacity
                key={item.id.toString()}
                onPress={() => {
                  const slug =
                    item.id === 'all'
                      ? 'all'
                      : item.rawName
                      ? item.rawName.toLowerCase().replace(/\s+/g, '-')
                      : item.name.toLowerCase().replace(/\s+/g, '-');
                  setActive(item.name);
                  router.push(`/category/${slug}`);
                }}
                className={cn(
                  'px-4 py-2 rounded-full flex-row items-center',
                  isActive ? 'bg-primary' : 'bg-white border border-gray-200'
                )}
              >
                {!isActive && (
                  <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                )}
                <Label
                  className={cn(
                    'text-xs font-bold tracking-wider',
                    isActive ? 'text-white' : 'text-gray-600'
                  )}
                >
                  {item.name}
                </Label>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

