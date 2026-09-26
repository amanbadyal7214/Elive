import { useRouter } from 'expo-router';
import {
  Eye,
  Flame,
  RefreshCw,
  Share2,
  Sparkles
} from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/home/BottomNav';
import { Header } from '../components/home/Header';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Headline, Label } from '../components/ui/Typography';
import { Article, useHome } from '../hooks/useHome';

function formatImageUrl(raw: any, fallback: string): string {
  if (typeof raw !== 'string' || !raw.trim()) return fallback;
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) return raw;
  if (raw.startsWith('/')) return `http://192.168.1.9:5000${raw}`;
  if (raw.startsWith('uploads/')) return `http://192.168.1.9:5000/${raw}`;
  return `http://192.168.1.9:5000/uploads/${raw}`;
}

function getArticleTitle(article: Article): string {
  if (article.post_title) return article.post_title;
  if (typeof article.title === 'string') return article.title;
  if (article.title && typeof article.title === 'object' && article.title.rendered) return article.title.rendered;
  if (article.title && typeof article.title === 'object' && article.title.name) return article.title.name;
  return 'Untitled Story';
}

function getArticleCategory(article: Article): string {
  if (typeof article.category === 'string') return article.category;
  if (article.category && typeof article.category === 'object') return article.category.name || 'TRENDING';
  return 'TRENDING';
}

function getArticleAuthorName(article: Article): string {
  if (typeof article.author === 'string') return article.author;
  if (article.author && typeof article.author === 'object') {
    return article.author.full_name || article.author.name || 'Editorial Team';
  }
  return 'Editorial Team';
}

