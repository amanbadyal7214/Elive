import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Mail, ArrowRight } from 'lucide-react-native';
import { Headline, Body, Label } from '../ui/Typography';
import { Badge } from '../ui/Badge';

export function NewsletterSignup() {
  return (
    <View className="px-4 py-8 bg-white">
      <View className="bg-[#2D2426] rounded-3xl p-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px]" />
        
        <View className="items-start mb-4">
          <Badge label="WEEKLY CURATED" variant="primary" icon={<Mail size={12} color="white" />} />
        </View>

        <Headline className="text-white text-2xl mb-3"> eLiveToday Digest</Headline>
        
        <Body className="text-gray-300 text-sm mb-6 leading-relaxed">
          The 7 most transformative essays, investigative scoops, and thought pieces delivered to your inbox every Sunday morning. No spam, ever.
        </Body>

        <View className="bg-[#3D3436] rounded-xl flex-row items-center px-4 h-12 mb-4 border border-white/10">
          <Mail color="#9CA3AF" size={18} className="mr-3" />
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-white font-body"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity 
          className="bg-primary rounded-xl h-12 flex-row items-center justify-center"
          activeOpacity={0.9}
        >
          <Label className="text-white font-bold mr-2">Subscribe Free</Label>
          <ArrowRight color="white" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
