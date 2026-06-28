import React from "react";
import { Pressable, View, Text, Dimensions } from "react-native";
import ProductImage from "./ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 16px padding on each side + 16px gap

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-card bg-white active:scale-[0.97]"
      style={{
        width: CARD_WIDTH,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Product Image */}
      <ProductImage
        source={product.images?.[0] ?? ""}
        className="w-full"
        style={{ height: CARD_WIDTH * 0.85 }}
      />

      {/* Product Info */}
      <View className="p-3">
        <Text
          className="font-poppins-semibold text-sm text-text-primary"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        <Text
          className="mt-1 font-poppins text-xs text-text-secondary"
          numberOfLines={1}
        >
          {product.type || product.shortDescription}
        </Text>

        <View className="mt-2 flex-row items-center justify-between">
          <Text className="font-poppins-medium text-xs text-primary" numberOfLines={1}>
            {product.specifications?.["Motor"]?.split("(")[0]?.trim() ?? ""}
          </Text>

          {product.inStock ? (
            <View className="rounded-full bg-green-50 px-2 py-0.5">
              <Text className="font-poppins-medium text-[10px] text-green-700">
                In Stock
              </Text>
            </View>
          ) : (
            <View className="rounded-full bg-red-50 px-2 py-0.5">
              <Text className="font-poppins-medium text-[10px] text-red-700">
                Out of Stock
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
