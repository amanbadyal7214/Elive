import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, Download, Eye, MessageCircle, Share2, ThumbsUp } from 'lucide-react-native';
import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, Image, ScrollView, Share, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/home/Header';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { HtmlRenderer } from '../../components/ui/HtmlRenderer';
import { Headline, Label } from '../../components/ui/Typography';
import useArticleDetails from '../../hooks/useArticleDetails';

const formatImage = (raw: any): string => {
  if (typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80';
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  if (raw.startsWith('/')) return `http://192.168.1.9:5000${raw}`;
  return `http://192.168.1.9:5000/uploads/${raw}`;
};

export default function ArticleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { article: apiArticle, loading, error } = useArticleDetails(id);

  const scrollViewRef = useRef<ScrollView>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<number>(18);

  useEffect(() => {
    if (apiArticle?.comments && Array.isArray(apiArticle.comments)) {
      setCommentsList(apiArticle.comments);
    }
  }, [apiArticle]);

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const newCommentObj = {
      id: Date.now(),
      author: { full_name: 'You' },
      comment: newCommentText.trim(),
      created_at: 'Just now',
    };
    setCommentsList((prev) => [newCommentObj, ...prev]);
    setNewCommentText('');
  };

  const categoryStr = typeof apiArticle?.category === 'object'
    ? (apiArticle.category.name || 'GENERAL')
    : (typeof apiArticle?.category === 'string' ? apiArticle.category : 'GENERAL');

  const titleStr = apiArticle?.post_title ||
    (typeof apiArticle?.title === 'string' ? apiArticle.title : (typeof apiArticle?.title === 'object' ? apiArticle.title?.rendered : '')) ||
    'Article Details';

  const authorName = typeof apiArticle?.author === 'object'
    ? (apiArticle.author.full_name || apiArticle.author.name || 'Author')
    : (typeof apiArticle?.author === 'string' ? apiArticle.author : 'Editorial Staff');

  const authorRawImage = typeof apiArticle?.author === 'object'
    ? ((apiArticle.author as any).image || (apiArticle.author as any).avatar || (apiArticle.author as any).photo)
    : (apiArticle?.author_image || apiArticle?.author_photo || null);

  const authorAvatar = formatImage(authorRawImage || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150');

  const dateStr = apiArticle?.created_at
    ? new Date(apiArticle.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recently';

  const rawContent = apiArticle?.content || apiArticle?.description || '';
  const mainImage = formatImage(apiArticle?.image || apiArticle?.imageUrl || apiArticle?.coverImage);

  // Action Handlers
  const handleShare = async () => {
    try {
      await Share.share({
        title: titleStr,
        message: `${titleStr}\n\nRead more on Elive!`,
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const scrollToComments = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleZoomIn = () => {
    setFontSizeScale((prev) => Math.min(prev + 2, 26));
  };

  const handleZoomOut = () => {
    setFontSizeScale((prev) => Math.max(prev - 2, 14));
  };

  const handleResetZoom = () => {
    setFontSizeScale(18);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      {loading ? (
        <View className="flex-1 items-center justify-center py-20 bg-white">
          <ActivityIndicator size="large" color="#002249" />
          <Label className="mt-3 text-sm text-gray-500 font-medium">Loading article details...</Label>
        </View>
      ) : (
        <ScrollView ref={scrollViewRef} className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
          {/* Meta Info */}
          <View className="px-4 pt-4 pb-2">
            {/* Top Bar Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center mb-4 self-start bg-gray-100 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft size={16} color="#4B5563" className="mr-1.5" />
              <Label className="text-xs font-bold text-gray-700">Back</Label>
            </TouchableOpacity>

            <View className="flex-row items-center justify-between mb-4">
              <Badge label={categoryStr} variant="primary" className="rounded-md px-3 py-1" />
              <View className="flex-row items-center">
                <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                <Label className="text-xs text-gray-500 tracking-wider">Verified Article</Label>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <Label className="text-xs text-gray-500">{dateStr}</Label>
              {(apiArticle?.views || apiArticle?.views_count) ? (
                <>
                  <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
                  <Eye size={12} color="#6B7280" className="mr-1" />
                  <Label className="text-xs text-gray-500">{apiArticle.views || apiArticle.views_count} views</Label>
                </>
              ) : null}
            </View>

            {/* Headline */}
            <Headline className="text-3xl leading-[1.25] mb-4">
              {titleStr}
            </Headline>

            {/* Author Row */}
            <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <Avatar src={authorAvatar} size={44} className="mr-3" />
                <View>
                  <View className="flex-row items-center">
                    <Headline className="text-base mr-1">{authorName}</Headline>
                    <View className="bg-red-100 rounded-full w-4 h-4 items-center justify-center">
                      <Label className="text-[10px] text-primary">✓</Label>
                    </View>
                  </View>
                  <Label className="text-xs text-gray-500">Verified Author</Label>
                </View>
              </View>
            </View>

            {/* Actions Row */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center gap-5">
                <TouchableOpacity onPress={handleShare} activeOpacity={0.7} className="p-1">
                  <Share2 size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={scrollToComments} activeOpacity={0.7} className="flex-row items-center p-1">
                  <MessageCircle size={20} color="#6B7280" />
                  <Label className="text-xs text-gray-500 ml-1 font-bold">
                    {commentsList.length}
                  </Label>
                </TouchableOpacity>
              </View>

              {/* Font Size Scaling Controls */}
              <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
                <TouchableOpacity onPress={handleResetZoom} activeOpacity={0.7} className="px-2 border-r border-gray-300">
                  <Label className={`text-xs font-bold ${fontSizeScale === 18 ? 'text-primary font-black' : 'text-gray-600'}`}>
                    100%
                  </Label>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleZoomOut} activeOpacity={0.7} className="px-2 border-r border-gray-300">
                  <Label className="text-xs font-bold text-gray-600">A-</Label>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleZoomIn} activeOpacity={0.7} className="px-2">
                  <Label className="text-xs font-bold text-gray-600">A+</Label>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Hero Image */}
          <View className="px-4 py-2">
            <View className="rounded-xl overflow-hidden relative">
              <Image
                source={{ uri: mainImage }}
                className="w-full h-56 bg-gray-100"
              />
              <View className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded">
                <Label className="text-[10px] text-white font-bold uppercase tracking-wider">{categoryStr}</Label>
              </View>
            </View>
          </View>

          {/* Article Body Content */}
          <View className="px-4 pt-4 pb-8">
            {rawContent ? (
              <HtmlRenderer html={rawContent} baseFontSize={fontSizeScale} />
            ) : (
              <Headline style={{ fontSize: fontSizeScale }} className="text-gray-800 leading-relaxed mb-6 font-normal">
                No description available for this article.
              </Headline>
            )}

            {/* Bottom Actions */}
            <View className="flex-row items-center justify-between border-t border-b border-gray-100 py-4 mb-6">
              <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-full px-4 py-2">
                <ThumbsUp size={16} color="#002249" className="mr-2" />
                <Headline className="text-sm text-gray-800">Applaud Article</Headline>
              </TouchableOpacity>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={handleShare} activeOpacity={0.7} className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                  <Download size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Comments Section */}
            <View className="mt-4 pt-6 border-t border-gray-100">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <MessageCircle size={20} color="#002249" className="mr-2" />
                  <Headline className="text-xl font-bold">Comments</Headline>
                  <View className="bg-primary/10 px-2.5 py-0.5 rounded-full ml-2">
                    <Label className="text-xs font-bold text-primary">{commentsList.length}</Label>
                  </View>
                </View>
              </View>

              {/* Add Comment Input */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <Label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Leave a Response</Label>
                <TextInput
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  placeholder="Write your comment here..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-white rounded-xl p-3 text-sm text-gray-900 border border-gray-200 min-h-[70px] mb-3 font-sans"
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={handleAddComment}
                  disabled={!newCommentText.trim()}
                  className={`py-2.5 px-5 rounded-full self-end ${newCommentText.trim() ? 'bg-primary' : 'bg-gray-300'}`}
                  activeOpacity={0.8}
                >
                  <Label className="text-white text-xs font-bold">Post Comment</Label>
                </TouchableOpacity>
              </View>

              {/* Comments List */}
              {commentsList.length > 0 ? (
                <View className="gap-y-3">
                  {(showAllComments ? commentsList : commentsList.slice(0, 4)).map((comment: any, index: number) => {
                    const commentAuthor = typeof comment.author === 'object' && comment.author !== null
                      ? (comment.author.full_name || comment.author.name || 'Reader')
                      : (typeof comment.author === 'string' ? comment.author : (comment.user || 'Reader'));

                    const commentBody = comment.comment || comment.content || comment.text || 'Great read!';
                    const commentTime = comment.created_at
                      ? (comment.created_at === 'Just now' ? 'Just now' : new Date(comment.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }))
                      : 'Just now';

                    return (
                      <View key={comment.id || index} className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                        <View className="flex-row items-center justify-between mb-1.5">
                          <View className="flex-row items-center">
                            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" size={30} className="mr-2" />
                            <View>
                              <Headline className="text-sm font-bold text-gray-900">{commentAuthor}</Headline>
                              <Label className="text-[10px] text-gray-400">{commentTime}</Label>
                            </View>
                          </View>
                        </View>
                        <Label className="text-sm text-gray-700 leading-relaxed font-sans">{commentBody}</Label>
                      </View>
                    );
                  })}

                  {/* Read More / Show Less Comments Button */}
                  {commentsList.length > 4 && (
                    <TouchableOpacity
                      onPress={() => setShowAllComments((prev) => !prev)}
                      className="mt-2 py-3 px-4 bg-gray-100 rounded-full items-center justify-center border border-gray-200"
                      activeOpacity={0.7}
                    >
                      <Label className="text-xs font-bold text-gray-800">
                        {showAllComments
                          ? 'Show Less Comments'
                          : `Read More Comments (${commentsList.length - 4} more)`}
                      </Label>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View className="py-6 items-center bg-gray-50 rounded-xl">
                  <Label className="text-xs text-gray-500 font-medium">No comments yet. Be the first to comment!</Label>
                </View>
              )}
            </View>

            <View className="h-8" />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
