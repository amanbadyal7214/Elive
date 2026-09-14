import React from 'react';
import { View, ScrollView, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Bookmark, Share2, MessageCircle, Type, ThumbsUp, Quote, Clock, Eye, Download } from 'lucide-react-native';
import { Headline, Label } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

import { Header } from '../../components/home/Header';

export default function ArticleDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Meta Info */}
        <View className="px-4 pt-6 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <Badge label="CAREER & SKILLS" variant="blue" className="rounded-md px-3 py-1" />
            <View className="flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
              <Label className="text-xs text-gray-500 tracking-wider">Smartphone Analysis</Label>
            </View>
          </View>

          <View className="flex-row items-center mb-4">
            <Label className="text-xs text-gray-500">May 14, 2024</Label>
            <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
            <Clock size={12} color="#6B7280" className="mr-1" />
            <Label className="text-xs text-gray-500">12 min read</Label>
            <View className="w-1 h-1 rounded-full bg-gray-300 mx-2" />
            <Eye size={12} color="#6B7280" className="mr-1" />
            <Label className="text-xs text-gray-500">41.8k views</Label>
          </View>

          {/* Headline */}
          <Headline className="text-4xl leading-[1.2] mb-4">
            The Cognitive Architecture of Deep Work in an Era of Generative AI
          </Headline>

          {/* Subtitle / Lead */}
          <Label className="text-[17px] text-gray-600 leading-relaxed mb-6 font-serif">
            When machines produce instant answers, human intellect shifts from retrieval to orchestration. Here is how leading thinkers are insulating their attention spans.
          </Label>

          {/* Author Row */}
          <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" size={44} className="mr-3" />
              <View>
                <View className="flex-row items-center">
                  <Headline className="text-base mr-1">Elena Vance</Headline>
                  <View className="bg-red-100 rounded-full w-4 h-4 items-center justify-center">
                    <Label className="text-[10px] text-primary">C</Label>
                  </View>
                </View>
                <Label className="text-xs text-gray-500">Senior Tech & Culture Editor</Label>
              </View>
            </View>
            <TouchableOpacity className="bg-[#8B0000] px-4 py-1.5 rounded-full">
              <Label className="text-white text-xs font-bold">Follow</Label>
            </TouchableOpacity>
          </View>

          {/* Actions Row */}
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-5">
              <TouchableOpacity>
                <Share2 size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <MessageCircle size={20} color="#6B7280" />
                <Label className="text-xs text-gray-500 ml-1">42</Label>
              </TouchableOpacity>
              <TouchableOpacity>
                <Bookmark size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
              <TouchableOpacity className="px-2 border-r border-gray-300">
                <Label className="text-xs font-bold text-gray-600">100%</Label>
              </TouchableOpacity>
              <TouchableOpacity className="px-2 border-r border-gray-300">
                <Label className="text-xs font-bold text-gray-600">A-</Label>
              </TouchableOpacity>
              <TouchableOpacity className="px-2">
                <Label className="text-xs font-bold text-gray-600">A+</Label>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hero Image */}
        <View className="px-4 py-2">
          <View className="rounded-xl overflow-hidden relative">
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80' }}
              className="w-full h-56"
            />
            <View className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded">
              <Label className="text-[10px] text-white font-bold uppercase tracking-wider">AI Work Philosophy</Label>
            </View>
          </View>
          <View className="flex-row justify-between mt-2">
            <Label className="text-[10px] text-gray-500 italic flex-1 mr-4">
              The modern workstation: a byproduct of continuous algorithmic disruptions.
            </Label>
            <Label className="text-[10px] text-gray-400">Photo: AI MidJ</Label>
          </View>
        </View>

        {/* Article Body */}
        <View className="px-4 pt-4 pb-8">
          <View className="flex-row items-start mb-6">
            <Headline className="text-6xl text-primary leading-[0.8] mr-2 mt-2">T</Headline>
            <Label className="text-[18px] text-gray-800 leading-relaxed font-serif flex-1">
              he sudden democratization of generative language systems has inverted the conventional scarcity model of knowledge creation. For three decades, our professional survival depended on the speed with which we synthesized dispersed literature, organized scattered points of evidence, and drafted viable first passes. Today, that synthetic grunt work is consummated in sub-second inference calls.
            </Label>
          </View>

          <Label className="text-[18px] text-gray-800 leading-relaxed mb-6 font-serif">
            Consequently, the actual high-rent district of human intellect has migrated inward. What remains irreplaceable is not information velocity, but <Headline className="text-[18px]">cognitive cohesion</Headline>: the fragile capacity to suspend multiple ambiguous hypotheses in working memory without defaulting to the algorithmic consensus path.
          </Label>

          {/* Pull Quote */}
          <View className="bg-red-50/50 border-l-4 border-primary p-5 my-6 rounded-r-xl">
            <Quote size={24} color="#C9182B" className="mb-3" />
            <Headline className="text-2xl text-primary leading-snug italic mb-4">
              "The danger is not that machines begin to think like humans, but that humans willingly downsample their cognition to match the prompts."
            </Headline>
            <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              — ELENA VANCE, DELIVERING PREDATORY ALGORITHMS AT NEURON
            </Label>
          </View>

          <Label className="text-[18px] text-gray-800 leading-relaxed mb-8 font-serif">
            Consider what happens during recursive algorithmic reliance. When an analytical worker queries a model at the friction point of every paragraph, they trade productive creative tension for instantaneous gratification. The mind avoids the uncomfortable incubation phase where truly lateral hypotheses take root.
          </Label>

          {/* Inline Model Card */}
          <View className="bg-[#F8F9FA] rounded-2xl p-5 mb-8 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-2 bg-primary rounded-full mr-2" />
              <Headline className="text-lg text-gray-900 flex-1">The Attention Decoupling Model</Headline>
              <Badge label="New UI" variant="light" className="text-[10px]" />
            </View>
            <Label className="text-sm text-gray-600 mb-5">
              A framework to evaluate cognitive drift during synthesis and how to stay present in active cycles.
            </Label>

            <View className="gap-y-3">
              <View className="flex-row items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                  <Label className="text-xs font-bold text-gray-500">01</Label>
                </View>
                <View className="flex-1">
                  <Headline className="text-sm">Isolated Ideation Chamber</Headline>
                  <Label className="text-[10px] text-gray-500">Zero external networks, paper & fountain pen framing</Label>
                </View>
                <Badge label="High Value" variant="green" />
              </View>

              <View className="flex-row items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Label className="text-xs font-bold text-blue-600">02</Label>
                </View>
                <View className="flex-1">
                  <Headline className="text-sm">Batch AI Interrogation</Headline>
                  <Label className="text-[10px] text-gray-500">Time-boxed adversarial critique on initial vectors</Label>
                </View>
                <Badge label="Moderate" variant="blue" />
              </View>

              <View className="flex-row items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
                  <Label className="text-xs font-bold text-red-600">03</Label>
                </View>
                <View className="flex-1">
                  <Headline className="text-sm">Recursive Guiding & Polish</Headline>
                  <Label className="text-[10px] text-gray-500">Auditing tone, precision logic, eliminating synthetics fluff</Label>
                </View>
                <Badge label="Critical" variant="pink" />
              </View>
            </View>
          </View>

          <Label className="text-[18px] text-gray-800 leading-relaxed mb-6 font-serif">
            To maintain high-order autonomy, knowledge workers must establish deliberate friction thresholds. Rather than treating synthetic agents as conversational companions, the elite operator treats them as asynchronous audit counsel—queried deliberately, evaluated skeptically, and turned off ruthlessly during synthesis.
          </Label>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2 mb-8">
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Label className="text-xs text-gray-600">#AIAugmentation</Label>
            </View>
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Label className="text-xs text-gray-600">#CognitiveScience</Label>
            </View>
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Label className="text-xs text-gray-600">#FutureOfWork</Label>
            </View>
            <View className="bg-gray-100 px-3 py-1.5 rounded-full">
              <Label className="text-xs text-gray-600">#DeepWork</Label>
            </View>
          </View>

          {/* Bottom Actions */}
          <View className="flex-row items-center justify-between border-t border-b border-gray-100 py-4 mb-8">
            <TouchableOpacity className="flex-row items-center border border-gray-200 rounded-full px-4 py-2">
              <ThumbsUp size={16} color="#C9182B" className="mr-2" />
              <Headline className="text-sm text-gray-800">1,348 Applauds</Headline>
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                <Bookmark size={18} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100">
                <Download size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Author Bio Card */}
          <View className="bg-gray-50 rounded-2xl p-5 mb-10 border border-gray-100">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center flex-1">
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150" size={48} className="mr-3" />
                <View>
                  <Headline className="text-lg">Elena Vance</Headline>
                  <Label className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-0.5">Author Bio</Label>
                </View>
              </View>
            </View>
            <Label className="text-sm text-gray-600 leading-relaxed mb-5">
              Investigating the subtle technical forces between human cognition and ambient machine intelligence. Author of the NYT Bestseller, 'Obsolete' (2024).
            </Label>
            
            <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">More From Elena</Label>
            <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <TouchableOpacity className="p-3 border-b border-gray-50 flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                  <Headline className="text-sm leading-tight" numberOfLines={1}>The Epistemic Collapse of the Corporate Intranet</Headline>
                  <Label className="text-xs text-gray-500 mt-1">Apr 28 • 8 min read</Label>
                </View>
                <ArrowLeft size={16} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              <TouchableOpacity className="p-3 flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                  <Headline className="text-sm leading-tight" numberOfLines={1}>Why Senior Engineers Are Returning to Paper</Headline>
                  <Label className="text-xs text-gray-500 mt-1">Mar 12 • 15 min read</Label>
                </View>
                <ArrowLeft size={16} color="#9CA3AF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View className="mb-10">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center">
                <Headline className="text-xl mr-2">Reader Responses</Headline>
                <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                  <Label className="text-[10px] font-bold text-gray-600">42</Label>
                </View>
              </View>
              <TouchableOpacity>
                <Label className="text-[11px] font-bold text-primary flex-row items-center">
                  Top Comments v
                </Label>
              </TouchableOpacity>
            </View>

            {/* Comment Input */}
            <View className="flex-row items-start mb-6">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3 mt-1">
                <Label className="text-xs font-bold text-blue-600">You</Label>
              </View>
              <View className="flex-1 border-b border-gray-200 pb-2">
                <Label className="text-sm text-gray-400 italic">Add a thoughtful response to the dialogue...</Label>
                <View className="flex-row justify-between items-center mt-3">
                  <Label className="text-[10px] text-gray-400">Editorial guidelines apply</Label>
                  <TouchableOpacity className="bg-black px-4 py-1.5 rounded-full">
                    <Label className="text-white text-xs font-bold">Publish Thought</Label>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Comment 1 */}
            <View className="mb-6">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Label className="text-xs font-bold text-gray-600">MC</Label>
                  </View>
                  <View>
                    <Headline className="text-sm">Marcus C.</Headline>
                    <Label className="text-[10px] text-gray-500">Design Systems Lead @ Khronos</Label>
                  </View>
                </View>
                <Label className="text-[10px] text-gray-400">1h ago</Label>
              </View>
              <Label className="text-[15px] text-gray-800 leading-relaxed mb-3 font-serif">
                The observation regarding the incubation phase strikes at the heart of modern knowledge fatigue. We have eliminated boredom, which happened to be the primary metabolic catalyst for unexpected associations.
              </Label>
              <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center mr-4">
                  <ThumbsUp size={14} color="#6B7280" className="mr-1.5" />
                  <Label className="text-xs text-gray-500">24</Label>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Label className="text-xs text-gray-500 font-bold">Reply</Label>
                </TouchableOpacity>
              </View>
            </View>

            {/* Comment 2 */}
            <View className="mb-6">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                    <Label className="text-xs font-bold text-green-600">RC</Label>
                  </View>
                  <View>
                    <Headline className="text-sm">Dr. Rachel Chen</Headline>
                    <Label className="text-[10px] text-gray-500">Neurobiology @ Wheeler Lab</Label>
                  </View>
                </View>
                <Label className="text-[10px] text-gray-400">3h ago</Label>
              </View>
              <Label className="text-[15px] text-gray-800 leading-relaxed mb-3 font-serif">
                Empirical measurements from our EEG cohorts confirm this. MRI readouts similarly match querying rather than deep comprehension. Frontal parietal fast organizing networks stay mostly silent.
              </Label>
              <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center mr-4">
                  <ThumbsUp size={14} color="#6B7280" className="mr-1.5" />
                  <Label className="text-xs text-gray-500">68</Label>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Label className="text-xs text-gray-500 font-bold">Reply</Label>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="border border-gray-200 rounded-full py-3 items-center justify-center">
              <Label className="text-sm font-bold text-gray-600">View all 42 comments</Label>
            </TouchableOpacity>
          </View>

          {/* Related Articles placeholder */}
          <View className="mb-10">
            <View className="flex-row items-center justify-between mb-4">
              <Headline className="text-xl">Related Inquiries</Headline>
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Curated Feed</Label>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 pb-4">
              {/* Related Card 1 */}
              <TouchableOpacity className="w-64 mr-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <View className="h-32 relative">
                  <Image source={{uri: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=400&q=80'}} className="w-full h-full" />
                  <View className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded">
                     <Label className="text-[10px] text-white font-bold uppercase tracking-widest">Architecture</Label>
                  </View>
                </View>
                <View className="p-3">
                  <Headline className="text-base leading-tight mb-2" numberOfLines={2}>The Physical Spaces That Protect Unbroken Concentration</Headline>
                  <Label className="text-xs text-gray-500">Julian Thorne • 6 min read</Label>
                </View>
              </TouchableOpacity>

              {/* Related Card 2 */}
              <TouchableOpacity className="w-64 mr-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <View className="h-32 relative">
                  <Image source={{uri: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80'}} className="w-full h-full" />
                  <View className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded">
                     <Label className="text-[10px] text-white font-bold uppercase tracking-widest">Essay</Label>
                  </View>
                </View>
                <View className="p-3">
                  <Headline className="text-base leading-tight mb-2" numberOfLines={2}>Tactile Reality: Why We Need Tools More Than Platforms</Headline>
                  <Label className="text-xs text-gray-500">Cara Takahashi • 9 min read</Label>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <View className="h-8" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
