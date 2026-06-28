import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import type { StyleProp, ViewStyle } from "react-native";

interface ProductImageProps {
  source: any;
  className?: string;
  contentFit?: "cover" | "contain" | "fill";
  style?: StyleProp<ViewStyle>;
}

const PLACEHOLDER_BLURHASH =
  "L6PZfSjE.AyE_3t7t7R**0o#DgR4";

export default function ProductImage({
  source,
  className = "",
  contentFit = "cover",
  style,
}: ProductImageProps) {
  if (!source) {
    return (
      <View
        className={`items-center justify-center bg-background-secondary ${className}`}
        style={style}
      >
        <Text className="font-poppins text-xs text-text-muted">
          No Image
        </Text>
      </View>
    );
  }

  // Handle both string URIs and static require() sources
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <Image
      source={imageSource}
      placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
      contentFit={contentFit}
      transition={200}
      className={className}
      style={style}
    />
  );
}
