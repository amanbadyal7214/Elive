import { useRouter } from 'expo-router';
import { LayoutGrid, MoreVertical } from 'lucide-react-native';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import useHome from '../../hooks/useHome';
import { Badge } from '../ui/Badge';
import { Headline, Label } from '../ui/Typography';

const fallbackArticles = [
  {
    id: 1,
    category: 'ENTERTAINMENT',
    title: "'The Renaissance of Acoustic Architecture in Live...",
    date: 'Oct 24',
    readTime: '5m read',
    image: 'https://images.unsplash.com/photo-1540839045362-a56c2719cb61?w=400&q=80',
    badgeVariant: 'blue',
  },
  {
    id: 2,
    category: 'SPIRITUAL',
    title: 'Chronos vs. Kairos: Reclaiming the Soul of...',
    date: 'Oct 23',
    readTime: '7m read',
    image: 'https://images.unsplash.com/photo-1606707764516-7c70560fbd95?w=400&q=80',
    badgeVariant: 'green',
  },
  {
    id: 3,
    category: 'LIFESTYLE',
    title: 'Craft Economies: Why Gen Z is Choosing Craft Studios...',
    date: 'Oct 22',
    readTime: '4m read',
    image: 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=400&q=80',
    badgeVariant: 'pink',
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
  return 'New Article';
};

const formatCategory = (category: any): string => {
  if (typeof category === 'string' && category.trim() !== '') return category;
  if (typeof category === 'object' && category !== null) {
    return category.name || category.title || 'LATEST';
  }
  return 'LATEST';
};

const formatTime = (item: any): string => {
  const dateStr = item.created_at || item.createdAt || item.publishedAt || item.date;
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
    return 'https://images.unsplash.com/photo-1540839045362-a56c2719cb61?w=400&q=80';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return `http://192.168.1.9:5000${raw}`;
  }
  return `http://192.168.1.9:5000/uploads/${raw}`;
};

export function NewArticles() {
  const router = useRouter();
  const { latestArticles, loading } = useHome();

  const displayArticles = latestArticles.length > 0
    ? latestArticles.map((item, index) => {
        const variants: ('blue' | 'green' | 'pink' | 'primary')[] = ['blue', 'green', 'pink', 'primary'];
        return {
          id: item._id || item.id || Math.random().toString(),
          category: formatCategory(item.category),
          title: formatTitle(item),
          date: formatTime(item),
          readTime: typeof item.readTime === 'string' ? item.readTime : '5m read',
          image: formatImage(item),
          badgeVariant: variants[index % variants.length],
        };
      })
    : fallbackArticles;

  return (
    <View className="py-6 px-4 bg-[#F8F9FA] border-t border-gray-100">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <LayoutGrid color="#1B365D" size={20} className="mr-2" />
          <Headline className="text-xl">New Articles</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/new-articles')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-primary uppercase tracking-widest flex-row items-center">
            View All {'>'}
          </Label>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="small" color="#1B365D" />
        </View>
      ) : (
        <View className="gap-y-6">
          {displayArticles.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className="flex-row bg-white rounded-2xl p-3 border border-gray-100" 
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
              activeOpacity={0.7}
              onPress={() => router.push(`/article/${item.id}`)}
            >
              <Image
                source={{ uri: item.image }}
                className="w-24 h-24 rounded-xl mr-4 bg-gray-100"
              />
              <View className="flex-1 justify-between py-1">
                <View className="flex-row items-start justify-between">
                  <Badge label={item.category} variant={item.badgeVariant as any} />
                  <TouchableOpacity className="p-1 -mr-2">
                    <MoreVertical size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <Headline className="text-base leading-tight mt-2 mb-1" numberOfLines={2}>
                  {item.title}
                </Headline>

                <View className="flex-row items-center mt-auto">
                  <Label className="text-xs text-gray-500">{item.date}</Label>
                  <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                  <Label className="text-xs text-gray-500">{item.readTime}</Label>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
