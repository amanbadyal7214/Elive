import { router } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Bookmark,
  Camera,
  Check,
  ChevronDown,
  Cloud,
  Eye,
  Italic,
  Link as LinkIcon,
  List,
  Plus,
  Quote,
  Share2,
  Sparkles,
  Upload
} from 'lucide-react-native';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Body, Headline, Label } from '../components/ui/Typography';

const categories = [
  'Career & Skills',
  'Current Affairs',
  'Technology & AI',
  'Entertainment & Arts',
  'Spiritual & Mindset',
];

export default function CreateArticleScreen() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState(
    'The shifting dynamics of professional growth demand more than routine adherence to established playbooks. As automated systems quietly assume operational weight, the primary differentiator shifts decisively toward editorial discernment, nuanced problem framing, and original synthesis.'
  );
  const [selectedCategory, setSelectedCategory] = useState('Career & Skills');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Tech Trends']);
  const [isPublished, setIsPublished] = useState(false);

  const availableTags = ['Tech Trends', 'Productivity', 'Leadership'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>

      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => currentStep > 1 ? setCurrentStep((currentStep - 1) as any) : router.back()} className="p-1">
            <ArrowLeft color="#121417" size={22} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Image
              source={require('../../assets/images/elive_logo_1.png')}
              style={{ width: 100, height: 26, resizeMode: 'contain' }}
            />
            <Label className="text-base font-bold text-gray-900 ml-1">Post Writer</Label>
          </View>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Bookmark color="#4B5563" size={20} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 color="#4B5563" size={20} />
          </TouchableOpacity>
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" size={30} />
        </View>
      </View>

      {/* Step Progress Tracker */}
      <View className="bg-[#F8F9FA] px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => setCurrentStep(1)} className="flex-1 items-center">
            <View className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep >= 1 ? 'bg-[#980000]' : 'bg-gray-200'}`}>
              <Label className={`text-xs font-bold ${currentStep >= 1 ? 'text-white' : 'text-gray-600'}`}>1</Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 1 ? 'text-[#980000]' : 'text-gray-500'}`}>Details</Label>
          </TouchableOpacity>

          <View className={`flex-1 h-0.5 -mt-4 ${currentStep >= 2 ? 'bg-[#980000]' : 'bg-gray-200'}`} />

          <TouchableOpacity onPress={() => setCurrentStep(2)} className="flex-1 items-center">
            <View className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep >= 2 ? 'bg-[#980000]' : 'bg-gray-200'}`}>
              <Label className={`text-xs font-bold ${currentStep >= 2 ? 'text-white' : 'text-gray-600'}`}>2</Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 2 ? 'text-[#980000]' : 'text-gray-500'}`}>Write</Label>
          </TouchableOpacity>

          <View className={`flex-1 h-0.5 -mt-4 ${currentStep >= 3 ? 'bg-[#980000]' : 'bg-gray-200'}`} />

          <TouchableOpacity onPress={() => setCurrentStep(3)} className="flex-1 items-center">
            <View className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep === 3 ? 'bg-[#980000]' : 'bg-gray-200'}`}>
              <Label className={`text-xs font-bold ${currentStep === 3 ? 'text-white' : 'text-gray-600'}`}>3</Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 3 ? 'text-[#980000]' : 'text-gray-500'}`}>Preview</Label>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-Header Action & Draft Status */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Label className="text-sm font-bold text-gray-600">Cancel</Label>
        </TouchableOpacity>

        <View className="flex-row items-center gap-1.5">
          <Cloud color="#10B981" size={16} />
          <Label className="text-xs text-gray-500 font-medium">Draft saved 1m ago</Label>
        </View>

        {currentStep < 3 ? (
          <TouchableOpacity
            onPress={() => setCurrentStep((currentStep + 1) as any)}
            className="bg-[#980000] flex-row items-center px-4 py-2 rounded-full shadow-sm"
            activeOpacity={0.9}
          >
            <Label className="text-white font-bold text-xs mr-1">
              {currentStep === 1 ? 'Next: Write' : 'Next: Preview'}
            </Label>
            <ArrowRight color="white" size={14} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handlePublish}
            className="bg-[#980000] flex-row items-center px-4 py-2 rounded-full shadow-sm"
            activeOpacity={0.9}
          >
            <Label className="text-white font-bold text-xs mr-1">
              {isPublished ? 'Publishing...' : 'Publish Article'}
            </Label>
            <Sparkles color="white" size={14} />
          </TouchableOpacity>
        )}
      </View>

      {/* Step Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >

          {/* STEP 1: Metadata & Details */}
          {currentStep === 1 && (
            <View>
              {/* Cover Image Container */}
              <View className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 items-center justify-center mb-6">
                <View className="w-12 h-12 rounded-full bg-red-50/80 items-center justify-center mb-3">
                  <Camera color="#002249" size={22} />
                </View>
                <Headline className="text-base text-gray-900 text-center mb-1 font-serif">
                  Add a high-resolution cover image
                </Headline>
                <Label className="text-xs text-gray-500 text-center mb-4 max-w-[280px]">
                  JPEG, WebP or PNG • 16:9 ratio recommended (min 1400px wide)
                </Label>
                <TouchableOpacity className="flex-row items-center bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                  <Upload color="#374151" size={16} className="mr-2" />
                  <Label className="text-xs font-bold text-gray-800">Upload Image</Label>
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Story Title</Label>
              <TextInput
                className="text-2xl font-serif font-bold text-[#980000] mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                placeholder="Title of your story or analysis..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                multiline
              />

              {/* Subtitle Input */}
              <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Subtitle / Summary</Label>
              <TextInput
                className="text-base font-serif text-gray-800 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                placeholder="Write a captivating subtitle or brief summary..."
                placeholderTextColor="#9CA3AF"
                value={subtitle}
                onChangeText={setSubtitle}
                multiline
              />

              {/* Editorial Desk & Topics Box */}
              <View className="bg-[#F8F9FA] rounded-2xl p-4 border border-gray-100 mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    Editorial Desk & Topics
                  </Label>
                  <Label className="text-[10px] font-bold text-[#002249] uppercase tracking-widest">
                    Required
                  </Label>
                </View>

                {/* Category Dropdown Selector */}
                <View className="relative mb-3">
                  <TouchableOpacity
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex-row items-center justify-between bg-white px-4 py-2.5 rounded-full border border-gray-200 self-start"
                  >
                    <Label className="text-xs font-bold text-gray-900 mr-2">{selectedCategory}</Label>
                    <ChevronDown color="#6B7280" size={16} />
                  </TouchableOpacity>

                  {showCategoryDropdown && (
                    <View className="bg-white rounded-xl border border-gray-200 shadow-lg mt-1 p-1 z-10">
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }}
                          className="px-3 py-2 rounded-lg hover:bg-gray-50 flex-row items-center justify-between"
                        >
                          <Label className="text-xs font-medium text-gray-800">{cat}</Label>
                          {selectedCategory === cat && <Check color="#002249" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* Tags Row */}
                <View className="flex-row flex-wrap items-center gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <TouchableOpacity
                        key={tag}
                        onPress={() => toggleTag(tag)}
                        className={`flex-row items-center px-3.5 py-1.5 rounded-full border ${isSelected
                            ? 'bg-[#3B4A6B] border-[#3B4A6B]'
                            : 'bg-white border-gray-200'
                          }`}
                      >
                        <Label className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                          {tag} {isSelected && '✓'}
                        </Label>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity className="flex-row items-center bg-white px-3 py-1.5 rounded-full border border-gray-200">
                    <Plus color="#4B5563" size={14} className="mr-1" />
                    <Label className="text-xs font-bold text-gray-700">Tag</Label>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Step 1 Next Button */}
              <TouchableOpacity
                onPress={() => setCurrentStep(2)}
                className="bg-[#980000] py-4 rounded-xl items-center justify-center flex-row shadow-sm mb-6"
              >
                <Label className="text-white font-bold text-base mr-2">Continue to Story Editor</Label>
                <ArrowRight color="white" size={18} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Write Story & Content */}
          {currentStep === 2 && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Main Article Body</Label>
                <Label className="text-xs font-medium text-emerald-600">Auto-saved</Label>
              </View>

              {/* Title Header snippet */}
              <Headline className="text-2xl font-serif font-bold text-gray-900 mb-2">
                {title || 'Untitled Story'}
              </Headline>
              {subtitle.length > 0 && (
                <Label className="text-sm font-serif text-gray-600 mb-4 italic">
                  {subtitle}
                </Label>
              )}

              {/* Article Main Body Input */}
              <TextInput
                className="text-base font-serif text-gray-800 leading-relaxed min-h-[320px] p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6"
                placeholder="Start writing your article..."
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />

              {/* Navigation buttons */}
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  onPress={() => setCurrentStep(1)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 items-center justify-center"
                >
                  <Label className="font-bold text-gray-700 text-sm">Back</Label>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCurrentStep(3)}
                  className="flex-1 bg-[#980000] py-3.5 rounded-xl items-center justify-center flex-row"
                >
                  <Label className="text-white font-bold text-sm mr-1">Preview Article</Label>
                  <Eye color="white" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: Review & Publish Preview */}
          {currentStep === 3 && (
            <View>
              <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 flex-row items-center">
                <Sparkles color="#059669" size={20} className="mr-3" />
                <View className="flex-1">
                  <Headline className="text-sm font-bold text-emerald-900 mb-0.5">Ready for publication</Headline>
                  <Label className="text-xs text-emerald-700">Review how your story will look to eLiveToday readers.</Label>
                </View>
              </View>

              {/* Article Preview Card */}
              <View className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <Badge label={selectedCategory.toUpperCase()} variant="red" className="rounded-md" />
                  <Label className="text-xs text-gray-500">{readTime} min read</Label>
                </View>

                <Headline className="text-2xl font-serif text-gray-900 mb-3">
                  {title || 'Untitled Story'}
                </Headline>

                {subtitle.length > 0 && (
                  <Label className="text-sm font-serif text-gray-600 mb-4 leading-relaxed">
                    {subtitle}
                  </Label>
                )}

                <View className="flex-row items-center mb-6 pt-2 border-t border-gray-100">
                  <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" size={36} className="mr-3" />
                  <View>
                    <Label className="text-sm font-bold text-gray-900">Sarah Jenkins</Label>
                    <Label className="text-xs text-gray-500">Staff Writer • Today</Label>
                  </View>
                </View>

                {/* Preview snippet */}
                <Body className="text-sm text-gray-700 leading-relaxed font-serif">
                  {content}
                </Body>
              </View>

              {/* Navigation & Publish */}
              <View className="flex-row gap-3 mb-6">
                <TouchableOpacity
                  onPress={() => setCurrentStep(2)}
                  className="flex-1 py-4 rounded-xl border border-gray-200 items-center justify-center"
                >
                  <Label className="font-bold text-gray-700 text-sm">Edit Content</Label>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePublish}
                  className="flex-1 bg-[#980000] py-4 rounded-xl items-center justify-center flex-row shadow-md"
                >
                  <Label className="text-white font-bold text-base mr-2">
                    {isPublished ? 'Published! ✓' : 'Publish Story'}
                  </Label>
                  {!isPublished && <ArrowRight color="white" size={18} />}
                </TouchableOpacity>
              </View>
            </View>
          )}

        </ScrollView>

        {/* STEP 2 Formatting Toolbar */}
        {currentStep === 2 && (
          <View className="flex-row items-center justify-between px-4 py-3 bg-white border-t border-gray-100 shadow-md">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity className="p-1">
                <Bold color="#4B5563" size={18} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <Italic color="#4B5563" size={18} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <LinkIcon color="#4B5563" size={18} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <Label className="font-bold text-gray-700 text-sm">H1</Label>
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <Label className="font-bold text-gray-700 text-sm">H2</Label>
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <Quote color="#4B5563" size={18} />
              </TouchableOpacity>
              <TouchableOpacity className="p-1">
                <List color="#4B5563" size={18} />
              </TouchableOpacity>
            </View>

            {/* Word Count Badge */}
            <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full">
              <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
              <Label className="text-xs font-medium text-gray-700">
                {wordCount} words · ~{readTime} min read
              </Label>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

