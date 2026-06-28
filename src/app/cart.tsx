import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
} from "lucide-react-native";
import { Image } from "expo-image";
import { useCart } from "@/lib/CartContext";
import { COLORS } from "@/constants/theme";
import { Linking } from "react-native";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringButton({ onPress, children, className, style }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.95, { damping: 12, stiffness: 400 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 12, stiffness: 400 }))}
      className={className}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, getItemCount } =
    useCart();

  const totalItems = getItemCount();

  const handleEnquireAll = () => {
    if (items.length === 0) return;
    const itemsList = items
      .map((i) => `• ${i.name} (x${i.quantity})`)
      .join("\n");
    const message = `Hi, I'm interested in the following products:\n${itemsList}\n\nPlease share more details and pricing.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Enquiry Sent",
        "Our team will get back to you shortly regarding these products.",
        [{ text: "OK" }]
      );
    });
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearCart(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f0f0f]" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-border dark:border-[#333] px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-[#222]"
        >
          <ArrowLeft size={22} color={COLORS.textPrimary} strokeWidth={2} />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="font-poppins-semibold text-lg text-text-primary dark:text-white">
            My Cart
          </Text>
          {totalItems > 0 && (
            <Text className="font-poppins text-xs text-text-secondary dark:text-gray-400">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Text>
          )}
        </View>
        {items.length > 0 ? (
          <Pressable
            onPress={handleClearCart}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-[#222]"
          >
            <Trash2 size={20} color={COLORS.primary} strokeWidth={2} />
          </Pressable>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      {items.length === 0 ? (
        /* ── Empty State ────────────────────────────── */
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag size={48} color={COLORS.primary} strokeWidth={1.5} />
          </View>
          <Text className="font-poppins-semibold text-xl text-text-primary dark:text-white">
            Your cart is empty
          </Text>
          <Text className="mt-2 text-center font-poppins text-sm text-text-secondary dark:text-gray-400">
            Browse our premium gym equipment and add items to your cart
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-8 rounded-button bg-primary px-8 py-3.5 active:bg-primary-dark"
          >
            <Text className="font-poppins-semibold text-sm text-white">
              Browse Products
            </Text>
          </Pressable>
        </View>
      ) : (
        /* ── Cart Items ─────────────────────────────── */
        <>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
          >
            {items.map((item, idx) => {
              const imageSource =
                typeof item.image === "string"
                  ? { uri: item.image }
                  : item.image;

              return (
                <Animated.View
                  entering={FadeInDown.delay(idx * 50).duration(300)}
                  key={item.productId}
                  className={`mx-4 rounded-2xl border border-border dark:border-[#333] bg-[#FAFBFC] dark:bg-[#111] p-3 ${
                    idx > 0 ? "mt-3" : ""
                  }`}
                >
                  {/* Tappable area → navigates to product detail */}
                  <Pressable
                    onPress={() =>
                      router.push(
                        `/${item.mainCategory}/${item.subCategory}/${item.productId}`
                      )
                    }
                    className="flex-row"
                  >
                    {/* Product Image */}
                    <View className="h-24 w-24 overflow-hidden rounded-xl bg-white dark:bg-[#1a1a1a]">
                      {item.image ? (
                        <Image
                          source={imageSource}
                          contentFit="contain"
                          style={{ width: 96, height: 96 }}
                          transition={200}
                        />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <Text className="font-poppins text-xs text-text-muted">
                            No Image
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Product Info */}
                    <View className="ml-3 flex-1 justify-center">
                      <Text
                        className="font-poppins-semibold text-base text-text-primary dark:text-white"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className="mt-0.5 font-poppins text-xs text-text-secondary dark:text-gray-400"
                        numberOfLines={1}
                      >
                        {item.type}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Quantity Controls */}
                  <View className="mt-2 flex-row items-center justify-between">
                    <View className="flex-row items-center rounded-xl border border-border dark:border-[#444] overflow-hidden">
                      <SpringButton
                        onPress={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="h-9 w-9 items-center justify-center bg-transparent"
                      >
                        <Minus
                          size={16}
                          color={COLORS.textSecondary}
                          strokeWidth={2.5}
                        />
                      </SpringButton>
                      <View className="h-9 w-10 items-center justify-center border-x border-border dark:border-[#444]">
                        <Text className="font-poppins-semibold text-sm text-text-primary dark:text-white">
                          {item.quantity}
                        </Text>
                      </View>
                      <SpringButton
                        onPress={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="h-9 w-9 items-center justify-center bg-transparent"
                      >
                        <Plus
                          size={16}
                          color={COLORS.primary}
                          strokeWidth={2.5}
                        />
                      </SpringButton>
                    </View>

                    {/* Remove Button */}
                    <SpringButton
                      onPress={() => removeFromCart(item.productId)}
                      className="h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20"
                    >
                      <Trash2 size={18} color="#EF4444" strokeWidth={2} />
                    </SpringButton>
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>

          {/* Bottom CTA */}
          <SafeAreaView
            edges={["bottom"]}
            className="border-t border-border dark:border-[#333] bg-white dark:bg-[#0f0f0f]"
          >
            <View className="px-5 py-3">
              <SpringButton
                onPress={handleEnquireAll}
                className="flex-row items-center justify-center rounded-button bg-primary py-4"
              >
                <MessageCircle size={20} color="#FFFFFF" strokeWidth={2} />
                <Text className="ml-2 font-poppins-semibold text-base text-white">
                  Enquire All ({totalItems} {totalItems === 1 ? "item" : "items"})
                </Text>
              </SpringButton>
            </View>
          </SafeAreaView>
        </>
      )}
    </SafeAreaView>
  );
}
