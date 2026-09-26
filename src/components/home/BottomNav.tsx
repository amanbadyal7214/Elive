import { usePathname, useRouter } from 'expo-router';
import { Compass, Edit3, Home, TrendingUp, User } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Label } from '../ui/Typography';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isHome = pathname === '/' || pathname === '/index';
  const isExplore = pathname === '/explore';
  const isTrending = pathname === '/trending';
  const isProfile = pathname === '/profile';

  return (
    <View
      className="flex-row items-center justify-around bg-white pt-2 border-t border-gray-100 px-2"
      style={[styles.shadow, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}
    >
      <TouchableOpacity onPress={() => router.push('/')} className="items-center py-2 flex-1">
        <Home color={isHome ? '#002249' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isHome ? 'text-[#002249]' : 'text-gray-400'}`}>Home</Label>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/explore')} className="items-center py-2 flex-1">
        <Compass color={isExplore ? '#002249' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isExplore ? 'text-[#002249]' : 'text-gray-400'}`}>Explore</Label>
      </TouchableOpacity>

      {/* Center Action Button */}
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          onPress={() => router.push('/create')}
          activeOpacity={0.9}
          className="bg-[#002249] w-12 h-12 rounded-full items-center justify-center -mt-8 border-4 border-white shadow-md"
        >
          <Edit3 color="white" size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/trending')} className="items-center py-2 flex-1">
        <TrendingUp color={isTrending ? '#002249' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isTrending ? 'text-[#002249]' : 'text-gray-400'}`}>Trending</Label>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile')} className="items-center py-2 flex-1">
        <User color={isProfile ? '#002249' : '#9CA3AF'} size={24} />
        <Label className={`text-[10px] mt-1 font-bold ${isProfile ? 'text-[#002249]' : 'text-gray-400'}`}>Profile</Label>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
});
