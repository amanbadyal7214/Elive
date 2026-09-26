import { useRouter } from 'expo-router';
import { ArrowDown, Clock, Sparkles } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View } from 'react-native';
import { useCategoryArticles } from '../../hooks/useCategoryArticles';
import { Article } from '../../hooks/useHome';
import { Badge } from '../ui/Badge';
import { Headline, Label } from '../ui/Typography';

function formatImageUrl(raw: any): string {
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80';
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
  if (article.content) return article.content.replace(/<[^>]+>/g, '').slice(0, 110) + '...';
  return 'Explore detailed reporting and full commentary.';
}

function getArticleAuthor(article: Article): string {
  if (typeof article.author === 'string') return article.author;
  if (article.author && typeof article.author === 'object') {
    return article.author.full_name || article.author.name || 'Editorial Staff';
  }
  return 'Editorial Staff';
}

function getArticleCategory(article: Article): string {
  if (typeof article.category === 'string') return article.category;
  if (article.category && typeof article.category === 'object') {
    return article.category.name || 'GENERAL';
  }
  return 'GENERAL';
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

interface InfiniteArticlesFeedProps {
  articlesOverride?: Article[];
  loadingOverride?: boolean;
  loadingMoreOverride?: boolean;
  hasMoreOverride?: boolean;
  onLoadMore?: () => void;
}

export function InfiniteArticlesFeed({
  articlesOverride,
  loadingOverride,
  loadingMoreOverride,
  hasMoreOverride,
  onLoadMore,
}: InfiniteArticlesFeedProps) {
  const router = useRouter();

  // Fetch articles from GET /api/articles/?page=1 via useCategoryArticles hook
  const {
    articles: fetchedArticles,
    loading: fetchedLoading,
    loadingMore: fetchedLoadingMore,
    hasMore: fetchedHasMore,
    loadMore: fetchedLoadMore,
  } = useCategoryArticles(null, null);

  const articles = articlesOverride || fetchedArticles;
  const loading = loadingOverride !== undefined ? loadingOverride : fetchedLoading;
  const loadingMore = loadingMoreOverride !== undefined ? loadingMoreOverride : fetchedLoadingMore;
  const hasMore = hasMoreOverride !== undefined ? hasMoreOverride : fetchedHasMore;
  const handleLoadMore = onLoadMore || fetchedLoadMore;

  return (
    <View className="py-6 bg-[#F8F9FA] border-t border-gray-100">
      {/* Section Header */}
      <View className="px-4 mb-4">
        <View className="flex-row items-center mb-1">
          <View className="w-1.5 h-1.5 rounded-full bg-[#002249] mr-2" />
          <Label className="text-[10px] font-bold text-[#002249] uppercase tracking-widest">
            More Stories & Feed
          </Label>
        </View>
        <Headline className="text-2xl font-serif text-gray-900">
          Latest Dispatches
        </Headline>
      </View>

      {/* Articles Feed */}
      <View className="px-4 gap-y-4">
        {loading && articles.length === 0 ? (
          <View className="py-12 items-center justify-center bg-white rounded-2xl">
            <ActivityIndicator size="large" color="#002249" />
            <Label className="text-xs text-gray-500 mt-3 font-medium">
              Loading articles feed...
            </Label>
          </View>
        ) : articles.length === 0 ? (
          <View className="py-10 px-4 items-center bg-white rounded-2xl border border-gray-100">
            <Sparkles size={28} color="#9CA3AF" />
            <Label className="text-sm font-bold text-gray-700 mt-2">No More Stories</Label>
          </View>
        ) : (
          articles.map((article, index) => {
            const artId = article._id || article.id || index;
            const title = getArticleTitle(article);
            const excerpt = getArticleExcerpt(article);
            const author = getArticleAuthor(article);
            const category = getArticleCategory(article);
            const date = formatDate(article.created_at || article.createdAt || article.publishedAt);
            const imageUri = formatImageUrl(article.image || article.imageUrl || article.coverImage);

            return (
              <TouchableOpacity
                key={String(artId)}
                activeOpacity={0.8}
                onPress={() => router.push(`/article/${artId}`)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                style={{
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                }}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <Badge label={category.toUpperCase()} variant="blue" className="rounded-md" />
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
                      <View className="flex-1" />
                      <View className="flex-row items-center">
                        <Clock size={12} color="#002249" className="mr-1" />
                        <Label className="text-[11px] font-bold text-[#002249]">3 min read</Label>
                      </View>
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

        {/* Loading More Indicator / Trigger */}
        {loadingMore && (
          <View className="py-6 items-center justify-center">
            <ActivityIndicator size="small" color="#002249" />
            <Label className="text-xs text-gray-500 mt-2">Loading next page...</Label>
          </View>
        )}

        {!loading && articles.length > 0 && hasMore && !loadingMore && (
          <View className="items-center py-4">
            <TouchableOpacity
              onPress={handleLoadMore}
              className="bg-[#002249] border border-gray-200 w-full py-3.5 rounded-xl flex-row justify-center items-center shadow-sm"
            >
              <Label className="text-sm font-bold text-white mr-2">Load More Articles</Label>
              <ArrowDown size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default InfiniteArticlesFeed;
