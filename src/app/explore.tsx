import { useRouter } from 'expo-router';
import { Filter, Layers, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/home/BottomNav';
import { Header } from '../components/home/Header';
import { Badge } from '../components/ui/Badge';
import { Headline, Label } from '../components/ui/Typography';
import { useCategories, SubCategory1, SubCategory2 } from '../hooks/useCategories';
import { useCategoryArticles } from '../hooks/useCategoryArticles';
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
  if (article.category && typeof article.category === 'object') return article.category.name || 'GENERAL';
  return 'GENERAL';
}

function getArticleAuthor(article: Article): string {
  if (typeof article.author === 'string') return article.author;
  if (article.author && typeof article.author === 'object') {
    return article.author.full_name || article.author.name || 'Editorial Staff';
  }
  return 'Editorial Staff';
}

function getArticleImage(article: Article): string {
  const raw = article.image || article.imageUrl || article.coverImage || article.thumbnail;
  return formatImageUrl(raw, 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80');
}

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>('all');
  const [selectedSubcat2Id, setSelectedSubcat2Id] = useState<number | string | null>(null);

  // Fetch dynamic categories from API
  const { categories, loading: loadingCategories } = useCategories();

  // Fetch trending articles for home / top recommendations
  const { trendingArticles, loading: loadingHome } = useHome();

  // Fetch articles based on selected category, subcategory & search query (GET /articles/?search=query)
  const { articles: categoryArticles, loading: loadingCatArticles } = useCategoryArticles(
    selectedCategoryId === 'all' ? null : selectedCategoryId,
    selectedSubcat2Id,
    searchQuery
  );

  const handleCategoryPress = (catId: number | string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcat2Id(null);
  };

  const handleSubCategoryPress = (subId: number | string | null) => {
    setSelectedSubcat2Id(subId);
  };

  // Main Categories array
  const filterCategories: { id: number | string; name: string; subcategories_1?: SubCategory1[] }[] = [
    { id: 'all', name: 'All' },
    ...(categories || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      subcategories_1: cat.subcategories_1,
    })),
  ];

  const activeCategoryObj = filterCategories.find((c) => String(c.id) === String(selectedCategoryId));

  // Build subcategory level 2 list for selected category
  const activeSubcat2List: { id: number | string | null; name: string }[] = [
    { id: null, name: 'All' },
  ];

  if (activeCategoryObj && activeCategoryObj.id !== 'all' && activeCategoryObj.subcategories_1) {
    activeCategoryObj.subcategories_1.forEach((sub1: SubCategory1) => {
      if (sub1.subcategories_2) {
        sub1.subcategories_2.forEach((sub2: SubCategory2) => {
          activeSubcat2List.push({ id: sub2.id, name: sub2.name });
        });
      }
    });
  }

  // Determine articles list to display:
  // If search query or filters are active, use categoryArticles fetched from API
  const filteredArticles =
    searchQuery.trim() || selectedCategoryId !== 'all' || selectedSubcat2Id
      ? categoryArticles
      : (categoryArticles.length > 0 ? categoryArticles : trendingArticles);

  const isLoading = loadingHome || loadingCategories || loadingCatArticles;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Header />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 py-4 border-b border-gray-100">
          <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full border border-gray-200">
            <Search size={20} color="#6B7280" className="mr-3" />
            <TextInput
              className="flex-1 text-sm text-gray-900 font-sans"
              placeholder="Search articles, topics, authors..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Explore By Desk (Dynamic Categories & Subcategories) */}
        <View className="py-4 border-b border-gray-100 bg-white">
          <View className="px-4 flex-row items-center justify-between mb-3">
            <Label className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
              Explore By Desk
            </Label>
            {selectedCategoryId !== 'all' && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategoryId('all');
                  setSelectedSubcat2Id(null);
                }}
              >
                <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Reset Filters
                </Label>
              </TouchableOpacity>
            )}
          </View>

          {/* Main Categories Row */}
          {loadingCategories && categories.length === 0 ? (
            <View className="px-4 py-2 flex-row items-center">
              <ActivityIndicator size="small" color="#002249" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
              {filterCategories.map((filter) => {
                const isSelected = String(selectedCategoryId) === String(filter.id);
                return (
                  <TouchableOpacity
                    key={String(filter.id)}
                    onPress={() => handleCategoryPress(filter.id)}
                    className={`flex-row items-center px-4 py-2.5 rounded-full mr-2.5 border ${
                      isSelected ? 'bg-[#002249] border-transparent' : 'bg-gray-50 border-gray-200'
                    }`}
                    style={
                      isSelected
                        ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 }
                        : {}
                    }
                  >
                    {!isSelected && filter.id !== 'all' && (
                      <View className="w-2 h-2 rounded-full mr-2 bg-primary" />
                    )}
                    <Label className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {filter.name}
                    </Label>
                  </TouchableOpacity>
                );
              })}
              <View className="w-4" />
            </ScrollView>
          )}

          {/* Subcategories Row (Level 2) */}
          {activeCategoryObj && activeCategoryObj.id !== 'all' && activeSubcat2List.length > 1 && (
            <View className="mt-4 pt-3 border-t border-gray-100 px-4">
              <View className="flex-row items-center mb-2.5">
                <Layers size={13} color="#6B7280" className="mr-1.5" />
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {activeCategoryObj.name} Subcategories
                </Label>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
                {activeSubcat2List.map((subItem) => {
                  const isSubActive = selectedSubcat2Id === subItem.id;
                  return (
                    <TouchableOpacity
                      key={subItem.id === null ? 'sub-all' : String(subItem.id)}
                      onPress={() => handleSubCategoryPress(subItem.id)}
                      style={
                        isSubActive
                          ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 }
                          : undefined
                      }
                      className={`px-3.5 py-1.5 rounded-xl mr-2 flex-row items-center border ${
                        isSubActive ? 'bg-[#002249] border-[#002249]' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Label className={`text-xs font-semibold ${isSubActive ? 'text-white' : 'text-gray-700'}`}>
                        {subItem.name}
                      </Label>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View className="bg-[#F8F9FA] px-4 py-6">
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {selectedCategoryId === 'all' ? 'Trending & Top Picks' : `${activeCategoryObj?.name}`}
              </Label>
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
              </Label>
            </View>
            <Headline className="text-2xl mb-6 font-serif">
              {selectedSubcat2Id !== null
                ? 'Subcategory Articles'
                : selectedCategoryId !== 'all'
                ? `${activeCategoryObj?.name} Stories`
                : 'Top Recommended For You'}
            </Headline>

            {isLoading && filteredArticles.length === 0 ? (
              <View className="py-12 items-center justify-center bg-white rounded-2xl">
                <ActivityIndicator size="large" color="#002249" />
                <Label className="text-xs text-gray-500 mt-3">Loading stories...</Label>
              </View>
            ) : filteredArticles.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center justify-center border border-gray-100 shadow-sm my-4">
                <Filter size={32} color="#9CA3AF" className="mb-3" />
                <Headline className="text-base text-gray-800 mb-1">No articles found</Headline>
                <Label className="text-xs text-gray-500 text-center mb-4">
                  No articles matched your selected category and filter.
                </Label>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategoryId('all');
                    setSelectedSubcat2Id(null);
                    setSearchQuery('');
                  }}
                  className="bg-primary px-5 py-2.5 rounded-full"
                >
                  <Label className="text-white text-xs font-bold">Clear Filters</Label>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-y-6">
                {filteredArticles.map((article, index) => {
                  const artId = article._id || article.id || index;
                  const title = getArticleTitle(article);
                  const catName = getArticleCategory(article);
                  const author = getArticleAuthor(article);
                  const imageUri = getArticleImage(article);

                  return (
                    <TouchableOpacity
                      key={String(artId)}
                      onPress={() => router.push(`/article/${artId}`)}
                      activeOpacity={0.8}
                      className="flex-row justify-between pb-6 border-b border-gray-100 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                    >
                      <View className="flex-1 pr-4 justify-between">
                        <View className="flex-row items-center mb-2 gap-2 flex-wrap">
                          <Badge label={catName.toUpperCase()} variant="blue" className="rounded-md" />
                        </View>
                        <Headline className="text-lg leading-tight mb-2 text-gray-900" numberOfLines={2}>
                          {title}
                        </Headline>
                        <Label className="text-[11px] text-gray-500">By {author}</Label>
                      </View>
                      <Image
                        source={{ uri: imageUri }}
                        className="w-24 h-24 rounded-xl bg-gray-200"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
        {/* Padding for Bottom Nav */}
        <View className="h-24 bg-[#F8F9FA]" />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
