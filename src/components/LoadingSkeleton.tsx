import React, { useEffect, useRef } from "react";
import { View, Animated, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        opacity,
        marginBottom: 16,
      }}
      className="overflow-hidden rounded-card bg-white"
    >
      {/* Image placeholder */}
      <View
        className="w-full bg-border-light"
        style={{ height: CARD_WIDTH * 0.85 }}
      />
      {/* Text placeholders */}
      <View className="p-3">
        <View className="h-4 w-4/5 rounded bg-border-light" />
        <View className="mt-2 h-3 w-3/5 rounded bg-border-light" />
        <View className="mt-3 h-5 w-2/5 rounded bg-border-light" />
      </View>
    </Animated.View>
  );
}

export default function LoadingSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between px-4 pt-4">
      {[1, 2, 3, 4].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}
