import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Home, Grid, Edit3, Bookmark, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label } from '../ui/Typography';

export function BottomNav() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isHome = pathname === '/' || pathname === '/index';
  const isExplore = pathname === '/explore';
  const isProfile = pathname === '/profile';

  return (
    <View 
      className="flex-row items-center justify-around bg-white pt-2 border-t border-gray-100 px-2" 
      style={[styles.shadow, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}
    >
      
      <TouchableOpacity onPress={() => router.push('/')} className="items-center py-2 flex-1">
        <Home color={isHome ? '#C9182B' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isHome ? 'text-primary' : 'text-gray-400'}`}>Home</Label>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/explore')} className="items-center py-2 flex-1">
        <Grid color={isExplore ? '#C9182B' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isExplore ? 'text-primary' : 'text-gray-400'}`}>Categories</Label>
      </TouchableOpacity>

      {/* Center Action Button */}
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity 
          onPress={() => router.push('/create')}
          activeOpacity={0.9}
          className="bg-primary w-12 h-12 rounded-full items-center justify-center -mt-8 border-4 border-white shadow-md"
        >
          <Edit3 color="white" size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/explore')} className="items-center py-2 flex-1">
        <Bookmark color="#9CA3AF" size={24} />
        <Label className="text-[10px] mt-1 font-bold text-gray-400">Saved</Label>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile')} className="items-center py-2 flex-1">
        <User color={isProfile ? '#C9182B' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isProfile ? 'text-primary' : 'text-gray-400'}`}>Profile</Label>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  }
});
