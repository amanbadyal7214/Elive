import { useRouter } from 'expo-router';
import { Filter, Layers, Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/home/BottomNav';
import { Header } from '../components/home/Header';
import { Badge } from '../components/ui/Badge';
import { Headline, Label } from '../components/ui/Typography';

const filters = [
  {
    id: 'all',
    label: 'All',
    color: '#FFFFFF',
    bg: '#002249',
    subcategories: ['All', 'Trending', 'Guides', 'Opinions', 'Reports']
  },
  {
    id: 'career',
    label: 'Career & Skills',
    color: '#4F46E5',
    bg: '#4F46E5',
    subcategories: ['All', 'Leadership', 'Remote Work', 'Productivity', 'Tech Skills', 'Soft Skills']
  },
  {
    id: 'current',
    label: 'Current Affairs',
    color: '#002249',
    bg: '#002249',
    subcategories: ['All', 'Global Economy', 'Environment', 'Policy', 'Tech Trends']
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    color: '#059669',
    bg: '#059669',
    subcategories: ['All', 'Film & TV', 'Culture', 'Slow Living', 'Digital Art']
  },
];

const editorsPicks = [
  {
    id: 105,
    category: 'CAREER & SKILLS',
    categoryId: 'career',
    subcategory: 'Remote Work',
    badgeVariant: 'blue',
    readTime: '6 min read',
    title: 'The Architecture of Asynchronous Decision-Making',
    author: 'Marcus Vance',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&q=80',
  },
  {
    id: 106,
    category: 'CURRENT AFFAIRS',
    categoryId: 'current',
    subcategory: 'Environment',
    badgeVariant: 'red',
    readTime: '4 min read',
    title: 'Decarbonizing High Seas: How Marine Wind Kites Are Scaling',
    author: 'Elena Rostova',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80',
  },
  {
    id: 107,
    category: 'ENTERTAINMENT',
    categoryId: 'entertainment',
    subcategory: 'Slow Living',
    badgeVariant: 'green',
    readTime: '8 min read',
    title: 'Silence as Counter-Culture: Reclaiming Sacred Solitude in Tech',
    author: 'Julian Chen',
    image: 'https://images.unsplash.com/photo-1444464666168-49b626428bc5?w=400&q=80',
  },
  {
    id: 108,
    category: 'CAREER & SKILLS',
    categoryId: 'career',
    subcategory: 'Leadership',
    badgeVariant: 'blue',
    readTime: '5 min read',
    title: 'Modern Engineering Leadership: From IC to VP Strategy',
    author: 'Sophia Martinez',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
  },
  {
    id: 109,
    category: 'CURRENT AFFAIRS',
    categoryId: 'current',
    subcategory: 'Global Economy',
    badgeVariant: 'red',
    readTime: '7 min read',
    title: 'Macroeconomic Shifts in Emerging Semiconductor Markets',
    author: 'David Kim',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  const activeCategoryObj = filters.find(f => f.id === selectedCategory) || filters[0];

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory('All');
  };

  const filteredArticles = editorsPicks.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.categoryId === selectedCategory;
    const matchesSubCategory = selectedSubCategory === 'All' || article.subcategory === selectedSubCategory;
    const matchesSearch = searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSubCategory && matchesSearch;
  });

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

        {/* Explore By Desk */}
        <View className="py-4 border-b border-gray-100 bg-white">
          <View className="px-4 flex-row items-center justify-between mb-3">
            <Label className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">Explore By Desk</Label>
            {selectedCategory !== 'all' && (
              <TouchableOpacity onPress={() => { setSelectedCategory('all'); setSelectedSubCategory('All'); }}>
                <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">Reset Filters</Label>
              </TouchableOpacity>
            )}
          </View>

          {/* Main Categories Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
            {filters.map((filter) => {
              const isSelected = selectedCategory === filter.id;
              return (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => handleCategoryPress(filter.id)}
                  className={`flex-row items-center px-4 py-2.5 rounded-full mr-2.5 border ${isSelected
                      ? 'border-transparent'
                      : 'bg-gray-50 border-gray-200'
                    }`}
                  style={{
                    backgroundColor: isSelected ? filter.bg : '#F9FAFB',
                    ...(isSelected ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 } : {})
                  }}
                >
                  {!isSelected && filter.id !== 'all' && (
                    <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: filter.color }} />
                  )}
                  <Label className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {filter.label}
                  </Label>
                </TouchableOpacity>
              );
            })}
            <View className="w-4" />
          </ScrollView>

          {/* Subcategories Row */}
          {activeCategoryObj && activeCategoryObj.subcategories && (
            <View className="mt-4 pt-3 border-t border-gray-100 px-4">
              <View className="flex-row items-center mb-2.5">
                <Layers size={13} color="#6B7280" className="mr-1.5" />
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {activeCategoryObj.label} Subcategories
                </Label>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
                {activeCategoryObj.subcategories.map((sub, index) => {
                  const isSubActive = selectedSubCategory === sub;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSubCategory(sub)}
                      style={isSubActive ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 } : undefined}
                      className={`px-3.5 py-1.5 rounded-xl mr-2 flex-row items-center border ${isSubActive
                          ? 'bg-gray-900 border-gray-900'
                          : 'bg-gray-50 border-gray-200'
                        }`}
                    >
                      <Label className={`text-xs font-semibold ${isSubActive ? 'text-white' : 'text-gray-700'}`}>
                        {sub}
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

          {/* Editor's Selection */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {selectedCategory === 'all' ? "Editor's Selection" : `${activeCategoryObj.label}`}
              </Label>
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'}
              </Label>
            </View>
            <Headline className="text-2xl mb-6 font-serif">
              {selectedSubCategory !== 'All'
                ? `${selectedSubCategory} Articles`
                : selectedCategory !== 'all'
                  ? `${activeCategoryObj.label} Stories`
                  : 'Top Recommended For You'}
            </Headline>

            {filteredArticles.length === 0 ? (
              <View className="bg-white rounded-2xl p-8 items-center justify-center border border-gray-100 shadow-sm my-4">
                <Filter size={32} color="#9CA3AF" className="mb-3" />
                <Headline className="text-base text-gray-800 mb-1">No articles found</Headline>
                <Label className="text-xs text-gray-500 text-center mb-4">
                  No articles matched your selected category and subcategory.
                </Label>
                <TouchableOpacity
                  onPress={() => { setSelectedCategory('all'); setSelectedSubCategory('All'); setSearchQuery(''); }}
                  className="bg-primary px-5 py-2.5 rounded-full"
                >
                  <Label className="text-white text-xs font-bold">Clear Filters</Label>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-y-6">
                {filteredArticles.map((article) => (
                  <TouchableOpacity
                    key={article.id}
                    onPress={() => router.push(`/article/${article.id}`)}
                    activeOpacity={0.8}
                    className="flex-row justify-between pb-6 border-b border-gray-100"
                  >
                    <View className="flex-1 pr-4">
                      <View className="flex-row items-center mb-2 gap-2 flex-wrap">
                        <Badge label={article.category} variant={article.badgeVariant as any} className="rounded-md" />
                        <View className="bg-gray-100 px-2 py-0.5 rounded">
                          <Label className="text-[10px] font-semibold text-gray-600">{article.subcategory}</Label>
                        </View>
                        <Label className="text-[11px] text-gray-500">{article.readTime}</Label>
                      </View>
                      <Headline className="text-lg leading-tight mb-2 text-gray-900" numberOfLines={2}>
                        {article.title}
                      </Headline>
                      <Label className="text-[11px] text-gray-500">By {article.author}</Label>
                    </View>
                    <Image
                      source={{ uri: article.image }}
                      className="w-24 h-24 rounded-xl bg-gray-200"
                    />
                  </TouchableOpacity>
                ))}
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

