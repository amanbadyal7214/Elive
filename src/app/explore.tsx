import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, X, Clock, Flame, TrendingUp, Hash } from 'lucide-react-native';
import { Headline, Label } from '../components/ui/Typography';
import { Badge } from '../components/ui/Badge';
import { Header } from '../components/home/Header';
import { BottomNav } from '../components/home/BottomNav';

const filters = [
  { id: 'all', label: 'All', color: '#FFFFFF', bg: '#C9182B' },
  { id: 'career', label: 'Career & Skills', color: '#4F46E5', bg: '#E0E7FF' },
  { id: 'current', label: 'Current Affairs', color: '#C9182B', bg: '#FEE2E2' },
  { id: 'entertainment', label: 'Entertainment', color: '#9CA3AF', bg: '#F3F4F6' },
];

const recentSearches = [
  'Remote leadership practices',
  'Renewable grid breakthroughs',
  'Mindful technology habits'
];

const trendingTags = [
  { label: 'GenerativeAI', icon: TrendingUp, bg: '#F3F4F6' },
  { label: 'GlobalEconomy', bg: '#F3F4F6' },
  { label: 'FilmFestivals', bg: '#F3F4F6' },
  { label: 'SlowLiving', bg: '#F3F4F6' },
  { label: 'MeditationDaily', bg: '#F3F4F6' },
  { label: 'QuantumComputing', bg: '#F3F4F6' },
];

const editorsPicks = [
  {
    id: 105,
    category: 'CAREER & SKILLS',
    badgeVariant: 'blue',
    readTime: '6 min read',
    title: 'The Architecture of Asynchronous Decision-Makin...',
    author: 'Marcus Vance',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
  },
  {
    id: 106,
    category: 'CURRENT AFFAIRS',
    badgeVariant: 'red',
    readTime: '4 min read',
    title: 'Decarbonizing High Seas: How Marine Wind Kites Are...',
    author: 'Elena Rostova',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
  },
  {
    id: 107,
    category: 'SPIRITUAL',
    badgeVariant: 'green',
    readTime: '8 min read',
    title: 'Silence as Counter-Culture: Reclaiming Sacred Solitude in...',
    author: 'Julian Chen',
    image: 'https://images.unsplash.com/photo-1444464666168-49b626428bc5?w=400&q=80',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full border border-gray-200">
            <Search size={20} color="#6B7280" className="mr-3" />
            <TextInput 
              className="flex-1 text-sm text-gray-900 font-sans"
              placeholder="Search articles, topics, authors..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              <X size={18} color="#6B7280" />
            )}
          </View>
        </View>

        {/* Explore By Desk */}
        <View className="py-5 border-b border-gray-100 bg-white">
          <View className="px-4 flex-row items-center justify-between mb-3">
            <Label className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Explore By Desk</Label>
            <TouchableOpacity>
              <Label className="text-[10px] font-bold text-[#C9182B] uppercase tracking-widest">All Filters</Label>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {filters.map((filter, index) => (
              <TouchableOpacity 
                key={index}
                className={`flex-row items-center px-4 py-2 rounded-full mr-3 border border-gray-200`}
                style={{ backgroundColor: filter.bg }}
              >
                {filter.id !== 'all' && (
                  <View className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: filter.color }} />
                )}
                <Label className={`text-xs font-bold ${filter.id === 'all' ? 'text-white' : 'text-gray-700'}`}>
                  {filter.label}
                </Label>
              </TouchableOpacity>
            ))}
            <View className="w-4" />
          </ScrollView>
        </View>

        <View className="bg-[#F8F9FA] px-4 py-6">
          {/* Recent Searches */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Clock size={14} color="#C9182B" className="mr-2" />
                <Label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Recent Searches</Label>
              </View>
              <TouchableOpacity>
                <Label className="text-[10px] font-bold text-[#C9182B] uppercase tracking-widest">Clear History</Label>
              </TouchableOpacity>
            </View>

            <View className="bg-white rounded-2xl p-2 border border-gray-100 shadow-sm" style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}>
              {recentSearches.map((search, index) => (
                <View key={index} className={`flex-row items-center justify-between px-3 py-4 ${index !== recentSearches.length - 1 ? 'border-b border-gray-50' : ''}`}>
                  <View className="flex-row items-center">
                    <Clock size={16} color="#6B7280" className="mr-3" />
                    <Label className="text-sm text-gray-700">{search}</Label>
                  </View>
                  <TouchableOpacity>
                    <X size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Trending Right Now */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Flame size={14} color="#C9182B" className="mr-2" />
              <Label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Trending Right Now</Label>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {trendingTags.map((tag, index) => (
                <TouchableOpacity 
                  key={index}
                  className="flex-row items-center px-4 py-2 rounded-xl bg-gray-100 border border-gray-200"
                >
                  <Hash size={12} color="#C9182B" className="mr-1" />
                  <Label className="text-sm font-medium text-gray-800">{tag.label}</Label>
                  {tag.icon && <tag.icon size={14} color="#C9182B" className="ml-2" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Editor's Selection */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Label className="text-[10px] font-bold text-[#C9182B] uppercase tracking-widest">Editor's Selection</Label>
              <TouchableOpacity>
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">View All</Label>
              </TouchableOpacity>
            </View>
            <Headline className="text-2xl mb-6 font-serif">Top Recommended For You</Headline>

            <View className="gap-y-6">
              {editorsPicks.map((article) => (
                <TouchableOpacity 
                  key={article.id}
                  onPress={() => router.push(`/article/${article.id}`)}
                  activeOpacity={0.8}
                  className="flex-row justify-between pb-6 border-b border-gray-100"
                >
                  <View className="flex-1 pr-4">
                    <View className="flex-row items-center mb-2 gap-2">
                      <Badge label={article.category} variant={article.badgeVariant as any} className="rounded-md" />
                      <Label className="text-[11px] text-gray-500">{article.readTime}</Label>
                    </View>
                    <Headline className="text-lg leading-tight mb-2 text-gray-900" numberOfLines={2}>
                      {article.title}
                    </Headline>
                    <Label className="text-[11px] text-gray-500">By {article.author}</Label>
                  </View>
                  <Image
                    source={{ uri: article.image }}
                    className="w-24 h-24 rounded-xl bg-gray-200"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
        </View>
        {/* Padding for Bottom Nav */}
        <View className="h-24 bg-[#F8F9FA]" />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
