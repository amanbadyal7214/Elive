import { useRouter } from 'expo-router';
import { AlignLeft, MessageCircle, Share2, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { ActivityIndicator, Image, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import useHome from '../../hooks/useHome';
import { Body, Headline, Label } from '../ui/Typography';

const fallbackBlogs = [
  {
    id: 1,
    author: 'Ananya Roy',
    role: 'Design Anthropologist',
    initials: 'AR',
    bgColor: 'bg-blue-100 text-blue-700',
    title: 'Why Frictionless UX Might Be Dumbing Down Our Collectiv...',
    excerpt: 'When we eliminate every obstacle in digital journeys, we inadvertently strip...',
    likes: 342,
    comments: 28,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
  },
  {
    id: 2,
    author: 'Marcus Chen',
    role: 'Macro Strategist',
    initials: 'MC',
    bgColor: 'bg-pink-100 text-pink-700',
    title: 'Decentralized Energy Grids: A Dispatch from the Edge of...',
    excerpt: 'How a valley community bypassed regional utilities to build a self-sustaining...',
    likes: 189,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
  },
];

const formatImage = (item: any): string => {
  const raw = item.image || item.imageUrl || item.coverImage || item.thumbnail;
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
    return raw;
  }
  if (raw.startsWith('/')) {
    return `http://192.168.1.9:5000${raw}`;
  }
  return `http://192.168.1.9:5000/uploads/${raw}`;
};

const formatInitials = (name: string): string => {
  if (!name) return 'EX';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatTitle = (item: any): string => {
  if (typeof item.post_title === 'string' && item.post_title.trim() !== '') {
    return item.post_title;
  }
  if (typeof item.title === 'string' && item.title.trim() !== '') {
    return item.title;
  }
  if (typeof item.title === 'object' && item.title !== null) {
    return item.title.rendered || item.title.name || '';
  }
  return 'Popular Story';
};

const cleanExcerpt = (item: any): string => {
  if (typeof item.description === 'string' && item.description.trim()) {
    return item.description.replace(/<[^>]+>/g, '').trim();
  }
  if (typeof item.content === 'string' && item.content.trim()) {
    return item.content.replace(/<[^>]+>/g, '').slice(0, 120).trim() + '...';
  }
  return 'Read the full story to explore key takeaways and insights.';
};

export function PopularBlogs() {
  const router = useRouter();
  const { popularArticles, loading } = useHome();

  const displayBlogs = popularArticles.length > 0
    ? popularArticles.map((item) => {
      const authorObj = item.author as any;
      const authorName = typeof authorObj === 'object' && authorObj !== null
        ? (authorObj.full_name || authorObj.name || 'Author')
        : (typeof authorObj === 'string' ? authorObj : 'Author');

      return {
        id: item._id || item.id || Math.random().toString(),
        author: authorName,
        role: item.authorRole || 'Contributor',
        initials: formatInitials(authorName),
        bgColor: 'bg-blue-100 text-blue-700',
        title: formatTitle(item),
        excerpt: cleanExcerpt(item),
        likes: item.likes || item.likes_count || 120,
        comments: Array.isArray(item.comments) ? item.comments.length : (item.commentsCount || 0),
        image: formatImage(item),
      };
    })
    : fallbackBlogs;

  const handleShareBlog = async (e: any, blogTitle: string) => {
    e.stopPropagation();
    try {
      await Share.share({
        title: blogTitle,
        message: `${blogTitle}\n\nRead more on Elive!`,
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <View className="py-2 bg-gray-50">
      <View className="px-4 flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <AlignLeft color="#2E7D32" size={20} className="mr-2" />
          <Headline className="text-xl"> Popular Blogs</Headline>
        </View>
        <TouchableOpacity onPress={() => router.push('/category/popular-blogs')} activeOpacity={0.7}>
          <Label className="text-[10px] font-bold text-primary uppercase tracking-widest">Community Voices {'>'}</Label>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-2 items-center justify-center">
          <ActivityIndicator size="small" color="#2E7D32" />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        >
          {displayBlogs.map((blog) => (
            <TouchableOpacity
              key={blog.id}
              className="w-80 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
              activeOpacity={0.9}
              onPress={() => router.push(`/article/${blog.id}`)}
            >
              {/* Author Info */}
              <View className="flex-row items-center mb-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${blog.bgColor.split(' ')[0]}`}>
                  <Label className={`font-bold ${blog.bgColor.split(' ')[1]}`}>{blog.initials}</Label>
                </View>
                <View>
                  <Label className="font-bold text-sm text-neutral-900">{blog.author}</Label>
                  <Label className="text-xs text-gray-500">{blog.role}</Label>
                </View>
              </View>

              {/* Image */}
              <Image
                source={{ uri: blog.image }}
                className="w-full h-32 rounded-xl mb-4 bg-gray-100"
              />

              {/* Content */}
              <Headline className="text-lg leading-tight mb-2" numberOfLines={2}>
                {blog.title}
              </Headline>
              <Body className="text-sm text-gray-600 leading-relaxed mb-4" numberOfLines={2}>
                {blog.excerpt}
              </Body>

              {/* Footer Actions Row: Left (Like, Dislike, Comment) & Right (Share) */}
              <View className="flex-row items-center justify-between mt-auto pt-3 border-t border-gray-100">
                {/* Left Side: Like, Dislike & Comment */}
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={(e) => e.stopPropagation()}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100"
                  >
                    <ThumbsUp size={13} color="#002249" />
                    <Label className="text-[11px] font-bold text-gray-700">{blog.likes}</Label>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={(e) => e.stopPropagation()}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100"
                  >
                    <ThumbsDown size={13} color="#6B7280" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={(e) => e.stopPropagation()}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100"
                  >
                    <MessageCircle size={13} color="#6B7280" />
                    <Label className="text-[11px] font-bold text-gray-700">{blog.comments}</Label>
                  </TouchableOpacity>
                </View>

                {/* Right Side: Share Option */}
                <TouchableOpacity
                  onPress={(e) => handleShareBlog(e, blog.title)}
                  activeOpacity={0.8}
                  className="flex-row items-center gap-1 bg-[#002249] px-3 py-1.5 rounded-full shadow-sm"
                >
                  <Share2 size={12} color="white" />
                  <Label className="text-[11px] font-bold text-white">Share</Label>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
