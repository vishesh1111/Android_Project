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
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShoppingCart, MessageCircle, CheckCircle } from "lucide-react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductImage from "@/components/ProductImage";
import SpecificationRow from "@/components/SpecificationRow";
import { CATEGORIES } from "@/constants/categories";
import { getLocalProductById } from "@/constants/products";
import { COLORS } from "@/constants/theme";
import type { Product, MainCategory } from "@/lib/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { mainCategory, subCategory, productId } = useLocalSearchParams<{
    mainCategory: string;
    subCategory: string;
    productId: string;
  }>();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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

  const handlePlaceOrder = () => {
    Alert.alert(
      "Place Order",
      `Thank you for your interest in "${product?.name}". Our team will contact you shortly to confirm your order.`,
      [{ text: "OK" }]
    );
  };

  const handleEnquiry = () => {
    const message = `Hi, I'm interested in ${product?.name} (${categoryData?.label} - ${subCategoryData?.label}). Please share more details.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Enquiry",
        "Our team will get back to you shortly regarding this product.",
        [{ text: "OK" }]
      );
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
          className="absolute left-4 top-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-[#222]/90 active:bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <ArrowLeft size={22} color={COLORS.textPrimary} strokeWidth={2} />
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
              <ProductImage
                key={index}
                uri={uri}
                className="bg-background-secondary"
                contentFit="contain"
                style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 0.85 }}
              />
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
          <Pressable
            onPress={handleEnquiry}
            className="flex-1 flex-row items-center justify-center rounded-button border-2 border-primary py-3.5 active:bg-primary/5"
          >
            <MessageCircle
              size={18}
              color={COLORS.primary}
              strokeWidth={2}
            />
            <Text className="ml-2 font-poppins-semibold text-sm text-primary">
              Enquire Now
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePlaceOrder}
            className="flex-1 flex-row items-center justify-center rounded-button bg-primary py-3.5 active:bg-primary-dark"
          >
            <ShoppingCart size={18} color="#FFFFFF" strokeWidth={2} />
            <Text className="ml-2 font-poppins-semibold text-sm text-white">
              Place Order
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
