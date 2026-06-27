import React from "react";
import { View, Text } from "react-native";
import { PackageOpen } from "lucide-react-native";
import { COLORS } from "@/constants/theme";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No products found in this category",
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-20">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-background-secondary">
        <PackageOpen size={40} color={COLORS.textMuted} strokeWidth={1.5} />
      </View>
      <Text className="text-center font-poppins-medium text-base text-text-secondary">
        {message}
      </Text>
      <Text className="mt-2 text-center font-poppins text-sm text-text-muted">
        Check back soon for new arrivals
      </Text>
    </View>
  );
}
