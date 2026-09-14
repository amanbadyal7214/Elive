import React from 'react';
import { View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AlignLeft, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { Headline, Body, Label } from '../ui/Typography';
import { Avatar } from '../ui/Avatar';

const blogs = [
  {
    id: 1,
    author: 'Ananya Roy',
    role: 'Design Anthropologist',
    initials: 'AR',
    bgColor: 'bg-blue-100 text-blue-700',
    title: 'Why Frictionless UX Might Be Dumbing Down Our Collectiv...',
    excerpt: 'When we eliminate every obstacle in digital journeys, we inadvertently strip...',
    likes: 342,
    comments: 28,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
  },
  {
    id: 2,
    author: 'Marcus Chen',
    role: 'Macro Strategist',
    initials: 'MC',
    bgColor: 'bg-pink-100 text-pink-700',
    title: 'Decentralized Energy Grids: A Dispatch from the Edge of...',
    excerpt: 'How a valley community bypassed regional utilities to build a self-sustaining...',
    likes: 189,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
  },
];

export function PopularBlogs() {
  const router = useRouter();

  return (
    <View className="py-6 bg-gray-50">
      <View className="px-4 flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <AlignLeft color="#2E7D32" size={20} className="mr-2" />
          <Headline className="text-xl">Popular Blogs</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/popular-blogs')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-[#C9182B] uppercase tracking-widest">Community Voices {'>'}</Label>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {blogs.map((blog) => (
          <TouchableOpacity 
            key={blog.id} 
            className="w-80 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm" 
            activeOpacity={0.9}
            onPress={() => router.push(`/article/${blog.id}`)}
          >
            {/* Author Info */}
            <View className="flex-row items-center mb-4">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${blog.bgColor.split(' ')[0]}`}>
                <Label className={`font-bold ${blog.bgColor.split(' ')[1]}`}>{blog.initials}</Label>
              </View>
              <View>
                <Label className="font-bold text-sm text-neutral-900">{blog.author}</Label>
                <Label className="text-xs text-gray-500">{blog.role}</Label>
              </View>
            </View>

            {/* Image */}
            <Image
              source={{ uri: blog.image }}
              className="w-full h-32 rounded-xl mb-4 bg-gray-100"
            />

            {/* Content */}
            <Headline className="text-lg leading-tight mb-2" numberOfLines={2}>
              {blog.title}
            </Headline>
            <Body className="text-sm text-gray-600 leading-relaxed mb-4" numberOfLines={2}>
              {blog.excerpt}
            </Body>

            {/* Footer Stats */}
            <View className="flex-row items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <TouchableOpacity className="flex-row items-center">
                <Heart size={16} color="#6B7280" className="mr-1.5" />
                <Label className="text-xs text-gray-500">{blog.likes}</Label>
              </TouchableOpacity>
              
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity className="flex-row items-center">
                  <MessageCircle size={16} color="#6B7280" className="mr-1.5" />
                  <Label className="text-xs text-gray-500">{blog.comments}</Label>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Share2 size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
