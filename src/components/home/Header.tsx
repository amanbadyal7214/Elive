import { Search } from 'lucide-react-native';
import { Image, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Avatar } from '../ui/Avatar';

export function Header() {
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
          <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
