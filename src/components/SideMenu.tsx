import React, { useEffect } from 'react';
import { View, Text, Pressable, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Moon, Sun } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  withSpring
} from 'react-native-reanimated';
import { useColorScheme } from "nativewind";
import { COLORS } from "@/constants/theme";
import { useRouter } from "expo-router";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const translateX = useSharedValue(-300); // Assume drawer width is ~300
  const router = useRouter();

  const navigateTo = (path: any) => {
    translateX.value = withTiming(-300, { duration: 300 }, () => {
      runOnJS(onClose)();
      runOnJS(router.push)(path);
    });
  };

  useEffect(() => {
    if (visible) {
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(-300, { duration: 300 });
    }
  }, [visible]);

  const handleClose = () => {
    translateX.value = withTiming(-300, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={handleClose}>
      <View className="flex-1 flex-row">
        {/* Backdrop */}
        <Pressable 
          className="absolute inset-0 bg-black/40 dark:bg-black/60" 
          onPress={handleClose}
        />
        
        {/* Drawer Content */}
        <Animated.View 
          className="w-[280px] h-full bg-white dark:bg-[#121212] shadow-2xl"
          style={animatedStyle}
        >
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-[#2A2A2A]">
              <Text className="font-poppins-bold text-[#991B1B] text-sm tracking-widest">
                VIVA FITNESS
              </Text>
              <TouchableOpacity onPress={handleClose} className="p-2 -mr-2">
                <X size={20} color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View className="flex-1 py-4">
              <TouchableOpacity 
                className="px-6 py-4"
                onPress={() => navigateTo('/about')}
              >
                <Text className="font-poppins-semibold text-[#1A1A1A] dark:text-white text-base">
                  About Us
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="px-6 py-4"
                onPress={() => navigateTo('/contact')}
              >
                <Text className="font-poppins-semibold text-[#1A1A1A] dark:text-white text-base">
                  Contact
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="px-6 py-4"
                onPress={() => navigateTo('/connect')}
              >
                <Text className="font-poppins-semibold text-[#1A1A1A] dark:text-white text-base">
                  Connect
                </Text>
              </TouchableOpacity>

              {/* Theme Toggle Row */}
              <TouchableOpacity 
                className="flex-row items-center justify-between px-6 py-4 mt-2"
                onPress={toggleColorScheme}
                activeOpacity={0.7}
              >
                <Text className="font-poppins-semibold text-[#1A1A1A] dark:text-white text-base">
                  Theme
                </Text>
                {colorScheme === "dark" ? (
                  <Sun size={20} color="#FFFFFF" strokeWidth={2} />
                ) : (
                  <Moon size={20} color="#1A1A1A" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="px-6 pb-10">
              <Text className="font-poppins-semibold text-[#9CA3AF] dark:text-[#6B7280] text-[10px] tracking-widest uppercase">
                Premium Equipment
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// We need a local SafeAreaView since react-native-safe-area-context might not work ideally inside a Modal in some setups, but let's import it.
import { SafeAreaView } from 'react-native-safe-area-context';
