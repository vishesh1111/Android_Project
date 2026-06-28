import React, { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

function SkeletonCard() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1, // infinite
      true // reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: CARD_WIDTH,
          marginBottom: 16,
        },
        animatedStyle,
      ]}
      className="overflow-hidden rounded-card bg-white dark:bg-[#1a1a1a]"
    >
      {/* Image placeholder */}
      <View
        className="w-full bg-border dark:bg-[#333]"
        style={{ height: CARD_WIDTH * 0.85 }}
      />
      {/* Text placeholders */}
      <View className="p-3">
        <View className="h-4 w-4/5 rounded bg-border dark:bg-[#333]" />
        <View className="mt-2 h-3 w-3/5 rounded bg-border dark:bg-[#333]" />
        <View className="mt-3 h-5 w-2/5 rounded bg-border dark:bg-[#333]" />
      </View>
    </Animated.View>
  );
}

export default function LoadingSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between px-4 pt-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
