import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  AtSign,
  Camera,
  Check,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Lock,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  Sun,
  User as UserIcon,
  X
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomNav } from '../components/home/BottomNav';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Body, Headline, Label } from '../components/ui/Typography';
import useAuth, { clearAuthData, User } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { useUserArticles } from '../hooks/useUserArticles';
import { getStorageItem } from '../utils/storage';

function formatAvatarUrl(raw?: string | null): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300';
  }
  if (
    raw.startsWith('http://') ||
    raw.startsWith('https://') ||
    raw.startsWith('file://') ||
    raw.startsWith('data:')
  ) {
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

const articles = [
  {
    id: 1,
    category: 'COGNITIVE ECOLOGY',
    categoryVariant: 'red',
    meta: 'May 14 · 8 min read',
    title: 'The Illusion of Synchrony: Remote Work Rituals and...',
    excerpt: 'Why our modern communication stacks reward instant response over profound...',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&q=80',
    claps: '1.8k',
    views: '14.2k',
    comments: 64,
  },
  {
    id: 2,
    category: 'WORKPLACE SHIFTS',
    categoryVariant: 'blue',
    meta: 'Apr 28 · 5 min read',
    title: 'Algorithmic Empathy: When Executive Co-pilots...',
    excerpt: 'Analyzing the linguistic homogeneity creeping into enterprise town halls when...',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&q=80',
    claps: '940',
    views: '8.6k',
    comments: 28,
  },
  {
    id: 3,
    category: 'DIGITAL ETHICS',
    categoryVariant: 'green',
    meta: 'Apr 11 · 11 min read',
    title: 'The Right to Be Unprocessed: A Manifesto...',
    excerpt: 'Examining biometric telemetry in modern creative suites and the growing pushbac...',
    image: 'https://images.unsplash.com/photo-1444464666168-49b626428bc5?w=300&q=80',
    claps: '3.1k',
    views: '22.4k',
    comments: 112,
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { login, register, verifyOtp, resendVerification, loading, error, clearError } = useAuth();
  const { updateProfile, loading: updating, error: updateError, success: updateSuccess } = useUpdateProfile();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const {
    articles: userArticles,
    loading: userArticlesLoading,
    loadingMore: userArticlesLoadingMore,
    error: userArticlesError,
    hasMore: userArticlesHasMore,
    loadMore: loadMoreUserArticles,
    refetch: refetchUserArticles,
  } = useUserArticles(currentUser?.id);

  const [activeTab, setActiveTab] = useState<'signIn' | 'create'>('signIn');
  const [showOtpView, setShowOtpView] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'articles' | 'responses'>('articles');

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  // Edit Profile Modal Form State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [editGender, setEditGender] = useState('Male');
  const [editMobile, setEditMobile] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);

  // Check saved user session on mount
  useEffect(() => {
    async function loadSavedSession() {
      const savedUserStr = await getStorageItem('user');
      const savedToken = await getStorageItem('token');
      if (savedUserStr && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setCurrentUser(parsedUser);
          setIsLoggedIn(true);
        } catch (e) {
          console.error('[Profile] Error parsing stored user:', e);
        }
      }
    }
    loadSavedSession();
  }, []);

  // Pre-fill edit modal when opened
  const handleOpenEditModal = () => {
    if (currentUser) {
      setEditFullName(currentUser.full_name || '');
      setEditGender(currentUser.gender || 'Male');
      setEditMobile(currentUser.mobile || '');
      setEditDescription(currentUser.description || '');
      setEditImagePreview(formatAvatarUrl(currentUser.image));
      setSelectedImageFile(null);
    }
    setShowEditModal(true);
  };

  // Pick image from Device Gallery / Camera
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Permission to access photos is required to pick a profile image');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageFileObj = {
          uri: asset.uri,
          name: asset.fileName || 'profile.jpg',
          type: asset.mimeType || 'image/jpeg',
        };
        setSelectedImageFile(imageFileObj);
        setEditImagePreview(asset.uri);
      }
    } catch (err) {
      console.error('[Profile] Error picking image:', err);
    }
  };

  // Submit Profile Update (PUT /api/auth/profile)
  const handleSaveProfile = async () => {
    try {
      const updatedUser = await updateProfile({
        full_name: editFullName.trim(),
        gender: editGender,
        mobile: editMobile.trim(),
        description: editDescription.trim(),
        image: selectedImageFile || editImagePreview || undefined,
      });

      const newImageUrl = updatedUser.image || selectedImageFile?.uri || editImagePreview || currentUser?.image;

      setCurrentUser((prev) => ({
        ...prev,
        ...updatedUser,
        full_name: editFullName.trim(),
        gender: editGender,
        mobile: editMobile.trim(),
        description: editDescription.trim(),
        image: newImageUrl,
      }));

      setTimeout(() => {
        setShowEditModal(false);
      }, 1200);
    } catch (err: any) {
      console.error('[Profile] Profile update error:', err);
    }
  };

  // 1. Sign In Handler
  const handleSignIn = async () => {
    setLocalMessage(null);
    if (!email.trim() || !password.trim()) {
      setLocalMessage('Please enter both email and password.');
      return;
    }

    try {
      const res = await login({ email: email.trim(), password: password.trim() });
      if (res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      // Error handled by useAuth
    }
  };

  // 2. Register Handler
  const handleRegister = async () => {
    setLocalMessage(null);
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setLocalMessage('Please fill in all required fields.');
      return;
    }
    if (!termsAgreed) {
      setLocalMessage('Please agree to the Terms & Privacy Policy.');
      return;
    }

    try {
      const res = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      if (res.verification_required || res.success) {
        setShowOtpView(true);
      }
    } catch (err: any) {
      // Error handled by useAuth
    }
  };

  // 3. Verify OTP Handler
  const handleVerifyOtp = async () => {
    setLocalMessage(null);
    if (!otp.trim()) {
      setLocalMessage('Please enter the verification OTP.');
      return;
    }

    try {
      const res = await verifyOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      if (res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        setShowOtpView(false);
      }
    } catch (err: any) {
      // Error handled by useAuth
    }
  };

  // 4. Resend OTP Handler
  const handleResendOtp = async () => {
    setLocalMessage(null);
    try {
      const res = await resendVerification({ email: email.trim() });
      setLocalMessage(res.message || 'Verification code resent successfully.');
    } catch (err: any) {
      // Error handled by useAuth
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    await clearAuthData();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowOtpView(false);
    setOtp('');
    setPassword('');
    clearError();
    setLocalMessage(null);
  };

  // Logged-in Profile View
  if (isLoggedIn) {
    return (
      <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
        {/* Profile Top Navigation Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <View className="flex-row items-center gap-2">
            <Image
              source={require('../../assets/images/elive_logo_1.png')}
              style={{ width: 110, height: 28, resizeMode: 'contain' }}
            />
            <View className="bg-gray-100 px-2 py-0.5 rounded-md">
              <Label className="text-[10px] font-bold text-primary tracking-wider uppercase">PROFILE</Label>
            </View>
          </View>

          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.push('/explore')}>
              <Search color="#121417" size={20} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Sun color="#121417" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <LogOut color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Profile Hero Card */}
          <View className="px-4 pt-4 mb-5">
            <View
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
              style={{
                elevation: 2,
                shadowColor: '#002249',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
              }}
            >
              {/* Avatar & Main Info */}
              <View>
                <View className="flex-row justify-between items-start mb-4">
                  <View className="relative">
                    <Avatar
                      src={formatAvatarUrl(currentUser?.image)}
                      size={80}
                      className="border-2 border-white shadow-md"
                    />
                    <View className="absolute bottom-0 right-0 bg-[#002249] rounded-full p-1 border-2 border-white shadow-sm">
                      <CheckCircle2 color="#38BDF8" size={14} />
                    </View>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={handleOpenEditModal}
                      className="bg-[#002249] flex-row items-center px-4 py-2.5 rounded-full shadow-md"
                      activeOpacity={0.85}
                    >
                      <Edit3 color="white" size={14} className="mr-1.5" />
                      <Label className="text-white font-bold text-xs">Edit Profile</Label>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Name & Title */}
                <View className="mb-3">
                  <Headline className="text-2xl font-serif font-bold text-gray-900 mb-1">
                    {currentUser?.full_name || 'Mohd Usman'}
                  </Headline>

                  <View className="flex-row flex-wrap items-center gap-2 mb-2">
                    <Label className="text-xs font-mono text-gray-500">
                      {currentUser?.email ? `@${currentUser.email.split('@')[0]}` : '@usman'}
                    </Label>
                    <View className="w-1 h-1 rounded-full bg-gray-300" />
                    <View className="bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex-row items-center">
                      <Label className="text-[10px] font-bold text-[#002249]">
                        {currentUser?.gender ? `${currentUser.gender} • Verified Author` : 'Verified Member'}
                      </Label>
                    </View>
                  </View>

                  {currentUser?.mobile ? (
                    <View className="flex-row items-center gap-1.5 mt-0.5">
                      <Phone color="#6B7280" size={12} />
                      <Label className="text-xs text-gray-600 font-mono">{currentUser.mobile}</Label>
                    </View>
                  ) : null}
                </View>

                {/* Bio / Description */}
                {currentUser?.description ? (
                  <View className="bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 mb-5 border-l-4 border-l-[#002249]">
                    <Body className="text-xs text-gray-700 leading-relaxed font-serif">
                      {currentUser.description}
                    </Body>
                  </View>
                ) : null}

                {/* Profile Stats Bar */}
                <View className="bg-slate-50/90 rounded-2xl p-3 flex-row justify-around border border-slate-100">
                  <View className="items-center flex-1 border-r border-slate-200">
                    <Label className="text-base font-bold text-[#002249]">{userArticles.length}</Label>
                    <Label className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Articles</Label>
                  </View>
                  <View className="items-center flex-1 border-r border-slate-200">
                    <Label className="text-base font-bold text-[#002249]">
                      {userArticles.reduce((acc, curr) => acc + (Number(curr.views) || Number(curr.views_count) || 0), 0)}
                    </Label>
                    <Label className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Reads</Label>
                  </View>
                  <View className="items-center flex-1">
                    <Label className="text-base font-bold text-emerald-600">Active</Label>
                    <Label className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Status</Label>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Segmented Tabs Bar */}
          <View className="px-4 mb-6">
            <View className="flex-row bg-gray-200/80 rounded-2xl p-1">
              <TouchableOpacity
                onPress={() => setActiveProfileTab('articles')}
                style={
                  activeProfileTab === 'articles'
                    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }
                    : undefined
                }
                className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${activeProfileTab === 'articles' ? 'bg-white' : ''
                  }`}
              >
                <Label className={`font-bold text-xs ${activeProfileTab === 'articles' ? 'text-[#002249]' : 'text-gray-600'}`}>
                  My Articles
                </Label>
                <View className={`ml-1.5 px-1.5 py-0.2 rounded-full ${activeProfileTab === 'articles' ? 'bg-red-100' : 'bg-gray-300'}`}>
                  <Label className={`text-[9px] font-bold ${activeProfileTab === 'articles' ? 'text-[#002249]' : 'text-gray-700'}`}>
                    {userArticlesLoading ? '...' : userArticles.length}
                  </Label>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveProfileTab('responses')}
                style={
                  activeProfileTab === 'responses'
                    ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }
                    : undefined
                }
                className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center ${activeProfileTab === 'responses' ? 'bg-white' : ''
                  }`}
              >
                <Label className={`font-bold text-xs ${activeProfileTab === 'responses' ? 'text-[#002249]' : 'text-gray-600'}`}>
                  Responses
                </Label>
                <View className="ml-1.5 px-1.5 py-0.2 rounded-full bg-gray-300">
                  <Label className="text-[9px] font-bold text-gray-700">95</Label>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Published Works Header */}
          <View className="px-4 flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Headline className="text-lg font-serif text-gray-900 mr-2">Published Works</Headline>
              <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">• MOST RECENT</Label>
            </View>
            <TouchableOpacity onPress={refetchUserArticles} className="p-1">
              <RefreshCw color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>

          {/* Published Works Article Cards */}
          <View className="px-4 gap-y-4 mb-6">
            {userArticlesLoading ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator size="large" color="#002249" />
                <Label className="text-xs text-gray-500 mt-2 font-medium">Loading your articles...</Label>
              </View>
            ) : userArticlesError ? (
              <View className="bg-red-50 p-4 rounded-2xl border border-red-200 items-center">
                <Label className="text-xs text-red-600 font-bold mb-2">{userArticlesError}</Label>
                <TouchableOpacity onPress={refetchUserArticles} className="bg-red-100 px-3 py-1.5 rounded-lg">
                  <Label className="text-xs text-red-700 font-bold">Try Again</Label>
                </TouchableOpacity>
              </View>
            ) : userArticles.length === 0 ? (
              <View className="bg-white rounded-3xl p-6 border border-gray-100 items-center justify-center">
                <Label className="text-sm font-bold text-gray-700 mb-1">No articles found</Label>
                <Label className="text-xs text-gray-500 text-center mb-4">You have not published any articles yet.</Label>
                <TouchableOpacity
                  onPress={() => router.push('/create')}
                  className="bg-[#002249] px-4 py-2 rounded-xl"
                >
                  <Label className="text-xs text-white font-bold">Write an Article</Label>
                </TouchableOpacity>
              </View>
            ) : (
              userArticles.map((item, index) => {
                const title = typeof item.title === 'string' ? item.title : item.post_title || 'Untitled Article';
                const catName = typeof item.category === 'string' ? item.category : item.category?.name || 'General';
                const rawContent = item.content || item.description || item.excerpt || '';
                const cleanExcerpt = rawContent.replace(/<[^>]*>?/gm, '').trim();
                const imageUri = formatAvatarUrl(item.image || item.imageUrl || item.coverImage);
                const artId = item.id || item._id || index;

                return (
                  <TouchableOpacity
                    key={artId}
                    onPress={() => router.push(`/article/${artId}`)}
                    activeOpacity={0.9}
                    className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
                  >
                    <View className="flex-row justify-between mb-3">
                      <View className="flex-1 pr-3">
                        <View className="flex-row items-center gap-2 mb-2">
                          <Badge label={catName.toUpperCase()} variant="blue" className="rounded-md" />
                          <Label className="text-[11px] text-gray-500">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                          </Label>
                        </View>

                        <Headline className="text-base font-serif font-bold text-gray-900 leading-snug mb-2" numberOfLines={2}>
                          {title}
                        </Headline>

                        <Label className="text-xs text-gray-600 font-serif leading-relaxed" numberOfLines={2}>
                          {cleanExcerpt || 'No excerpt available'}
                        </Label>
                      </View>

                      <Image source={{ uri: imageUri }} className="w-20 h-20 rounded-2xl bg-gray-100" />
                    </View>

                    {/* Article Footer Stats */}
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1">
                          <Heart color="#002249" size={14} />
                          <Label className="text-xs text-gray-600 font-medium">{item.claps || item.likes_count || 0} claps</Label>
                        </View>

                        <View className="flex-row items-center gap-1">
                          <Eye color="#6B7280" size={14} />
                          <Label className="text-xs text-gray-600 font-medium">{item.views || item.views_count || 0} views</Label>
                        </View>

                        <View className="flex-row items-center gap-1">
                          <MessageSquare color="#6B7280" size={14} />
                          <Label className="text-xs text-gray-600 font-medium">{item.comments || item.comments_count || 0}</Label>
                        </View>
                      </View>

                      <TouchableOpacity className="p-1">
                        <MoreHorizontal color="#9CA3AF" size={18} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* EDIT PROFILE MODAL FORM (PUT /api/auth/profile) */}
        <Modal visible={showEditModal} animationType="slide" transparent>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%] border-t border-gray-100 shadow-2xl">
              {/* Modal Header */}
              <View className="flex-row items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <Headline className="text-xl font-bold font-serif text-gray-900">Edit Profile</Headline>
                <TouchableOpacity onPress={() => setShowEditModal(false)} className="p-1">
                  <X size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {updateError && (
                  <View className="bg-red-50 p-3.5 rounded-xl border border-red-200 mb-4">
                    <Label className="text-xs font-bold text-red-700">{updateError}</Label>
                  </View>
                )}

                {updateSuccess && (
                  <View className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 mb-4">
                    <Label className="text-xs font-bold text-emerald-800">Profile updated successfully! ✓</Label>
                  </View>
                )}

                {/* Avatar Preview & Photo Picker */}
                <View className="items-center mb-5">
                  <View className="relative">
                    <Avatar
                      src={formatAvatarUrl(editImagePreview || currentUser?.image)}
                      size={88}
                      className="border-2 border-[#002249]"
                    />
                    <TouchableOpacity
                      onPress={handlePickImage}
                      className="absolute bottom-0 right-0 bg-[#002249] p-2.5 rounded-full border-2 border-white shadow-md"
                    >
                      <Camera size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handlePickImage} className="mt-2">
                    <Label className="text-xs font-bold text-[#002249]">Tap camera icon to select photo</Label>
                  </TouchableOpacity>
                </View>

                {/* Full Name */}
                <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Full Name</Label>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                  <View style={{ marginRight: 12 }}>
                    <UserIcon size={18} color="#6B7280" />
                  </View>
                  <TextInput
                    className="flex-1 text-sm text-gray-900 font-sans pl-1"
                    placeholder="Mohd Usman"
                    placeholderTextColor="#9CA3AF"
                    value={editFullName}
                    onChangeText={setEditFullName}
                  />
                </View>

                {/* Gender Selector */}
                <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Gender</Label>
                <View className="flex-row gap-2 mb-4">
                  {['Male', 'Female', 'Other'].map((g) => {
                    const isSelected = editGender.toLowerCase() === g.toLowerCase();
                    return (
                      <TouchableOpacity
                        key={g}
                        onPress={() => setEditGender(g)}
                        className={`flex-1 py-2.5 rounded-xl border items-center ${isSelected ? 'bg-[#002249] border-[#002249]' : 'bg-gray-50 border-gray-200'
                          }`}
                      >
                        <Label className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>{g}</Label>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Mobile Number */}
                <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Mobile Number</Label>
                <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200">
                  <View style={{ marginRight: 12 }}>
                    <Phone size={18} color="#6B7280" />
                  </View>
                  <TextInput
                    className="flex-1 text-sm text-gray-900 font-sans pl-1"
                    placeholder="9876543210"
                    placeholderTextColor="#9CA3AF"
                    value={editMobile}
                    onChangeText={setEditMobile}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Description / Bio */}
                <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-1.5">Bio / Description</Label>
                <TextInput
                  className="text-sm font-sans text-gray-900 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6 min-h-[90px]"
                  placeholder="Full Stack Developer..."
                  placeholderTextColor="#9CA3AF"
                  value={editDescription}
                  onChangeText={setEditDescription}
                  multiline
                  textAlignVertical="top"
                />

                {/* Submit Action Buttons */}
                <View className="flex-row gap-3 mb-4">
                  <TouchableOpacity
                    onPress={() => setShowEditModal(false)}
                    className="flex-1 py-3.5 rounded-xl border border-gray-200 items-center justify-center"
                  >
                    <Label className="font-bold text-gray-700 text-sm">Cancel</Label>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={updating}
                    onPress={handleSaveProfile}
                    className="flex-1 bg-[#002249] py-3.5 rounded-xl items-center justify-center flex-row shadow-sm"
                  >
                    {updating ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Label className="text-white font-bold text-sm">Save Changes</Label>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Fixed Bottom Navigation */}
        <View className="absolute bottom-0 left-0 right-0">
          <BottomNav />
        </View>
      </SafeAreaView>
    );
  }

  // Auth View (Shown when isLoggedIn === false)
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Hero Header */}
          <View className="items-center px-6 pt-8 pb-4">
            <View className="bg-gray-100 rounded-2xl p-4 mb-4">
              <Image
                source={require('../../assets/images/elive_logo_1.png')}
                style={{ width: 120, height: 30, resizeMode: 'contain' }}
              />
            </View>
            <Headline className="text-3xl text-center font-serif text-gray-900 mb-2">
              {showOtpView ? 'Verify Your Email' : activeTab === 'signIn' ? 'Welcome to eLiveToday' : 'Join eLiveToday'}
            </Headline>
            <Label className="text-sm text-center text-gray-600 leading-relaxed px-4 font-serif">
              {showOtpView
                ? `Enter the 6-digit verification code sent to ${email}`
                : activeTab === 'signIn'
                  ? 'Sign in to access personalized feeds, save articles, and engage with the community.'
                  : 'Create a free account to personalize your feed, save stories, and join the discussion.'}
            </Label>
          </View>

          {/* Auth Navigation Tabs */}
          {!showOtpView && (
            <View className="px-4 mb-4">
              <View className="flex-row bg-gray-200 rounded-xl p-1">
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab('signIn');
                    clearError();
                    setLocalMessage(null);
                  }}
                  style={
                    activeTab === 'signIn'
                      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }
                      : undefined
                  }
                  className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'signIn' ? 'bg-white' : ''}`}
                >
                  <Label className={`font-bold text-sm ${activeTab === 'signIn' ? 'text-gray-900' : 'text-gray-500'}`}>Sign In</Label>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab('create');
                    clearError();
                    setLocalMessage(null);
                  }}
                  style={
                    activeTab === 'create'
                      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 }
                      : undefined
                  }
                  className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'create' ? 'bg-white' : ''}`}
                >
                  <Label className={`font-bold text-sm ${activeTab === 'create' ? 'text-gray-900' : 'text-gray-500'}`}>Create Account</Label>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Form Card */}
          <View className="px-4 mb-6">
            <View
              className="bg-white rounded-3xl p-6 border border-gray-100"
              style={{ elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 }}
            >
              {(error || localMessage) && (
                <View
                  className={`px-4 py-3 rounded-xl mb-4 ${error ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
                    }`}
                >
                  <Label className={`text-xs ${error ? 'text-red-600 font-bold' : 'text-blue-700 font-medium'}`}>
                    {error || localMessage}
                  </Label>
                </View>
              )}

              {/* View 1: OTP Verification Screen */}
              {showOtpView ? (
                <>
                  <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Enter Verification OTP</Label>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3.5 mb-5 border border-gray-100">
                    <View style={{ marginRight: 12 }}>
                      <KeyRound size={18} color="#4B5563" />
                    </View>
                    <TextInput
                      className="flex-1 text-sm text-gray-900 font-sans tracking-widest"
                      placeholder="123456"
                      placeholderTextColor="#9CA3AF"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleVerifyOtp}
                    disabled={loading}
                    className="bg-[#002249] flex-row items-center justify-center rounded-xl py-4 mb-4"
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Label className="text-white font-bold text-base mr-2">Verify Email</Label>
                        <ArrowRight size={18} color="white" />
                      </>
                    )}
                  </TouchableOpacity>

                  <View className="flex-row items-center justify-between mt-2">
                    <TouchableOpacity onPress={handleResendOtp} disabled={loading} className="flex-row items-center">
                      <RefreshCw size={14} color="#002249" className="mr-1.5" />
                      <Label className="text-xs font-bold text-[#002249]">Resend Code</Label>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowOtpView(false)}>
                      <Label className="text-xs text-gray-500 font-medium">Back to Form</Label>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                /* View 2: Sign In / Register Forms */
                <>
                  {activeTab === 'create' && (
                    <>
                      <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</Label>
                      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3.5 mb-5 border border-gray-100">
                        <View style={{ marginRight: 12 }}>
                          <UserIcon size={18} color="#4B5563" />
                        </View>
                        <TextInput
                          className="flex-1 text-sm text-gray-900 font-sans"
                          placeholder="Mohd Usman"
                          placeholderTextColor="#9CA3AF"
                          value={fullName}
                          onChangeText={setFullName}
                        />
                      </View>
                    </>
                  )}

                  <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">
                    Email Address
                  </Label>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3.5 mb-5 border border-gray-100">
                    <View style={{ marginRight: 12 }}>
                      <AtSign size={18} color="#4B5563" />
                    </View>
                    <TextInput
                      className="flex-1 text-sm text-gray-900 font-sans"
                      placeholder="usman@example.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>

                  <Label className="text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-2">Password</Label>
                  <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3.5 mb-5 border border-gray-100">
                    <View style={{ marginRight: 12 }}>
                      <Lock size={18} color="#4B5563" />
                    </View>
                    <TextInput
                      className="flex-1 text-sm text-gray-900 font-sans"
                      placeholder="••••••••"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                      {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                    </TouchableOpacity>
                  </View>

                  {activeTab === 'signIn' ? (
                    <View className="flex-row items-center justify-between mb-6">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => setRememberMe(!rememberMe)}
                        activeOpacity={0.8}
                      >
                        <View
                          className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${rememberMe ? 'bg-[#002249] border-[#002249]' : 'bg-white border-gray-300'
                            }`}
                        >
                          {rememberMe && <Check size={12} color="white" />}
                        </View>
                        <Label className="text-sm text-gray-600">Remember me</Label>
                      </TouchableOpacity>
                      <TouchableOpacity>
                        <Label className="text-sm font-bold text-[#002249]">Forgot password?</Label>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row items-center mb-6">
                      <TouchableOpacity
                        className="flex-row items-center"
                        onPress={() => setTermsAgreed(!termsAgreed)}
                        activeOpacity={0.8}
                      >
                        <View
                          className={`w-5 h-5 rounded flex items-center justify-center mr-2 border ${termsAgreed ? 'bg-[#002249] border-[#002249]' : 'bg-white border-gray-300'
                            }`}
                        >
                          {termsAgreed && <Check size={12} color="white" />}
                        </View>
                        <Label className="text-sm text-gray-600">I agree to Terms & Privacy Policy</Label>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={activeTab === 'signIn' ? handleSignIn : handleRegister}
                    disabled={loading}
                    className="bg-[#002249] flex-row items-center justify-center rounded-xl py-4 mb-6"
                    activeOpacity={0.9}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Label className="text-white font-bold text-base mr-2">
                          {activeTab === 'signIn' ? 'Sign In to Account' : 'Create Account'}
                        </Label>
                        <ArrowRight size={18} color="white" />
                      </>
                    )}
                  </TouchableOpacity>

                  <View className="flex-row items-center justify-center mb-6">
                    <View className="flex-1 h-px bg-gray-200" />
                    <Label className="mx-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Or Continue With</Label>
                    <View className="flex-1 h-px bg-gray-200" />
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-50 rounded-xl py-3.5 border border-gray-100">
                      <View className="w-4 h-4 rounded-full border-2 border-red-500 mr-2 items-center justify-center">
                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </View>
                      <Label className="font-bold text-sm text-gray-800">Google</Label>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-50 rounded-xl py-3.5 border border-gray-100">
                      <View className="w-4 h-4 rounded-full bg-gray-800 mr-2" />
                      <Label className="font-bold text-sm text-gray-800">Apple</Label>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Footer Links */}
          <View className="items-center px-8 mb-6">
            <View className="flex-row items-center mb-4">
              <Label className="text-sm text-gray-600 mr-1">
                {activeTab === 'signIn' ? "Don't have an account yet?" : 'Already have an account?'}
              </Label>
              <TouchableOpacity
                onPress={() => {
                  setActiveTab(activeTab === 'signIn' ? 'create' : 'signIn');
                  clearError();
                  setLocalMessage(null);
                  setShowOtpView(false);
                }}
              >
                <Label className="text-sm font-bold text-[#002249]">
                  {activeTab === 'signIn' ? 'Register now' : 'Sign In'}
                </Label>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0">
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
