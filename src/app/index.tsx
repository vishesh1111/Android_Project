import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "@/components/CategoryCard";
import ThemeToggle from "@/components/ThemeToggle";
import { CATEGORIES } from "@/constants/categories";
import type { MainCategory } from "@/lib/types";

export default function SelectionScreen() {
  const router = useRouter();

  const handleCategoryPress = (category: MainCategory) => {
    router.push(`/${category}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#0f0f0f]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Options */}
        <View className="items-end px-4 pt-4">
          <ThemeToggle />
        </View>

        {/* Header */}
        <View className="items-center px-6 pb-8 pt-2">
          <Text 
            className="font-poppins-bold text-3xl text-primary tracking-wide"
            style={{ textShadowColor: 'rgba(185, 28, 28, 0.4)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 15 }}
          >
            VIVA FITNESS
          </Text>
          <Text className="mt-2 text-center font-poppins text-sm text-[#4A5568] dark:text-gray-300">
            Premium Gym Equipment for Every Need
          </Text>
        </View>

        {/* Category Selection */}
        <View className="px-6">
          {(Object.keys(CATEGORIES) as MainCategory[]).map((key) => (
            <CategoryCard
              key={key}
              category={key}
              label={CATEGORIES[key].label}
              subtitle={CATEGORIES[key].subtitle}
              onPress={() => handleCategoryPress(key)}
            />
          ))}
        </View>

        {/* Footer */}
        <View className="mt-auto items-center pb-8 pt-10">
          <Text className="font-poppins text-xs font-medium text-[#718096] dark:text-gray-500">
            Trusted by 500+ gyms across India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
