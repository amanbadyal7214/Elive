import React from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThumbsUp, ThumbsDown, MessageCircle, Clock } from 'lucide-react-native';
import { Headline, Label } from '../ui/Typography';
import { Badge } from '../ui/Badge';

const updates = [
  {
    id: 1,
    category: 'CURRENT AFFAIRS',
    title: 'Global Climate Summit Finalizes Landmark Clean Grid Framework',
    time: '12m ago',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80',
  },
  {
    id: 2,
    category: 'CAREER & SKILLS',
    title: 'Next-Gen AI Protocols Rewrite the Rules for Modern Tech',
    time: '45m ago',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
  },
];

export function BreakingUpdates() {
  const router = useRouter();

  return (
    <View className="py-4 bg-white">
      <View className="px-4 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Headline className="text-lg">Breaking Updates</Headline>
        </View>
        <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Desk</Label>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {updates.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            className="w-72 bg-white rounded-2xl border border-gray-100 overflow-hidden m-1" 
            style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            activeOpacity={0.9}
            onPress={() => router.push(`/article/${item.id}`)}
          >
            <View className="h-40 relative">
              <ImageBackground
                source={{ uri: item.image }}
                className="flex-1 p-3 justify-between"
              >
                <View className="items-start">
                  <Badge label={item.category} variant="primary" />
                </View>
                <View className="items-end">
                  <View className="bg-black/70 px-2.5 py-1 rounded-full">
                    <Label className="text-[10px] text-white font-bold tracking-wide">{item.time}</Label>
                  </View>
                </View>
              </ImageBackground>
            </View>
            
            <View className="p-4">
              <Headline className="text-lg mb-3 leading-snug" numberOfLines={2}>
                {item.title}
              </Headline>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Clock size={14} color="#6B7280" />
                  <Label className="text-xs text-gray-500 ml-1.5">{item.readTime}</Label>
                </View>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity>
                    <ThumbsUp size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <ThumbsDown size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <MessageCircle size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
