import { useRouter } from 'expo-router';
import { Clock, Eye, Flame, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ImageBackground, TouchableOpacity, View } from 'react-native';
import useHome from '../../hooks/useHome';
import { Badge } from '../ui/Badge';
import { Headline, Label } from '../ui/Typography';

const fallbackTrending = [
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

const formatTitle = (item: any): string => {
  if (typeof item.post_title === 'string' && item.post_title.trim() !== '') {
    return item.post_title;
  }
  if (typeof item.title === 'string' && item.title.trim() !== '') {
    return item.title;
  }
  if (typeof item.title === 'object' && item.title !== null) {
    return item.title.rendered || item.title.name || '';
  }
  return 'Trending Article';
};

const formatCategory = (category: any): string => {
  if (typeof category === 'string' && category.trim() !== '') return category;
  if (typeof category === 'object' && category !== null) {
    return category.name || category.title || 'TRENDING';
  }
  return 'TRENDING';
};

const formatImage = (item: any): string => {
  const raw = item.image || item.imageUrl || item.coverImage || item.thumbnail;
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1531366936337-7c912a458b07?w=800&q=80';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return `http://192.168.1.9:5000${raw}`;
  }
  return `http://192.168.1.9:5000/uploads/${raw}`;
};

export function TrendingNow() {
  const router = useRouter();
  const { trendingArticles, loading } = useHome();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const displayBlogs = trendingArticles.length > 0
    ? trendingArticles.map((item) => {
      const authorObj = item.author as any;
      const authorName = typeof authorObj === 'object' && authorObj !== null
        ? (authorObj.full_name || authorObj.name || 'Author')
        : (typeof authorObj === 'string' ? authorObj : 'Author');

      return {
        id: item._id || item.id || Math.random().toString(),
        badge: item.badge || 'TRENDING',
        category: formatCategory(item.category),
        views: item.views ? `${item.views} VIEWS` : '15K VIEWS',
        title: formatTitle(item),
        authorName: authorName,
        authorImage: typeof authorObj === 'object' && authorObj?.image
          ? formatImage({ image: authorObj.image })
          : 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        readTime: typeof item.readTime === 'string' ? item.readTime : '6 min read',
        image: formatImage(item),
      };
    })
    : fallbackTrending;

  useEffect(() => {
    if (displayBlogs.length <= 1) return;

    const timer = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex((prev) => (prev + 1) % displayBlogs.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [displayBlogs.length, fadeAnim]);

  const blog = displayBlogs[currentIndex] || displayBlogs[0];

  return (
    <View className="py-3 px-4 bg-white border-t border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Flame color="#002249" size={20} className="mr-2" />
          <Headline className="text-xl font-bold"> Trending Now</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/editors-pick')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">Editor's Pick {'>'}</Label>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator size="small" color="#002249" />
        </View>
      ) : (
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

                <Headline className="text-white text-[22px]  leading-snug font-bold shadow-md">
                  {blog.title}
                </Headline>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1 pr-4">
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
      )}
    </View>
  );
}
