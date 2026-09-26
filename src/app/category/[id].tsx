import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity, ArrowDown, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../../components/home/BottomNav';
import { Header } from '../../components/home/Header';
import { Badge } from '../../components/ui/Badge';
import { Headline, Label } from '../../components/ui/Typography';
import { SubCategory2, useCategories } from '../../hooks/useCategories';
import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import { Article } from '../../hooks/useHome';

function getArticleTitle(article: Article): string {
  if (article.post_title) return article.post_title;
  if (typeof article.title === 'string') return article.title;
  if (article.title && typeof article.title === 'object' && article.title.rendered) return article.title.rendered;
  if (article.title && typeof article.title === 'object' && article.title.name) return article.title.name;
  return 'Untitled Story';
}

function getArticleExcerpt(article: Article): string {
  if (article.description) return article.description;
  if (article.subtitle) return article.subtitle;
  if (article.content) return article.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
  return 'Read the full story and detailed report.';
}

function getArticleAuthor(article: Article): string {
  if (typeof article.author === 'string') return article.author;
  if (article.author && typeof article.author === 'object') {
    return article.author.full_name || article.author.name || 'Editorial Staff';
  }
  return 'Editorial Staff';
}

function formatImageUrl(raw: any, fallback: string): string {
  if (typeof raw !== 'string' || !raw.trim()) {
    return fallback;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return `http://192.168.1.9:5000${raw}`;
  }
  if (raw.startsWith('uploads/')) {
    return `http://192.168.1.9:5000/${raw}`;
  }
  return `http://192.168.1.9:5000/uploads/${raw}`;
}

