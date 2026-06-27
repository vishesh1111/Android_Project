import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";
import * as Icons from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import type { SubCategory } from "@/lib/types";

interface SubCategoryRowProps {
  item: SubCategory;
  onPress: () => void;
  isLast: boolean;
}

export default function SubCategoryRow({
  item,
  onPress,
  isLast,
}: SubCategoryRowProps) {
  const IconComponent = (Icons as any)[item.iconName] || Icons.Activity;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-4 active:bg-black/5 dark:active:bg-white/5 ${
        !isLast ? "border-b border-border dark:border-[#333]" : ""
      }`}
    >
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-[#F0F4F8] dark:bg-[#1a1a1a]">
        <IconComponent size={24} color={COLORS.primary} strokeWidth={2} />
      </View>
      <View className="flex-1">
        <Text className="font-poppins-semibold text-base text-text-primary dark:text-white">
          {item.label}
        </Text>
        <Text className="mt-0.5 font-poppins text-xs text-text-secondary dark:text-gray-400">
          {item.subtitle}
        </Text>
      </View>
      <ChevronRight size={20} color={COLORS.primary} strokeWidth={2} />
    </Pressable>
  );
}
