import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import type { StyleProp, ViewStyle } from "react-native";

interface ProductImageProps {
  uri: string;
  className?: string;
  contentFit?: "cover" | "contain" | "fill";
  style?: StyleProp<ViewStyle>;
}

const PLACEHOLDER_BLURHASH =
  "L6PZfSjE.AyE_3t7t7R**0o#DgR4";

export default function ProductImage({
  uri,
  className = "",
  contentFit = "cover",
  style,
}: ProductImageProps) {
  if (!uri) {
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

  return (
    <Image
      source={{ uri }}
      placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
      contentFit={contentFit}
      transition={200}
      className={className}
      style={style}
    />
  );
}
