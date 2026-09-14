import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bookmark, Clock, ArrowDown, Activity, SlidersHorizontal, ArrowLeft, Flame, Radio, Sparkles } from 'lucide-react-native';
import { Headline, Label } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Header } from '../../components/home/Header';
import { BottomNav } from '../../components/home/BottomNav';

interface SectionConfig {
  title: string;
  tag: string;
  description: string;
  icon?: any;
  subFilters: string[];
  articles: Array<{
    id: number | string;
    category: string;
    badgeVariant: 'blue' | 'red' | 'green' | 'pink' | 'primary' | 'secondary';
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
  }>;
}

const SECTION_DATA: Record<string, SectionConfig> = {
  'live-desk': {
    title: 'Live Desk Updates',
    tag: 'Live Dispatch',
    description: 'Real-time breaking updates, urgent briefings, and continuous field reporting from our global newsroom.',
    icon: Radio,
    subFilters: ['All', 'Breaking', 'Policy', 'Tech Alerts', 'Global Economy'],
    articles: [
      {
        id: 1,
        category: 'CURRENT AFFAIRS',
        badgeVariant: 'red',
        title: 'Global Climate Summit Finalizes Landmark Clean Grid Framework',
        excerpt: 'Ministers from 45 nations commit to unified cross-border renewable grid protocols and storage guarantees.',
        author: 'Sarah Jenkins',
        date: '12m ago',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80',
      },
      {
        id: 2,
        category: 'CAREER & SKILLS',
        badgeVariant: 'blue',
        title: 'Next-Gen AI Protocols Rewrite the Rules for Modern Tech Teams',
        excerpt: 'Engineering leads migrate toward localized model inference to eliminate latency and preserve enterprise IP.',
        author: 'Devon Vance',
        date: '45m ago',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      },
      {
        id: 106,
        category: 'CURRENT AFFAIRS',
        badgeVariant: 'red',
        title: 'Decarbonizing High Seas: How Marine Wind Kites Are Scaling',
        excerpt: 'Commercial cargo ships deploy automated high-altitude kites to cut bunker fuel consumption by 35%.',
        author: 'Elena Rostova',
        date: '2h ago',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80',
      },
    ],
  },
  'editors-pick': {
    title: "Editor's Selection",
    tag: 'Featured Picks',
    description: 'Hand-curated investigative longform stories, architectural deep-dives, and profound cultural essays.',
    icon: Flame,
    subFilters: ['All', 'Deep Dives', 'Essays', 'Interviews', 'Special Reports'],
    articles: [
      {
        id: 105,
        category: 'CAREER & SKILLS',
        badgeVariant: 'blue',
        title: 'The Architecture of Asynchronous Decision-Making',
        excerpt: 'How hyper-effective remote organizations replace sync meetings with high-clarity written proposals.',
        author: 'Marcus Vance',
        date: 'May 18, 2025',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
      },
      {
        id: 107,
        category: 'SPIRITUAL',
        badgeVariant: 'green',
        title: 'Silence as Counter-Culture: Reclaiming Sacred Solitude in Tech',
        excerpt: 'In an era of hyper-connected notifications, deliberate silence becomes the ultimate cognitive superpower.',
        author: 'Julian Chen',
        date: 'May 15, 2025',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1444464666168-49b626428bc5?w=600&q=80',
      },
      {
        id: 108,
        category: 'CAREER & SKILLS',
        badgeVariant: 'blue',
        title: 'Modern Engineering Leadership: From IC to VP Strategy',
        excerpt: 'Navigating technical growth trajectories without sacrificing hands-on architectural intuition.',
        author: 'Sophia Martinez',
        date: 'May 10, 2025',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
      },
    ],
  },
  'new-articles': {
    title: 'New Articles Feed',
    tag: 'Fresh Off The Press',
    description: 'Explore all the latest published pieces across tech, lifestyle, acoustic design, and culture.',
    icon: Sparkles,
    subFilters: ['All', 'Entertainment', 'Spiritual', 'Lifestyle', 'Tech'],
    articles: [
      {
        id: 201,
        category: 'ENTERTAINMENT',
        badgeVariant: 'blue',
        title: 'The Renaissance of Acoustic Architecture in Live Performance',
        excerpt: 'Architects embrace natural reverberation chambers to redefine digital soundscapes in modern concert halls.',
        author: 'Clara Oswald',
        date: 'Oct 24',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1540839045362-a56c2719cb61?w=600&q=80',
      },
      {
        id: 202,
        category: 'SPIRITUAL',
        badgeVariant: 'green',
        title: 'Chronos vs. Kairos: Reclaiming the Soul of Solitude',
        excerpt: 'Moving from clock-driven productivity to opportunistic depth in daily creative rituals.',
        author: 'Dr. Aaron Paul',
        date: 'Oct 23',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1606707764516-7c70560fbd95?w=600&q=80',
      },
      {
        id: 203,
        category: 'LIFESTYLE',
        badgeVariant: 'pink',
        title: 'Craft Economies: Why Gen Z is Choosing Craft Studios',
        excerpt: 'Tactile creation and physical assembly emerge as counter-narratives to algorithmic feeds.',
        author: 'Maya Lin',
        date: 'Oct 22',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=600&q=80',
      },
    ],
  },
  'popular-blogs': {
    title: 'Community Voices',
    tag: 'Popular Blogs',
    description: 'Dispatches, opinion pieces, and guest columns written by leaders, founders, and creative practitioners.',
    subFilters: ['All', 'UX Design', 'Macro Strategy', 'Energy Grids', 'Philosophy'],
    articles: [
      {
        id: 301,
        category: 'UX DESIGN',
        badgeVariant: 'blue',
        title: 'Why Frictionless UX Might Be Dumbing Down Our Collective Memory',
        excerpt: 'When we eliminate every obstacle in digital journeys, we inadvertently strip away active cognitive retention.',
        author: 'Ananya Roy',
        date: 'May 19, 2025',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
      },
      {
        id: 302,
        category: 'ENERGY GRIDS',
        badgeVariant: 'pink',
        title: 'Decentralized Energy Grids: A Dispatch from the Edge',
        excerpt: 'How a valley community bypassed regional utilities to build a self-sustaining microgrid network.',
        author: 'Marcus Chen',
        date: 'May 17, 2025',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
      },
    ],
  },
};

