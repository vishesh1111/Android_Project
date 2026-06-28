import React, { useEffect } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { ChevronRight, Building2, Home } from "lucide-react-native";
import { COLORS } from "@/constants/theme";
import { CATEGORIES } from "@/constants/categories";
import type { MainCategory } from "@/lib/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

// cubic-bezier(0.4, 0, 0.2, 1) — "material standard" easing for a premium feel
const PREMIUM_EASING = Easing.bezier(0.4, 0, 0.2, 1);
const PULSE_DURATION = 2500;
const BUTTON_SIZE = 48; // 12 * 4 (w-12 h-12)
const PULSE_COLOR = "#b91c1c";

/**
 * Soft Pulse Button
 *
 * A static circular arrow button with a rhythmic radial pulse expanding
 * from its center on a layer BEHIND the arrow icon. The button, icon,
 * card and text remain perfectly static.
 *
 * Spec:
 *  - Pulse scales 1.0x -> 1.5x over the cycle
 *  - Pulse opacity 0.4 -> 0 as it expands
 *  - 2.5s duration, cubic-bezier(0.4, 0, 0.2, 1)
 */
function SoftPulseButton() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    // Slow, breathing rhythm: scale up + fade out, then loop
    scale.value = withRepeat(
      withTiming(1.5, { duration: PULSE_DURATION, easing: PREMIUM_EASING }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: PULSE_DURATION, easing: PREMIUM_EASING }),
      -1,
      false
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [scale, opacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.buttonHitArea} pointerEvents="none">
      {/* Pulse layer — sits BEHIND the arrow icon, contained within the button */}
      <Animated.View
        pointerEvents="none"
        style={[styles.pulseLayer, { backgroundColor: PULSE_COLOR }, pulseStyle]}
      />
      {/* Static arrow button on top */}
      <View style={styles.staticButton}>
        <ChevronRight size={20} color={COLORS.primary} strokeWidth={2.5} />
      </View>
    </View>
  );
}

export default function CategoryCard({
  category,
  label,
  subtitle,
  onPress,
}: CategoryCardProps) {
  const Icon = ICONS[category];
  const isCommercial = category === "commercial";
  const { description } = CATEGORIES[category];

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className="mb-5 overflow-hidden rounded-3xl bg-white dark:bg-[#1a1a1a] p-6 border border-transparent dark:border-[#333333]"
      style={[
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 3,
        },
        animatedStyle,
      ]}
    >
      {/* Icon Container — STATIC */}
      <View
        className={`mb-5 h-16 w-16 items-center justify-center rounded-2xl ${
          isCommercial
            ? "bg-primary dark:bg-primary/90"
            : "bg-[#FDE8E8] dark:bg-[#202736]"
        }`}
        style={
          isCommercial
            ? { shadowColor: "#B91C1C", shadowOpacity: 0.3, shadowRadius: 10 }
            : { shadowColor: "#B91C1C", shadowOpacity: 0.1, shadowRadius: 10 }
        }
      >
        <Icon
          size={32}
          color={isCommercial ? "#FFFFFF" : COLORS.primary}
          strokeWidth={2}
        />
      </View>

      {/* Text Content — STATIC */}
      <Text className="font-poppins-bold text-2xl text-[#1A202C] dark:text-white">
        {label}
      </Text>

      {/* Description and Arrow Row */}
      <View className="mt-2 flex-row items-end justify-between">
        {/* Description — STATIC */}
        <Text className="flex-1 pr-4 font-poppins text-sm leading-6 text-[#4A5568] dark:text-[#a1a1a1]">
          {description}
        </Text>

        {/* Soft Pulse Animated Arrow Button */}
        <SoftPulseButton />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  buttonHitArea: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseLayer: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
  },
  staticButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "#FDE8E8",
  },
});
