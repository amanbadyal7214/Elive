import { useRouter } from 'expo-router';
import { Clock, MessageCircle, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { ActivityIndicator, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import useHome from '../../hooks/useHome';
import { Badge } from '../ui/Badge';
import { Headline, Label } from '../ui/Typography';

const fallbackUpdates = [
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

const formatTitle = (item: any): string => {
  if (typeof item.post_title === 'string' && item.post_title.trim() !== '') {
    return item.post_title;
  }
  if (typeof item.title === 'string' && item.title.trim() !== '') {
    return item.title;
  }
  if (typeof item.title === 'object' && item.title !== null) {
    return item.title.rendered || item.title.name || item.title.text || '';
  }
  return 'Untitled Article';
};

const formatCategory = (category: any): string => {
  if (typeof category === 'string' && category.trim() !== '') return category;
  if (typeof category === 'object' && category !== null) {
    return category.name || category.title || 'BREAKING';
  }
  return 'BREAKING';
};

const formatTime = (item: any): string => {
  const dateStr = item.created_at || item.createdAt || item.publishedAt || item.time;
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }
  } catch {}
  return String(dateStr);
};

const formatImage = (item: any): string => {
  const raw = item.image || item.imageUrl || item.coverImage || item.thumbnail;
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return `http://192.168.1.9:5000${raw}`;
  }
  return `http://192.168.1.9:5000/uploads/${raw}`;
};

export function BreakingUpdates() {
  const router = useRouter();
  const { breakingArticles, loading } = useHome();

  const displayArticles = breakingArticles.length > 0
    ? breakingArticles.map((item) => ({
        id: item._id || item.id || Math.random().toString(),
        category: formatCategory(item.category),
        title: formatTitle(item),
        time: formatTime(item),
        readTime: typeof item.readTime === 'string' ? item.readTime : '3 min read',
        image: formatImage(item),
      }))
    : fallbackUpdates;

  return (
    <View className="py-4 bg-white">
      <View className="px-4 flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-primary mr-2" />
          <Headline className="text-lg">Breaking Updates</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/live-desk')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Desk {'>'}</Label>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="small" color="#E11D48" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {displayArticles.map((item) => (
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
                  defaultSource={{ uri: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80' }}
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
      )}
    </View>
  );
}