const DEFAULT_SECTION: SectionConfig = {
  title: 'Career & Skills Track',
  tag: 'Deep Dive Track',
  description: 'Actionable guides, emerging tech insights, and workplace strategies for modern professionals navigating the intelligent era.',
  subFilters: ['All', 'New Trends', 'Tech News', 'IT Skills', 'Soft Skills'],
  articles: [
    {
      id: 101,
      category: 'TECH NEWS',
      badgeVariant: 'blue',
      title: 'The 2025 AI Engineer Roadmap: Essential Skills & System Models',
      excerpt: 'Why high-throughput vector indexing, GPU memory optimization, and evals are essential for senior devs.',
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
      excerpt: 'High-impact asynchronous memos, nuanced cadence control during cross-functional alignment.',
      author: 'Camille Girard',
      date: 'May 16, 2025',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    },
    {
      id: 103,
      category: 'IT SKILLS',
      badgeVariant: 'pink',
      title: 'Full-Stack Rust in Production: What Teams Need to Know',
      excerpt: 'From Leptos hydration speeds to cloud container footprints: real architectural benchmarks.',
      author: 'Nikolai Soren',
      date: 'May 14, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    },
    {
      id: 104,
      category: 'NEW TRENDS',
      badgeVariant: 'blue',
      title: 'Why Micro-Certifications Are Overtaking Traditional Degrees',
      excerpt: 'Data on credential velocity shows industry sprint badges now command higher hiring priority.',
      author: 'Alisha Chen',
      date: 'May 12, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    },
  ],
};

export default function CategoryDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeSub, setActiveSub] = useState('All');
  const [activeSort, setActiveSort] = useState('Latest');

  const paramKey = (id || 'career-&-skills').toString().toLowerCase();
  const currentSection = SECTION_DATA[paramKey] || {
    ...DEFAULT_SECTION,
    title: paramKey.replace(/-/g, ' ').toUpperCase(),
  };

  const filteredArticles = currentSection.articles.filter((article) => {
    if (activeSub === 'All') return true;
    return (
      article.category.toLowerCase().includes(activeSub.toLowerCase()) ||
      article.title.toLowerCase().includes(activeSub.toLowerCase())
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView className="flex-1 bg-[#F8F9FA]" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6 bg-white">
          {/* Back button */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="flex-row items-center mb-4 self-start"
          >
            <ArrowLeft size={16} color="#4B5563" className="mr-1.5" />
            <Label className="text-xs font-bold text-gray-600">Back</Label>
          </TouchableOpacity>

          {/* Category Header Area */}
          <View className="flex-row items-center mb-3">
            <View className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
            <Label className="text-[10px] text-primary font-bold uppercase tracking-widest">{currentSection.tag}</Label>
          </View>
          
          <Headline className="text-3xl mb-3 text-gray-900 font-serif">{currentSection.title}</Headline>
          
          <Label className="text-sm text-gray-600 leading-relaxed mb-6 font-serif">
            {currentSection.description}
          </Label>

          {/* Briefing Widget */}
          <View className="bg-blue-50 flex-row items-center justify-between p-4 rounded-2xl border border-blue-100 mb-6">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 bg-blue-200/50 rounded-full items-center justify-center mr-3">
                <Activity size={20} color="#2563EB" />
              </View>
              <View>
                <Headline className="text-sm">Curated Feed Ready</Headline>
                <Label className="text-[11px] text-gray-500 mt-0.5">{currentSection.articles.length} verified guides • updated live</Label>
              </View>
            </View>
            <TouchableOpacity className="bg-[#8B0000] px-4 py-2 rounded-full">
              <Label className="text-white text-xs font-bold">Follow Track</Label>
            </TouchableOpacity>
          </View>

          {/* Sub-filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
            {currentSection.subFilters.map((filter, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => setActiveSub(filter)}
                className={`px-4 py-2 rounded-full mr-2 ${activeSub === filter ? 'bg-[#8B0000]' : 'bg-blue-50 border border-blue-100'}`}
              >
                <Label className={`text-xs font-bold ${activeSub === filter ? 'text-white' : 'text-blue-700'}`}>{filter}</Label>
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
            <Label className="text-[11px] text-gray-500">{filteredArticles.length} Stories</Label>
          </View>
        </View>

        {/* Article List */}
        <View className="px-4 py-4 gap-y-4 bg-[#F8F9FA]">
          {filteredArticles.map((article) => (
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
          
          {/* Load More Button */}
          <View className="items-center py-6">
            <TouchableOpacity className="bg-white border border-gray-200 w-full py-3.5 rounded-xl flex-row justify-center items-center shadow-sm">
              <Label className="text-sm font-bold text-gray-700 mr-2">Load More Stories</Label>
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

