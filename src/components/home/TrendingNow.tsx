import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Eye, Flame, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react-native';
import { Headline, Label } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

const trendingBlogs = [
  {
    id: 1,
    badge: 'DEEP DIVE',
    category: 'Special Report',
    views: '18.4K VIEWS',
    title: 'The Deep Sea Mapping Initiative: How Uncharted Abyssal Plains Hold Our Future Medicines',
    authorName: 'Dr. Elena Moreau',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a458b07?w=800&q=80',
  },
  {
    id: 2,
    badge: 'EXCLUSIVE',
    category: 'Technology',
    views: '24.1K VIEWS',
    title: 'Quantum Processors Hit the Consumer Market: What You Need to Know',
    authorName: 'James Chen',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  },
];

export function TrendingNow() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % trendingBlogs.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [fadeAnim]);

  const blog = trendingBlogs[currentIndex];

  return (
    <View className="py-6 px-4 bg-white border-t border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Flame color="#C9182B" size={20} className="mr-2" />
          <Headline className="text-xl font-bold">Trending Now</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/editors-pick')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-[#C9182B] uppercase tracking-widest">Editor's Pick {'>'}</Label>
        </TouchableOpacity>
      </View>

      <Animated.View style={{ opacity: fadeAnim }} className="w-full">
        <TouchableOpacity 
          activeOpacity={0.9} 
          className="rounded-2xl overflow-hidden h-[340px] w-full"
          onPress={() => router.push(`/article/${blog.id}`)}
        >
          <ImageBackground
            key={blog.id}
            source={{ uri: blog.image }}
            className="flex-1 p-5 justify-between"
          >
            {/* Dark Overlay for text readability */}
            <View className="absolute inset-0 bg-black/40" />

            <View className="flex-row items-start justify-between z-10">
              <Badge label={blog.badge} variant="primary" />
              <View className="flex-row items-center gap-2">
                <TouchableOpacity className="bg-black/40 p-2 rounded-full backdrop-blur-md">
                  <ThumbsUp size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-black/40 p-2 rounded-full backdrop-blur-md">
                  <ThumbsDown size={16} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="bg-black/40 p-2 rounded-full backdrop-blur-md">
                  <MessageCircle size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="z-10">
              <View className="flex-row items-center mb-3">
                <Label className="text-white text-[10px] font-bold uppercase tracking-wider mr-3">{blog.category}</Label>
                <View className="w-1 h-1 rounded-full bg-white/50 mr-3" />
                <Eye size={12} color="rgba(255,255,255,0.7)" className="mr-1" />
                <Label className="text-white/80 text-[10px]">{blog.views}</Label>
              </View>

              <Headline className="text-white text-[22px] mb-5 leading-snug font-bold shadow-md">
                {blog.title}
              </Headline>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 pr-4">
                  <Avatar src={blog.authorImage} size={28} className="mr-2 border border-white/20" />
                  <Label className="text-white text-sm" numberOfLines={1}>{blog.authorName}</Label>
                </View>
                <View className="flex-row items-center bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md">
                  <Clock size={12} color="white" className="mr-1.5" />
                  <Label className="text-white text-xs">{blog.readTime}</Label>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
