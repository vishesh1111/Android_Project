import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Globe, Hash, Camera, PlayCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function ConnectScreen() {
  const router = useRouter();

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#0f0f0f]">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="font-poppins-bold text-xl text-primary tracking-wide">
          CONNECT
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-base mb-8 text-center">
          Follow us on our social media platforms to stay updated!
        </Text>

        <View className="gap-y-4">
          <TouchableOpacity 
            onPress={() => handleLink('https://www.facebook.com/vivafitnessgo')}
            className="flex-row items-center bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm"
            activeOpacity={0.7}
          >
            <View className="bg-[#1877F2] p-3 rounded-full mr-4">
              <Globe color="white" size={24} />
            </View>
            <Text className="font-poppins-semibold text-lg text-[#1A1A1A] dark:text-white">Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleLink('https://x.com/vivafitnessgo')}
            className="flex-row items-center bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm"
            activeOpacity={0.7}
          >
            <View className="bg-black dark:bg-gray-800 p-3 rounded-full mr-4 border border-gray-200 dark:border-transparent">
              <Hash color="white" size={24} />
            </View>
            <Text className="font-poppins-semibold text-lg text-[#1A1A1A] dark:text-white">Twitter / X</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleLink('https://www.instagram.com/vivafitnessgo')}
            className="flex-row items-center bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm"
            activeOpacity={0.7}
          >
            <View className="bg-[#E4405F] p-3 rounded-full mr-4">
              <Camera color="white" size={24} />
            </View>
            <Text className="font-poppins-semibold text-lg text-[#1A1A1A] dark:text-white">Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleLink('https://www.youtube.com/channel/UCZHL6fAAPwY-Ijzo1o9mO7Q')}
            className="flex-row items-center bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm"
            activeOpacity={0.7}
          >
            <View className="bg-[#FF0000] p-3 rounded-full mr-4">
              <PlayCircle color="white" size={24} />
            </View>
            <Text className="font-poppins-semibold text-lg text-[#1A1A1A] dark:text-white">YouTube</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
