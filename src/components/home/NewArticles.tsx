import { LayoutGrid, MoreVertical } from 'lucide-react-native';
import { View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../ui/Badge';
import { Headline, Label } from '../ui/Typography';

const articles = [
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

export function NewArticles() {
  const router = useRouter();

  return (
    <View className="py-6 px-4 bg-[#F8F9FA] border-t border-gray-100">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <LayoutGrid color="#1B365D" size={20} className="mr-2" />
          <Headline className="text-xl">New Articles</Headline>
        </View>
        <TouchableOpacity>
          <Label className="text-[10px] font-bold text-primary uppercase tracking-widest flex-row items-center">
            View All {'>'}
          </Label>
        </TouchableOpacity>
      </View>

      <View className="gap-y-6">
        {articles.map((item) => (
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
    </View>
  );
}