function getArticleAuthorImage(article: Article): string {
  const raw = typeof article.author === 'object' ? article.author?.image || article.author?.avatar : null;
  return formatImageUrl(raw, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150');
}

export default function TrendingScreen() {
  const router = useRouter();
  const { trendingArticles, popularArticles, loading, error, refetch } = useHome();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'viral'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const combinedList = trendingArticles.length > 0 ? trendingArticles : popularArticles;
  const displayArticles = activeFilter === 'hot'
    ? combinedList.slice(0, 5)
    : activeFilter === 'viral'
      ? combinedList.slice(2)
      : combinedList;

  const handleShareArticle = async (item: Article) => {
    const title = getArticleTitle(item);
    try {
      await Share.share({
        title,
        message: `${title}\n\nCheck out this trending story on Elive!`,
      });
    } catch (e) {
      console.error('Share error:', e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#002249']} />}
      >
        {/* Consistent App Section Header */}
        <View className="px-4 py-4 border-b border-gray-100 bg-white">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-2">
              <Flame color="#002249" size={20} />
              <Headline className="text-xl font-bold font-serif text-gray-900">Trending Stories</Headline>
            </View>
            <TouchableOpacity onPress={refetch} className="p-1.5 bg-gray-100 rounded-full">
              <RefreshCw color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>

          <Label className="text-xs text-gray-500 font-serif leading-relaxed mb-4">
            Discover real-time viral news and top-ranked stories across the platform.
          </Label>

          {/* Filter Pills matching App Theme */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            <TouchableOpacity
              onPress={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full mr-2.5 border ${activeFilter === 'all' ? 'bg-[#002249] border-transparent' : 'bg-gray-50 border-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${activeFilter === 'all' ? 'text-white' : 'text-gray-700'}`}>
                🔥 Top All ({displayArticles.length})
              </Label>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('hot')}
              className={`px-4 py-2 rounded-full mr-2.5 border ${activeFilter === 'hot' ? 'bg-[#002249] border-transparent' : 'bg-gray-50 border-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${activeFilter === 'hot' ? 'text-white' : 'text-gray-700'}`}>
                ⚡ Most Popular
              </Label>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveFilter('viral')}
              className={`px-4 py-2 rounded-full border ${activeFilter === 'viral' ? 'bg-[#002249] border-transparent' : 'bg-gray-50 border-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${activeFilter === 'viral' ? 'text-white' : 'text-gray-700'}`}>
                ✨ Rising Fast
              </Label>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Trending Articles Feed */}
        <View className="px-4 pt-4">
          {loading && displayArticles.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <ActivityIndicator size="large" color="#002249" />
              <Label className="text-xs text-gray-500 font-medium mt-3">Fetching trending stories...</Label>
            </View>
          ) : error ? (
            <View className="bg-red-50 p-5 rounded-3xl border border-red-200 items-center mb-4">
              <Label className="text-xs text-red-600 font-bold mb-3">{error}</Label>
              <TouchableOpacity onPress={refetch} className="bg-red-600 px-4 py-2 rounded-xl">
                <Label className="text-xs text-white font-bold">Reload Feed</Label>
              </TouchableOpacity>
            </View>
          ) : displayArticles.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center border border-gray-100 shadow-sm my-4">
              <Sparkles size={36} color="#002249" className="mb-2" />
              <Headline className="text-base font-bold text-gray-800 mb-1">No Trending Stories Yet</Headline>
              <Label className="text-xs text-gray-500 text-center">Check back soon as new stories gain traction!</Label>
            </View>
          ) : (
            <View className="gap-y-4">
              {displayArticles.map((item, index) => {
                const title = getArticleTitle(item);
                const category = getArticleCategory(item);
                const authorName = getArticleAuthorName(item);
                const authorImage = getArticleAuthorImage(item);
                const imageUri = formatImageUrl(
                  item.image || item.imageUrl || item.coverImage,
                  'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80'
                );
                const rawContent = item.content || item.description || item.excerpt || '';
                const cleanExcerpt = rawContent.replace(/<[^>]*>?/gm, '').trim();
                const rankNum = String(index + 1).padStart(2, '0');
                const artId = item.id || item._id || index;

                return (
                  /* Standard App Card Styling with Rank Badge */
                  <TouchableOpacity
                    key={artId}
                    activeOpacity={0.88}
                    onPress={() => router.push(`/article/${artId}`)}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
                  >
                    {/* Top Row: Rank Tag, Category Badge & Date */}
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center gap-2">
                        <View className="bg-[#002249] px-2.5 py-0.5 rounded-md flex-row items-center">
                          <Label className="text-[10px] font-bold text-white tracking-wider">
                            #{rankNum}
                          </Label>
                        </View>
                        <Badge label={category.toUpperCase()} variant="blue" className="rounded-md" />
                      </View>

                      <Label className="text-[11px] text-gray-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Trending'}
                      </Label>
                    </View>

                    {/* Middle Content Row: Title, Excerpt & Image */}
                    <View className="flex-row justify-between">
                      <View className="flex-1 pr-3">
                        <Headline className="text-base font-serif font-bold text-gray-900 leading-snug mb-2" numberOfLines={2}>
                          {title}
                        </Headline>

                        {cleanExcerpt ? (
                          <Label className="text-xs text-gray-600 font-serif leading-relaxed" numberOfLines={2}>
                            {cleanExcerpt}
                          </Label>
                        ) : null}
                      </View>

                      <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-2xl bg-gray-100" />
                    </View>

                    {/* Bottom Row: Author & Engagement Stats */}
                    <View className="flex-row items-center justify-between pt-3.5 mt-3 border-t border-gray-100">
                      <View className="flex-row items-center flex-1 mr-2">
                        <Avatar src={authorImage} size={24} className="mr-2 border border-gray-200" />
                        <Label className="text-xs font-bold text-gray-800" numberOfLines={1}>
                          {authorName}
                        </Label>
                      </View>

                      <View className="flex-row items-center gap-4">
                        {(item.views || item.views_count) ? (
                          <View className="flex-row items-center gap-1">
                            <Eye color="#6B7280" size={14} />
                            <Label className="text-xs text-gray-600 font-medium">
                              {item.views || item.views_count}
                            </Label>
                          </View>
                        ) : null}

                        <TouchableOpacity onPress={() => handleShareArticle(item)} className="p-1">
                          <Share2 color="#6B7280" size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}
