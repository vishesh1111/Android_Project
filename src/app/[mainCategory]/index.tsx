import React from "react";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import SubCategoryRow from "@/components/SubCategoryRow";
import ThemeToggle from "@/components/ThemeToggle";
import { CATEGORIES } from "@/constants/categories";
import { COLORS } from "@/constants/theme";
import type { MainCategory } from "@/lib/types";

export default function SubCategoryScreen() {
  const { mainCategory } = useLocalSearchParams<{ mainCategory: string }>();
  const router = useRouter();

  const categoryData = CATEGORIES[mainCategory as MainCategory];

  if (!categoryData) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F4F6F9] dark:bg-black">
        <Text className="font-poppins-medium text-base text-text-secondary dark:text-gray-400">
          Category not found
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F6F9] dark:bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
          >
            <ArrowLeft size={24} color={COLORS.primary} strokeWidth={2} />
          </Pressable>
          <Text 
            className="font-poppins-bold text-lg text-primary tracking-wide"
            style={{ textShadowColor: 'rgba(185, 28, 28, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 }}
          >
            VIVA FITNESS
          </Text>
          <View className="flex-row items-center">
            <ThemeToggle />
            <Pressable className="ml-2 h-10 w-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10">
              <ShoppingCart size={24} color="#9CA3AF" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Category Title Header */}
        <View className="px-5 pb-5 pt-2">
          <Text className="font-poppins-bold text-3xl text-[#1A202C] dark:text-white">
            {categoryData.label} Equipment
          </Text>
          <Text className="mt-1 font-poppins-medium text-sm text-[#4A5568] dark:text-gray-400">
            {categoryData.subtitle}
          </Text>
        </View>

        {/* Subcategory List in Unified Card */}
        <View className="mx-4 mb-8 overflow-hidden rounded-3xl border border-border bg-white dark:border-[#333] dark:bg-[#111111]">
          <FlatList
            data={categoryData.subcategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <SubCategoryRow
                item={item}
                isLast={index === categoryData.subcategories.length - 1}
                onPress={() => router.push(`/${mainCategory}/${item.id}`)}
              />
            )}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
