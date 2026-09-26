import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../ui/Avatar';
import { getStorageItem } from '../../utils/storage';

function formatAvatarUrl(raw?: string | null): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';
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

export function Header() {
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserAvatar() {
      try {
        const userStr = await getStorageItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.image) {
            setUserAvatar(userObj.image);
          }
        }
      } catch (e) {
        console.error('[Header] Error loading stored user avatar:', e);
      }
    }
    loadUserAvatar();
  }, []);

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white">
      <TouchableOpacity onPress={() => router.push('/')} activeOpacity={0.8} className="flex-row items-center -ml-2">
        <Image
          source={require('../../../assets/images/elive_logo_1.png')}
          style={{ width: 140, height: 36, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={() => router.push('/explore')}>
          <Search color="#121417" size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Avatar src={formatAvatarUrl(userAvatar)} size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
