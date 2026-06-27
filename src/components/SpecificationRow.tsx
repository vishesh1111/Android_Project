import React from "react";
import { View, Text } from "react-native";

interface SpecificationRowProps {
  label: string;
  value: string;
  index: number;
}

export default function SpecificationRow({
  label,
  value,
  index,
}: SpecificationRowProps) {
  return (
    <View
      className={`flex-row items-center px-4 py-3 ${
        index % 2 === 0
          ? "bg-background-secondary dark:bg-[#1a1a1a]"
          : "bg-white dark:bg-[#111]"
      }`}
    >
      <Text className="w-2/5 font-poppins-medium text-sm text-text-secondary dark:text-gray-400">
        {label}
      </Text>
      <Text className="flex-1 font-poppins text-sm text-text-primary dark:text-gray-200">
        {value}
      </Text>
    </View>
  );
}
