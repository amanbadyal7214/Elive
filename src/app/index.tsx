import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/home/BottomNav';
import { BreakingUpdates } from '../components/home/BreakingUpdates';
import { CategoryFilters } from '../components/home/CategoryFilters';
import { Header } from '../components/home/Header';
import { InfiniteArticlesFeed } from '../components/home/InfiniteArticlesFeed';
import { NewArticles } from '../components/home/NewArticles';
import { NewsletterSignup } from '../components/home/NewsletterSignup';
import { PopularBlogs } from '../components/home/PopularBlogs';
import { TrendingNow } from '../components/home/TrendingNow';
import { useCategoryArticles } from '../hooks/useCategoryArticles';

export default function Index() {
  // Fetch all articles feed (page=1, page=2, etc.) for infinite scrolling
  const { articles, loading, loadingMore, hasMore, loadMore } = useCategoryArticles(null, null);

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 250;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (!loadingMore && hasMore) {
        loadMore();
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={300}
      >
        <CategoryFilters />
        <BreakingUpdates />
        <TrendingNow />
        <NewArticles />
        <PopularBlogs />

        {/* Infinite Scroll Articles Feed directly below PopularBlogs (GET /api/articles/?page=X) */}
        <InfiniteArticlesFeed
          articlesOverride={articles}
          loadingOverride={loading}
          loadingMoreOverride={loadingMore}
          hasMoreOverride={hasMore}
          onLoadMore={loadMore}
        />

        <NewsletterSignup />

        {/* Add bottom padding so content isn't hidden behind the fixed bottom nav */}
        <View className="h-24" />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
