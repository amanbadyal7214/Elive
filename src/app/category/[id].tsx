import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Menu, Search, Sun, Bookmark, Clock, ArrowDown, Activity, SlidersHorizontal } from 'lucide-react-native';
import { Headline, Label } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { BottomNav } from '../../components/home/BottomNav';

const categoryArticles = [
  {
    id: 101,
    category: 'TECH NEWS',
    badgeVariant: 'blue',
    title: 'The 2025 AI Engineer Roadmap: Essential Skills...',
    excerpt: 'Why high-throughput vector indexing, GPU memory optimization, and evals...',
    author: 'Devon Vance',
    date: 'May 18, 2025',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80',
  },
  {
    id: 102,
    category: 'SOFT SKILLS',
    badgeVariant: 'green',
    title: 'Mastering Executive Presence in Remote Workplaces',
    excerpt: 'High-impact asynchronous memos, nuanced cadence control during cross...',
    author: 'Camille Girard',
    date: 'May 16, 2025',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },
  {
    id: 103,
    category: 'IT SKILLS',
    badgeVariant: 'pink',
    title: 'Full-Stack Rust in Production: What Teams Ne...',
    excerpt: 'From Leptos hydration speeds to cloud container footprints: real architectural...',
    author: 'Nikolai Soren',
    date: 'May 14, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
  },
  {
    id: 104,
    category: 'NEW TRENDS',
    badgeVariant: 'blue',
    title: 'Why Micro-Certifications Are Overtaking Traditional...',
    excerpt: 'Data on credential velocity shows industry sprint badges now command...',
    author: 'Alisha Chen',
    date: 'May 12, 2025',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
  },
];

const subFilters = ['All', 'New Trends', 'Tech News', 'IT Skills', 'Soft Skills'];

import { Header } from '../../components/home/Header';

export default function CategoryDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeSub, setActiveSub] = useState('All');
  const [activeSort, setActiveSort] = useState('Latest');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView className="flex-1 bg-[#F8F9FA]" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 bg-white">
          {/* Category Header Area */}
          <View className="flex-row items-center mb-3">
            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            <Label className="text-[10px] text-primary font-bold uppercase tracking-widest">Deep Dive Track</Label>
          </View>
          
          <Headline className="text-4xl mb-4 text-gray-900 font-serif">Career & Skills</Headline>
          
          <Label className="text-sm text-gray-600 leading-relaxed mb-6 font-serif">
            Actionable guides, emerging tech insights, and workplace strategies for modern professionals navigating the intelligent era.
          </Label>

          {/* Briefing Widget */}
          <View className="bg-blue-50 flex-row items-center justify-between p-4 rounded-2xl border border-blue-100 mb-6">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 bg-blue-200/50 rounded-full items-center justify-center mr-3">
                <Activity size={20} color="#2563EB" />
              </View>
              <View>
                <Headline className="text-sm">Weekly Briefing Ready</Headline>
                <Label className="text-[11px] text-gray-500 mt-0.5">48 curated guides • updated 2h ago</Label>
              </View>
            </View>
            <TouchableOpacity className="bg-[#8B0000] px-4 py-2 rounded-full">
              <Label className="text-white text-xs font-bold">Follow Track</Label>
            </TouchableOpacity>
          </View>

          {/* Sub-filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
            {subFilters.map((filter, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setActiveSub(filter)}
                className={`px-4 py-2 rounded-full mr-2 ${activeSub === filter ? 'bg-[#8B0000]' : 'bg-blue-100'}`}
              >
                <Label className={`text-xs font-bold ${activeSub === filter ? 'text-white' : 'text-blue-600'}`}>{filter}</Label>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sorting Toolbar */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row bg-gray-50 p-1 rounded-xl border border-gray-100">
              <TouchableOpacity 
                onPress={() => setActiveSort('Latest')}
                className={`px-4 py-1.5 rounded-lg ${activeSort === 'Latest' ? 'bg-white shadow-sm' : ''}`}
              >
                <Label className={`text-xs font-bold ${activeSort === 'Latest' ? 'text-gray-900' : 'text-gray-500'}`}>Latest</Label>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setActiveSort('Most Read')}
                className={`px-4 py-1.5 rounded-lg ${activeSort === 'Most Read' ? 'bg-white shadow-sm' : ''}`}
              >
                <Label className={`text-xs font-bold ${activeSort === 'Most Read' ? 'text-gray-900' : 'text-gray-500'}`}>Most Read</Label>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <SlidersHorizontal size={14} color="#6B7280" className="mr-2" />
              <Label className="text-xs text-gray-600 font-bold">Filter</Label>
            </View>
            <Label className="text-[11px] text-gray-500">4 Stories</Label>
          </View>
        </View>

        {/* Article List */}
        <View className="px-4 py-4 gap-y-4 bg-[#F8F9FA]">
          {categoryArticles.map((article) => (
            <TouchableOpacity 
              key={article.id} 
              activeOpacity={0.8}
              onPress={() => router.push(`/article/${article.id}`)}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
            >
              <View className="flex-row justify-between items-start mb-2">
                <Badge label={article.category} variant={article.badgeVariant as any} className="rounded-md" />
                <TouchableOpacity>
                  <Bookmark size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <View className="flex-row justify-between">
                <View className="flex-1 pr-4 justify-between">
                  <Headline className="text-[17px] leading-snug mb-1 text-gray-900" numberOfLines={2}>
                    {article.title}
                  </Headline>
                  <Label className="text-xs text-gray-500 leading-relaxed mb-3" numberOfLines={2}>
                    {article.excerpt}
                  </Label>
                  
                  <View className="flex-row items-center">
                    <Label className="text-xs text-gray-700 font-medium">{article.author}</Label>
                    <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                    <Label className="text-[11px] text-gray-500">{article.date}</Label>
                    <View className="flex-1" />
                    <View className="flex-row items-center">
                      <Clock size={12} color="#C9182B" className="mr-1" />
                      <Label className="text-[11px] font-bold text-[#C9182B]">{article.readTime}</Label>
                    </View>
                  </View>
                </View>
                
                <Image
                  source={{ uri: article.image }}
                  className="w-24 h-24 rounded-xl bg-gray-100"
                />
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Pagination */}
          <View className="items-center py-6">
            <View className="bg-gray-100 rounded-full px-4 py-2 flex-row items-center mb-6">
              <Activity size={14} color="#C9182B" className="mr-2" />
              <Label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Loading More Articles...</Label>
            </View>
            <TouchableOpacity className="bg-gray-100 w-full py-4 rounded-xl flex-row justify-center items-center">
              <Label className="text-sm font-bold text-gray-700 mr-2">Load 10 More Articles</Label>
              <ArrowDown size={16} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Padding for Bottom Nav */}
        <View className="h-24" />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