function getArticleImage(article: Article): string {
  const raw = article.image || article.imageUrl || article.coverImage;
  return formatImageUrl(raw, 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80');
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return 'Recently';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function CategoryDetails() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [selectedSubcat2Id, setSelectedSubcat2Id] = useState<number | string | null>(null);
  const [activeSort, setActiveSort] = useState('Latest');

  const { categories } = useCategories();

  // Find matching category object from API categories list
  const matchedCat = categories?.find(
    (c) => String(c.id) === String(id) || c.name.toLowerCase().replace(/\s+/g, '-') === id
  );

  const categoryId = matchedCat ? matchedCat.id : (id && id !== 'all' ? id : null);
  const categoryTitle = name || matchedCat?.name || (id === 'all' ? 'All Categories' : id ? id.replace(/-/g, ' ').toUpperCase() : 'Category');

  // Fetch articles: uses subcat2_id when selected, otherwise category_id
  const { articles, loading, loadingMore, error, loadMore, hasMore } = useCategoryArticles(
    categoryId,
    selectedSubcat2Id
  );

  // Extract all subcategories_2 from subcategories_1
  const allSubcat2Items: SubCategory2[] = matchedCat?.subcategories_1?.flatMap(
    (sub1) => sub1.subcategories_2 || []
  ) || [];

  const subFilterList = [
    { id: null, name: 'All' },
    ...allSubcat2Items.map((sub2) => ({ id: sub2.id, name: sub2.name })),
  ];

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
            <Label className="text-[10px] text-primary font-bold uppercase tracking-widest">
              Category Feed
            </Label>
          </View>

          <Headline className="text-3xl mb-3 text-gray-900 font-serif">{categoryTitle}</Headline>

          <Label className="text-sm text-gray-600 leading-relaxed mb-6 font-serif">
            Latest verified dispatches, analysis, and breaking stories curated under {categoryTitle}.
          </Label>

          {/* Briefing Widget */}
          <View className="bg-blue-50 flex-row items-center justify-between p-4 rounded-2xl border border-blue-100 mb-6">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 bg-blue-200/50 rounded-full items-center justify-center mr-3">
                <Activity size={20} color="#2563EB" />
              </View>
              <View>
                <Headline className="text-sm">Live Feed Ready</Headline>
                <Label className="text-[11px] text-gray-500 mt-0.5">
                  {articles.length} stories loaded • Updated live
                </Label>
              </View>
            </View>
          </View>

          {/* Subcategory Chips: Triggers GET /articles/?subcat2_id=X&page=1 on click */}
          {subFilterList.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-4 px-4">
              {subFilterList.map((item) => {
                const isActive = selectedSubcat2Id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id === null ? 'all-subcat' : String(item.id)}
                    onPress={() => setSelectedSubcat2Id(item.id)}
                    className={`px-4 py-2 rounded-full mr-2 ${isActive ? 'bg-[#8B0000]' : 'bg-blue-50 border border-blue-100'
                      }`}
                  >
                    <Label
                      className={`text-xs font-bold ${isActive ? 'text-white' : 'text-blue-700'
                        }`}
                    >
                      {item.name}
                    </Label>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Sorting Toolbar */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row bg-gray-50 p-1 rounded-xl border border-gray-100">
              <TouchableOpacity
                onPress={() => setActiveSort('Latest')}
                style={
                  activeSort === 'Latest'
                    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }
                    : undefined
                }
                className={`px-4 py-1.5 rounded-lg ${activeSort === 'Latest' ? 'bg-white' : ''}`}
              >
                <Label className={`text-xs font-bold ${activeSort === 'Latest' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Latest
                </Label>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveSort('Most Read')}
                style={
                  activeSort === 'Most Read'
                    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }
                    : undefined
                }
                className={`px-4 py-1.5 rounded-lg ${activeSort === 'Most Read' ? 'bg-white' : ''}`}
              >
                <Label className={`text-xs font-bold ${activeSort === 'Most Read' ? 'text-gray-900' : 'text-gray-500'}`}>
                  Most Read
                </Label>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <SlidersHorizontal size={14} color="#6B7280" className="mr-2" />
              <Label className="text-xs text-gray-600 font-bold">Filter</Label>
            </View>
            <Label className="text-[11px] text-gray-500">{articles.length} Stories</Label>
          </View>
        </View>

        {/* Article List */}
        <View className="px-4 py-4 gap-y-4 bg-[#F8F9FA]">
          {loading ? (
            <View className="py-12 items-center justify-center">
              <ActivityIndicator size="large" color="#002249" />
              <Label className="text-xs text-gray-500 mt-3 font-medium">Fetching subcategory articles...</Label>
            </View>
          ) : error ? (
            <View className="py-12 px-4 items-center bg-white rounded-2xl border border-red-100">
              <Label className="text-sm font-bold text-red-600 mb-1">Failed to load articles</Label>
              <Label className="text-xs text-gray-500 text-center mb-4">{error}</Label>
            </View>
          ) : articles.length === 0 ? (
            <View className="py-12 px-4 items-center bg-white rounded-2xl border border-gray-100">
              <Sparkles size={32} color="#9CA3AF" />
              <Label className="text-base font-bold text-gray-700 mt-3">No Articles Found</Label>
              <Label className="text-xs text-gray-500 text-center mt-1">
                There are currently no published articles in this subcategory.
              </Label>
            </View>
          ) : (
            articles.map((article, index) => {
              const artId = article._id || article.id || index;
              const title = getArticleTitle(article);
              const excerpt = getArticleExcerpt(article);
              const author = getArticleAuthor(article);
              const date = formatDate(article.created_at || article.createdAt || article.publishedAt);
              const imageUri = getArticleImage(article);
              const catLabel =
                typeof article.category === 'string'
                  ? article.category
                  : article.category?.name || categoryTitle;

              return (
                <TouchableOpacity
                  key={String(artId)}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/article/${artId}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                  style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Badge label={catLabel.toUpperCase()} variant="blue" className="rounded-md" />
                  </View>

                  <View className="flex-row justify-between">
                    <View className="flex-1 pr-4 justify-between">
                      <Headline className="text-[17px] leading-snug mb-1 text-gray-900" numberOfLines={2}>
                        {title}
                      </Headline>
                      <Label className="text-xs text-gray-500 leading-relaxed mb-3" numberOfLines={2}>
                        {excerpt}
                      </Label>

                      <View className="flex-row items-center">
                        <Label className="text-xs text-gray-700 font-medium">{author}</Label>
                        <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                        <Label className="text-[11px] text-gray-500">{date}</Label>
                      </View>
                    </View>

                    <Image
                      source={{ uri: imageUri }}
                      className="w-24 h-24 rounded-xl bg-gray-100"
                    />
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* Load More Button */}
          {!loading && articles.length > 0 && hasMore && (
            <View className="items-center py-6">
              <TouchableOpacity
                disabled={loadingMore}
                onPress={loadMore}
                className="bg-[#002249] border border-gray-200 w-full py-3.5 rounded-xl flex-row justify-center items-center shadow-sm"
              >
                {loadingMore ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Label className="text-sm font-bold text-white mr-2">Load More Stories</Label>
                    <ArrowDown size={16} color="#FFFFFF" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
