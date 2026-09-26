import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  Camera,
  Check,
  ChevronDown,
  Eye,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
  Share2,
  Sparkles,
  Upload
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Body, Headline, Label } from '../components/ui/Typography';
import { Category, SubCategory1, SubCategory2, useCategories } from '../hooks/useCategories';
import { useCreateArticle } from '../hooks/useCreateArticle';

export default function CreateArticleScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  // Dynamic Categories from API
  const { categories, loading: loadingCategories } = useCategories();
  const { createArticle, loading: submitting, error: submitError, success: submitSuccess } = useCreateArticle();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSub1, setSelectedSub1] = useState<SubCategory1 | null>(null);
  const [selectedSub2, setSelectedSub2] = useState<SubCategory2 | null>(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSub1Dropdown, setShowSub1Dropdown] = useState(false);
  const [showSub2Dropdown, setShowSub2Dropdown] = useState(false);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');

  const handlePickCoverImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access media library is required to pick a cover image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileObj = {
          uri: asset.uri,
          name: asset.fileName || 'cover.jpg',
          type: asset.mimeType || 'image/jpeg',
        };
        setImageUri(asset.uri);
        setSelectedImageFile(fileObj);
      }
    } catch (err) {
      console.error('[CreateArticle] Error picking image:', err);
    }
  };

  // Initialize selected category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategory) {
      const firstCat = categories[0];
      setSelectedCategory(firstCat);
      if (firstCat.subcategories_1 && firstCat.subcategories_1.length > 0) {
        const firstSub1 = firstCat.subcategories_1[0];
        setSelectedSub1(firstSub1);
        if (firstSub1.subcategories_2 && firstSub1.subcategories_2.length > 0) {
          setSelectedSub2(firstSub1.subcategories_2[0]);
        }
      }
    }
  }, [categories, selectedCategory]);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    setShowCategoryDropdown(false);

    // Reset subcategories
    if (cat.subcategories_1 && cat.subcategories_1.length > 0) {
      const firstSub1 = cat.subcategories_1[0];
      setSelectedSub1(firstSub1);
      if (firstSub1.subcategories_2 && firstSub1.subcategories_2.length > 0) {
        setSelectedSub2(firstSub1.subcategories_2[0]);
      } else {
        setSelectedSub2(null);
      }
    } else {
      setSelectedSub1(null);
      setSelectedSub2(null);
    }
  };

  const handleSelectSub1 = (sub1: SubCategory1) => {
    setSelectedSub1(sub1);
    setShowSub1Dropdown(false);
    if (sub1.subcategories_2 && sub1.subcategories_2.length > 0) {
      setSelectedSub2(sub1.subcategories_2[0]);
    } else {
      setSelectedSub2(null);
    }
  };

  const handleSelectSub2 = (sub2: SubCategory2) => {
    setSelectedSub2(sub2);
    setShowSub2Dropdown(false);
  };

  const safeContent = content || '';
  const safeTitle = title || '';
  const wordCount = safeContent.trim() ? safeContent.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  const handlePublishOrDraft = async (postStatus: 'Draft' | 'Published') => {
    if (!safeTitle.trim()) {
      alert('Please enter a Post title');
      return;
    }

    try {
      setStatus(postStatus);
      await createArticle({
        post_title: safeTitle.trim(),
        content: safeContent.trim(),
        category_id: selectedCategory ? selectedCategory.id : 1,
        subcategory_1_id: selectedSub1 ? selectedSub1.id : undefined,
        subcategory_2_id: selectedSub2 ? selectedSub2.id : undefined,
        status: postStatus,
        image: selectedImageFile || imageUri || 'article.jpg',
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      console.error('[CreateArticle] Error publishing:', err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() =>
              currentStep > 1 ? setCurrentStep((currentStep - 1) as any) : router.back()
            }
            className="p-1"
          >
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
            <Share2 color="#4B5563" size={20} />
          </TouchableOpacity>
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" size={30} />
        </View>
      </View>

      {/* Step Progress Tracker */}
      <View className="bg-[#F8F9FA] px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => setCurrentStep(1)} className="flex-1 items-center">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep >= 1 ? 'bg-[#002249]' : 'bg-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${currentStep >= 1 ? 'text-white' : 'text-gray-600'}`}>
                1
              </Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 1 ? 'text-[#002249]' : 'text-gray-500'}`}>
              Details
            </Label>
          </TouchableOpacity>

          <View className={`flex-1 h-0.5 -mt-4 ${currentStep >= 2 ? 'bg-[#002249]' : 'bg-gray-200'}`} />

          <TouchableOpacity onPress={() => setCurrentStep(2)} className="flex-1 items-center">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep >= 2 ? 'bg-[#002249]' : 'bg-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${currentStep >= 2 ? 'text-white' : 'text-gray-600'}`}>
                2
              </Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 2 ? 'text-[#002249]' : 'text-gray-500'}`}>
              Write
            </Label>
          </TouchableOpacity>

          <View className={`flex-1 h-0.5 -mt-4 ${currentStep >= 3 ? 'bg-[#002249]' : 'bg-gray-200'}`} />

          <TouchableOpacity onPress={() => setCurrentStep(3)} className="flex-1 items-center">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center mb-1 ${currentStep === 3 ? 'bg-[#002249]' : 'bg-gray-200'
                }`}
            >
              <Label className={`text-xs font-bold ${currentStep === 3 ? 'text-white' : 'text-gray-600'}`}>
                3
              </Label>
            </View>
            <Label className={`text-[10px] font-bold ${currentStep === 3 ? 'text-[#002249]' : 'text-gray-500'}`}>
              Preview
            </Label>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-Header Action & Draft Status */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Label className="text-sm font-bold text-gray-600">Cancel</Label>
        </TouchableOpacity>



        {currentStep < 3 ? (
          <TouchableOpacity
            onPress={() => setCurrentStep((currentStep + 1) as any)}
            className="bg-[#002249] flex-row items-center px-4 py-2 rounded-full shadow-sm"
            activeOpacity={0.9}
          >
            <Label className="text-white font-bold text-xs mr-1">
              {currentStep === 1 ? 'Next: Write' : 'Next: Preview'}
            </Label>
            <ArrowRight color="white" size={14} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={submitting}
            onPress={() => handlePublishOrDraft('Published')}
            className="bg-[#002249] flex-row items-center px-4 py-2 rounded-full shadow-sm"
            activeOpacity={0.9}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
            ) : (
              <>
                <Label className="text-white font-bold text-xs mr-1">
                  {submitSuccess ? 'Published! ✓' : 'Publish Article'}
                </Label>
                <Sparkles color="white" size={14} />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Step Content */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {submitError && (
            <View className="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
              <Label className="text-xs font-bold text-red-700">{submitError}</Label>
            </View>
          )}

          {submitSuccess && (
            <View className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-4 flex-row items-center">
              <Sparkles size={18} color="#059669" className="mr-2" />
              <Label className="text-xs font-bold text-emerald-800">
                Article posted successfully! Redirecting...
              </Label>
            </View>
          )}

          {/* STEP 1: Metadata & Details */}
          {currentStep === 1 && (
            <View>
              {/* Cover Image Container */}
              <TouchableOpacity
                onPress={handlePickCoverImage}
                activeOpacity={0.8}
                className="bg-[#F8F9FA] rounded-2xl border border-gray-200 overflow-hidden mb-6"
              >
                {imageUri ? (
                  <View className="relative w-full h-48">
                    <Image source={{ uri: imageUri }} className="w-full h-48 bg-gray-200" resizeMode="cover" />
                    <View className="absolute inset-0 bg-black/30 items-center justify-center">
                      <View className="flex-row items-center bg-white/90 px-4 py-2 rounded-full shadow-md">
                        <Camera color="#002249" size={16} className="mr-2" />
                        <Label className="text-xs font-bold text-gray-900">Change Cover Image</Label>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View className="p-6 items-center justify-center">
                    <View className="w-12 h-12 rounded-full bg-red-50/80 items-center justify-center mb-3">
                      <Camera color="#002249" size={22} />
                    </View>
                    <Headline className="text-base text-gray-900 text-center mb-1 font-serif">
                      Add a high-resolution cover image
                    </Headline>
                    <Label className="text-xs text-gray-500 text-center mb-4 max-w-[280px]">
                      JPEG, WebP or PNG • 16:9 ratio recommended (min 1400px wide)
                    </Label>
                    <View className="flex-row items-center bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                      <Upload color="#374151" size={16} className="mr-2" />
                      <Label className="text-xs font-bold text-gray-800">Select Cover Image</Label>
                    </View>
                  </View>
                )}
              </TouchableOpacity>

              {/* Title Input */}
              <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                Post Title *
              </Label>
              <TextInput
                className="text-2xl font-serif font-bold text-[#002249] mb-5 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                placeholder="Title of your post or analysis..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                multiline
              />

              {/* Subtitle Input */}
              <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
              Summary
              </Label>
              <TextInput
                className="text-base font-serif text-gray-800 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                placeholder="Write a captivating subtitle or brief summary..."
                placeholderTextColor="#9CA3AF"
                value={subtitle}
                onChangeText={setSubtitle}
                multiline
              />

              {/* Editorial Desk & Hierarchical Category Selectors */}
              <View className="bg-[#F8F9FA] rounded-2xl p-4 border border-gray-100 mb-6">
                <View className="flex-row items-center justify-between mb-4">
                  <Label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                    Category Hierarchy Selection
                  </Label>
                  <Label className="text-[10px] font-bold text-[#002249] uppercase tracking-widest">
                    Required
                  </Label>
                </View>

                {/* 1. Category Dropdown (category_id) */}
                <Label className="text-[11px] font-bold text-gray-600 mb-1">Main Category</Label>
                <View className="relative mb-4">
                  <TouchableOpacity
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="flex-row items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200"
                  >
                    <Label className="text-xs font-bold text-gray-900">
                      {selectedCategory ? selectedCategory.name : 'Select Category'}
                    </Label>
                    <ChevronDown color="#6B7280" size={16} />
                  </TouchableOpacity>

                  {showCategoryDropdown && (
                    <View className="bg-white rounded-xl border border-gray-200 shadow-lg mt-1 p-1 z-10">
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          onPress={() => handleSelectCategory(cat)}
                          className="px-3 py-2.5 rounded-lg flex-row items-center justify-between"
                        >
                          <Label className="text-xs font-medium text-gray-800">{cat.name}</Label>
                          {selectedCategory?.id === cat.id && <Check color="#002249" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* 2. Subcategory 1 Dropdown (subcategory_1_id) */}
                {selectedCategory?.subcategories_1 && selectedCategory.subcategories_1.length > 0 && (
                  <>
                    <Label className="text-[11px] font-bold text-gray-600 mb-1">
                      Subcategory Level 1
                    </Label>
                    <View className="relative mb-4">
                      <TouchableOpacity
                        onPress={() => setShowSub1Dropdown(!showSub1Dropdown)}
                        className="flex-row items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200"
                      >
                        <Label className="text-xs font-bold text-gray-900">
                          {selectedSub1 ? selectedSub1.name : 'Select Subcategory 1'}
                        </Label>
                        <ChevronDown color="#6B7280" size={16} />
                      </TouchableOpacity>

                      {showSub1Dropdown && (
                        <View className="bg-white rounded-xl border border-gray-200 shadow-lg mt-1 p-1 z-10">
                          {selectedCategory.subcategories_1.map((sub1) => (
                            <TouchableOpacity
                              key={sub1.id}
                              onPress={() => handleSelectSub1(sub1)}
                              className="px-3 py-2.5 rounded-lg flex-row items-center justify-between"
                            >
                              <Label className="text-xs font-medium text-gray-800">{sub1.name}</Label>
                              {selectedSub1?.id === sub1.id && <Check color="#002249" size={14} />}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                )}

                {/* 3. Subcategory 2 Dropdown (subcategory_2_id) */}
                {selectedSub1?.subcategories_2 && selectedSub1.subcategories_2.length > 0 && (
                  <>
                    <Label className="text-[11px] font-bold text-gray-600 mb-1">
                      Subcategory Level 2
                    </Label>
                    <View className="relative mb-2">
                      <TouchableOpacity
                        onPress={() => setShowSub2Dropdown(!showSub2Dropdown)}
                        className="flex-row items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200"
                      >
                        <Label className="text-xs font-bold text-gray-900">
                          {selectedSub2 ? selectedSub2.name : 'Select Subcategory 2'}
                        </Label>
                        <ChevronDown color="#6B7280" size={16} />
                      </TouchableOpacity>

                      {showSub2Dropdown && (
                        <View className="bg-white rounded-xl border border-gray-200 shadow-lg mt-1 p-1 z-10">
                          {selectedSub1.subcategories_2.map((sub2) => (
                            <TouchableOpacity
                              key={sub2.id}
                              onPress={() => handleSelectSub2(sub2)}
                              className="px-3 py-2.5 rounded-lg flex-row items-center justify-between"
                            >
                              <Label className="text-xs font-medium text-gray-800">{sub2.name}</Label>
                              {selectedSub2?.id === sub2.id && <Check color="#002249" size={14} />}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>

              {/* Step 1 Next Button */}
              <TouchableOpacity
                onPress={() => setCurrentStep(2)}
                className="bg-[#002249] py-4 rounded-xl items-center justify-center flex-row shadow-sm mb-6"
              >
                <Label className="text-white font-bold text-base mr-2">Continue to Story Editor</Label>
                <ArrowRight color="white" size={18} />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: Write Story & Content */}
          {currentStep === 2 && (
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Main Article Body
                </Label>
                <Label className="text-xs font-medium text-emerald-600">Auto-saved</Label>
              </View>

              {/* Title Header snippet */}
              <Headline className="text-xl font-serif font-bold text-gray-900 mb-1">
                {title || 'Untitled Post'}
              </Headline>
              {subtitle.length > 0 && (
                <Label className="text-xs font-serif text-gray-600 mb-3 italic">{subtitle}</Label>
              )}

              {/* Formatting Toolbar directly above input */}
              <View className="flex-row items-center justify-between bg-gray-100 p-2 rounded-2xl border border-gray-200 mb-3 px-3">
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => setContent((prev) => prev + ' **bold text** ')}
                    className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <Bold size={16} color="#002249" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setContent((prev) => prev + ' *italic text* ')}
                    className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <Italic size={16} color="#002249" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setContent((prev) => prev + '\n- Item 1\n- Item 2\n')}
                    className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <List size={16} color="#002249" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setContent((prev) => prev + '\n> Quote text here\n')}
                    className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <Quote size={16} color="#002249" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setContent((prev) => prev + ' [link text](https://example.com) ')}
                    className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <LinkIcon size={16} color="#002249" />
                  </TouchableOpacity>
                </View>

                <Label className="text-[11px] font-mono text-gray-500">{wordCount} words</Label>
              </View>

              {/* Article Main Body Input */}
              <TextInput
                className="text-base font-serif text-gray-800 leading-relaxed min-h-[300px] p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6"
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
                  className="flex-1 bg-[#002249] py-3.5 rounded-xl items-center justify-center flex-row"
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
                  <Headline className="text-sm font-bold text-emerald-900 mb-0.5">
                    Ready for publication
                  </Headline>
                  <Label className="text-xs text-emerald-700">
                    Review how your story will look to eLiveToday readers.
                  </Label>
                </View>
              </View>

              {/* Article Preview Card */}
              <View className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-6">
                <View className="flex-row items-center gap-2 mb-3 flex-wrap">
                  <Badge
                    label={(selectedCategory?.name || 'GENERAL').toUpperCase()}
                    variant="red"
                    className="rounded-md"
                  />
                  {selectedSub1 && (
                    <Badge label={selectedSub1.name.toUpperCase()} variant="blue" className="rounded-md" />
                  )}
                  {selectedSub2 && (
                    <Badge label={selectedSub2.name.toUpperCase()} variant="green" className="rounded-md" />
                  )}
                  <Label className="text-xs text-gray-500">{readTime} min read</Label>
                </View>

                <Headline className="text-2xl font-serif text-gray-900 mb-3">
                  {title || 'Untitled Post'}
                </Headline>

                {subtitle.length > 0 && (
                  <Label className="text-sm font-serif text-gray-600 mb-4 leading-relaxed">
                    {subtitle}
                  </Label>
                )}

                <View className="flex-row items-center mb-6 pt-2 border-t border-gray-100">
                  <Avatar
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                    size={36}
                    className="mr-3"
                  />
                  <View>
                    <Label className="text-sm font-bold text-gray-900">Sarah Jenkins</Label>
                    <Label className="text-xs text-gray-500">Staff Writer • Today</Label>
                  </View>
                </View>

                {/* Preview snippet */}
                <Body className="text-sm text-gray-700 leading-relaxed font-serif">{content}</Body>
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
                  disabled={submitting}
                  onPress={() => handlePublishOrDraft('Published')}
                  className="flex-1 bg-[#002249] py-4 rounded-xl items-center justify-center flex-row shadow-md"
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" className="mr-2" />
                  ) : (
                    <>
                      <Label className="text-white font-bold text-base mr-2">
                        {submitSuccess ? 'Published! ✓' : 'Publish Story'}
                      </Label>
                      {!submitSuccess && <ArrowRight color="white" size={18} />}
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>


      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
