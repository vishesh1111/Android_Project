import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Linking,
  Dimensions,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShoppingCart, MessageCircle, CheckCircle, Check, Plus, Minus } from "lucide-react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductImage from "@/components/ProductImage";
import FullScreenImageViewer from "@/components/FullScreenImageViewer";
import SpecificationRow from "@/components/SpecificationRow";
import { CATEGORIES } from "@/constants/categories";
import { getLocalProductById } from "@/constants/products";
import { COLORS } from "@/constants/theme";
import { useCart } from "@/lib/CartContext";
import type { Product, MainCategory } from "@/lib/types";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringButton({ onPress, children, className, style, hitSlop }: any) {
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
      hitSlop={hitSlop}
    >
      {children}
    </AnimatedPressable>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { mainCategory, subCategory, productId } = useLocalSearchParams<{
    mainCategory: string;
    subCategory: string;
    productId: string;
  }>();
  const router = useRouter();
  const { addToCart, isInCart, getItemCount, getItemQuantity, updateQuantity } = useCart();
  const colorScheme = useColorScheme();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImageSource, setViewerImageSource] = useState<any>(null);
  const [justAdded, setJustAdded] = useState(false);

  const categoryData = CATEGORIES[mainCategory as MainCategory];
  const subCategoryData = categoryData?.subcategories.find(
    (sc) => sc.id === subCategory
  );

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      // Check local data first (for demo)
      const localProduct = getLocalProductById(productId as string);
      if (localProduct) {
        setProduct(localProduct);
        return;
      }

      // Fallback to Firebase
      const docRef = doc(db, "products", productId as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() ?? new Date(),
        } as Product);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const alreadyInCart = isInCart(product.id);
    addToCart({
      productId: product.id,
      name: product.name,
      type: product.type,
      image: product.images?.[0] ?? null,
      mainCategory: product.mainCategory,
      subCategory: product.subCategory,
    });
    if (!alreadyInCart) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const cartItemCount = getItemCount();
  const productInCart = product ? isInCart(product.id) : false;
  const currentQuantity = product ? getItemQuantity(product.id) : 0;

  const handleIncrement = () => {
    if (!product) return;
    updateQuantity(product.id, currentQuantity + 1);
  };

  const handleDecrement = () => {
    if (!product) return;
    updateQuantity(product.id, currentQuantity - 1);
  };

  const handleEnquiry = () => {
    if (!product) return;
    router.push({
      pathname: "/enquiry",
      params: {
        productName: product.name,
        productType: product.type,
        productId: product.id,
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <Text className="font-poppins-medium text-base text-text-secondary">
          Product not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-4 rounded-button bg-primary px-6 py-3"
        >
          <Text className="font-poppins-semibold text-sm text-white">
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const specEntries = Object.entries(product.specifications ?? {});
  const features = product.features ?? [];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#0f0f0f]" edges={["top"]}>
      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Back Button (Floating) */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#222] active:bg-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <ArrowLeft size={22} color={colorScheme === 'dark' ? '#fff' : COLORS.textPrimary} strokeWidth={2} />
        </Pressable>

        {/* Cart Button (Floating) */}
        <Pressable
          onPress={() => router.push("/cart")}
          className="absolute right-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#222] active:bg-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <ShoppingCart size={20} color={colorScheme === 'dark' ? '#fff' : COLORS.textPrimary} strokeWidth={2} />
          {cartItemCount > 0 && (
            <View
              className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1"
            >
              <Text className="font-poppins-semibold text-[10px] text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Product Images */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH
            );
            setActiveImageIndex(index);
          }}
        >
          {(product.images?.length > 0 ? product.images : [""]).map(
            (uri, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  setViewerImageSource(uri);
                  setImageViewerVisible(true);
                }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.85 }}
              >
                <ProductImage
                  source={uri}
                  className="bg-background-secondary"
                  contentFit="contain"
                  style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.85 }}
                />
              </Pressable>
            )
          )}
        </ScrollView>

        {/* Image Dots */}
        {product.images?.length > 1 && (
          <View className="mt-3 flex-row items-center justify-center">
            {product.images.map((_, index) => (
              <View
                key={index}
                className={`mx-1 h-2 rounded-full ${
                  index === activeImageIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </View>
        )}

        {/* Product Info */}
        <View className="px-5 pt-5">
          {/* Badges */}
          <View className="mb-3 flex-row flex-wrap">
            <View className="mr-2 mb-1 rounded-full bg-primary/10 px-3 py-1">
              <Text className="font-poppins-medium text-xs text-primary">
                {categoryData?.label ?? mainCategory}
              </Text>
            </View>
            <View className="mr-2 mb-1 rounded-full bg-background-secondary dark:bg-[#1a1a1a] px-3 py-1">
              <Text className="font-poppins-medium text-xs text-text-secondary dark:text-gray-400">
                {subCategoryData?.label ?? subCategory}
              </Text>
            </View>
            {product.type && (
              <View className="mb-1 rounded-full bg-[#EBF5FF] dark:bg-[#1a2332] px-3 py-1">
                <Text className="font-poppins-medium text-xs text-[#2563EB] dark:text-[#60A5FA]">
                  {product.type}
                </Text>
              </View>
            )}
          </View>

          {/* Name */}
          <Text className="font-poppins-bold text-2xl text-text-primary dark:text-white">
            {product.name}
          </Text>

          {/* Stock Status */}
          <View className="mt-2 flex-row items-center">
            <View
              className={`h-2 w-2 rounded-full ${
                product.inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <Text
              className={`ml-2 font-poppins-medium text-sm ${
                product.inStock ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>

          {/* Divider */}
          <View className="my-5 h-px bg-border dark:bg-[#333]" />

          {/* Features & Highlights */}
          {features.length > 0 && (
            <View className="mb-6">
              <Text className="mb-3 font-poppins-semibold text-lg text-text-primary dark:text-white">
                Features & Highlights
              </Text>
              <View className="rounded-2xl border border-border dark:border-[#333] bg-[#FAFBFC] dark:bg-[#111] p-4">
                {features.map((feature, index) => (
                  <View
                    key={index}
                    className={`flex-row items-start ${
                      index < features.length - 1 ? "mb-3" : ""
                    }`}
                  >
                    <CheckCircle
                      size={16}
                      color={COLORS.primary}
                      strokeWidth={2}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <Text className="ml-3 flex-1 font-poppins text-sm leading-5 text-text-secondary dark:text-gray-300">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          {product.fullDescription ? (
            <>
              <Text className="mb-2 font-poppins-semibold text-base text-text-primary dark:text-white">
                Description
              </Text>
              <Text className="font-poppins text-sm leading-6 text-text-secondary dark:text-gray-400">
                {product.fullDescription}
              </Text>
            </>
          ) : null}

          {/* Specifications */}
          {specEntries.length > 0 && (
            <View className="mt-6">
              <Text className="mb-3 font-poppins-semibold text-lg text-text-primary dark:text-white">
                Key Specifications
              </Text>
              <View className="overflow-hidden rounded-2xl border border-border dark:border-[#333]">
                {specEntries.map(([key, value], index) => (
                  <SpecificationRow
                    key={key}
                    label={key}
                    value={value}
                    index={index}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed CTA Buttons */}
      <SafeAreaView edges={["bottom"]} className="border-t border-border dark:border-[#333] bg-white dark:bg-[#0f0f0f]">
        <View className="flex-row gap-3 px-5 py-3">
          <SpringButton
            onPress={handleEnquiry}
            className="flex-1 flex-row items-center justify-center rounded-button border-2 border-primary py-3.5"
          >
            <MessageCircle
              size={18}
              color={COLORS.primary}
              strokeWidth={2}
            />
            <Text className="ml-2 font-poppins-semibold text-sm text-primary">
              Enquire Now
            </Text>
          </SpringButton>

          {productInCart && !justAdded ? (
            <View className="flex-1 flex-row items-center justify-between rounded-button border-2 border-primary bg-primary/5 px-2 py-1.5">
              <SpringButton
                onPress={handleDecrement}
                className="h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-[#1a1a1a]"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Minus size={20} color={COLORS.primary} strokeWidth={2.5} />
              </SpringButton>
              
              <Text className="font-poppins-bold text-lg text-primary">
                {currentQuantity}
              </Text>

              <SpringButton
                onPress={handleIncrement}
                className="h-11 w-11 items-center justify-center rounded-full bg-primary"
                style={{
                  shadowColor: "#B91C1C",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Plus size={20} color="#fff" strokeWidth={2.5} />
              </SpringButton>
            </View>
          ) : (
            <SpringButton
              onPress={justAdded ? () => router.push("/cart") : handleAddToCart}
              className={`flex-1 flex-row items-center justify-center rounded-button py-3.5 ${
                justAdded
                  ? "bg-green-600"
                  : "bg-primary"
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
                  <Text className="ml-2 font-poppins-semibold text-sm text-white">
                    Go to Cart
                  </Text>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="ml-2 font-poppins-semibold text-sm text-white">
                    Add to Cart
                  </Text>
                </>
              )}
            </SpringButton>
          )}
        </View>
      </SafeAreaView>

      {/* Full Screen Image Viewer */}
      <FullScreenImageViewer
        visible={imageViewerVisible}
        source={viewerImageSource}
        onClose={() => setImageViewerVisible(false)}
        onEnquire={handleEnquiry}
      />
    </SafeAreaView>
  );
}
