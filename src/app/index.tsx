import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/home/Header";
import { CategoryFilters } from "../components/home/CategoryFilters";
import { BreakingUpdates } from "../components/home/BreakingUpdates";
import { TrendingNow } from "../components/home/TrendingNow";
import { NewArticles } from "../components/home/NewArticles";
import { PopularBlogs } from "../components/home/PopularBlogs";
import { NewsletterSignup } from "../components/home/NewsletterSignup";
import { BottomNav } from "../components/home/BottomNav";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <CategoryFilters />
        <BreakingUpdates />
        <TrendingNow />
        <NewArticles />
        <PopularBlogs />
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

