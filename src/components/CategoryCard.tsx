import React from "react";
import { Pressable, View, Text } from "react-native";
import { ChevronRight, Building2, Home } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import { CATEGORIES } from "@/constants/categories";
import type { MainCategory } from "@/lib/types";

interface CategoryCardProps {
  category: MainCategory;
  label: string;
  subtitle: string;
  onPress: () => void;
}

const ICONS: Record<MainCategory, React.ElementType> = {
  commercial: Building2,
  domestic: Home,
};

export default function CategoryCard({
  category,
  label,
  subtitle,
  onPress,
}: CategoryCardProps) {
  const Icon = ICONS[category];
  const isCommercial = category === "commercial";
  const { description } = CATEGORIES[category];

  return (
    <Pressable
      onPress={onPress}
      className="mb-5 overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a1a] p-6 active:scale-[0.98] border border-transparent dark:border-[#333333]"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Icon Container */}
      <View
        className={`mb-5 h-16 w-16 items-center justify-center rounded-2xl ${
          isCommercial ? "bg-primary dark:bg-primary/90" : "bg-[#FDE8E8] dark:bg-[#202736]"
        }`}
        style={isCommercial ? { shadowColor: '#B91C1C', shadowOpacity: 0.3, shadowRadius: 10 } : { shadowColor: '#B91C1C', shadowOpacity: 0.1, shadowRadius: 10 }}
      >
        <Icon
          size={32}
          color={isCommercial ? "#FFFFFF" : COLORS.primary}
          strokeWidth={2}
        />
      </View>

      {/* Text Content */}
      <Text className="font-poppins-bold text-2xl text-[#1A202C] dark:text-white">
        {label}
      </Text>

      {/* Description and Arrow Row */}
      <View className="mt-2 flex-row items-end justify-between">
        <Text className="flex-1 pr-4 font-poppins text-sm leading-6 text-[#4A5568] dark:text-[#a1a1a1]">
          {description}
        </Text>
        
        {/* Arrow Button */}
        <View className="h-10 w-10 items-center justify-center rounded-full bg-[#FDE8E8] dark:bg-[#202736]">
          <ChevronRight size={20} color={COLORS.primary} strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}
