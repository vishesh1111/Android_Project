import React from "react";
import { Pressable } from "react-native";
import { Sun, Moon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { COLORS } from "@/constants/theme";

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="h-10 w-10 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
    >
      {colorScheme === "dark" ? (
        <Sun size={24} color="#FFFFFF" strokeWidth={2} />
      ) : (
        <Moon size={24} color={COLORS.primary} strokeWidth={2} />
      )}
    </Pressable>
  );
}
