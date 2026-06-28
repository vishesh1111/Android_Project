import React, { useEffect, useState, useMemo } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { View, Text, FlatList, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { CATEGORIES } from "@/constants/categories";
import { getLocalProducts } from "@/constants/products";
import { COLORS } from "@/constants/theme";
import { useCart } from "@/lib/CartContext";
import type { Product, MainCategory } from "@/lib/types";

const COMMERCIAL_STRENGTH_SERIES = [
  "Signature Series (PC)",
  "LEGACY SERIES (IP) – Selectorized Station",
  "LEGACY SERIES (IP) - Benches & Racks",
  "IT95 Series – Selectorized Station",
  "IT Series - Benches & Racks",
  "BS Series – Selectorized Station",
  "KG Series Black – Selectorized Station",
  "KG Series Black – Benches & Racks",
  "Select Line (BR) - Selectorized Station",
  "Conquer Series (PS) - Selectorized Station",
  "BH Series - Spanish Design",
  "E Series – Selectorized Station",
  "E Series – Benches & Racks",
  "Sigma Series (SS) – Selectorized Station",
  "Titan Series - Plate Loading",
  "PL Series – Plate Loading",
  "JPL Series - Plate Loading",
  "Beast Series – Benches & Racks",
  "FL Series - Benches & Racks",
  "IF Series - Benches & Racks",
  "General - Equipment",
  "Multi Station Gyms",
  "Weight Lifting Platform & Add-ons",
  "Free Weights",
  "Barbells & Handles",
];

const COMMERCIAL_BIKE_SERIES = [
  "Recumbent Bikes",
  "Upright Bikes",
  "Group Bikes",
  "Air Bikes",
];

export default function ProductListingScreen() {
  const { mainCategory, subCategory } = useLocalSearchParams<{
    mainCategory: string;
    subCategory: string;
  }>();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const categoryData = CATEGORIES[mainCategory as MainCategory];
  const subCategoryData = categoryData?.subcategories.find(
    (sc) => sc.id === subCategory
  );
  const subCategoryLabel = subCategoryData?.label ?? subCategory ?? "";

  const isCommercialStrength = mainCategory === 'commercial' && subCategory === 'strength-training';
  const isCommercialBikes = mainCategory === 'commercial' && subCategory === 'bikes';

  const filterSeriesList = isCommercialStrength 
    ? COMMERCIAL_STRENGTH_SERIES 
    : isCommercialBikes 
      ? COMMERCIAL_BIKE_SERIES 
      : null;

  useEffect(() => {
    if (filterSeriesList) {
      setSelectedSeries(filterSeriesList[0]);
    } else {
      setSelectedSeries(null);
    }
    fetchProducts();
  }, [mainCategory, subCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const localProducts = getLocalProducts(
        mainCategory as string,
        subCategory as string
      );
      if (localProducts.length > 0) {
        setProducts(localProducts);
        return;
      }

      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("mainCategory", "==", mainCategory),
        where("subCategory", "==", subCategory)
      );
      const snapshot = await getDocs(q);
      const fetchedProducts: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? new Date(),
      })) as Product[];

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = useMemo(() => {
    if (filterSeriesList && selectedSeries) {
      return products.filter((p) => {
        if (p.type === selectedSeries || p.series === selectedSeries) return true;
        // Handle plural to singular mapping (e.g., "Recumbent Bikes" -> "Recumbent Bike")
        const singularSeries = selectedSeries.replace(/s$/, '');
        if (p.type && p.type.includes(singularSeries)) return true;
        return false;
      });
    }
    return products;
  }, [products, filterSeriesList, selectedSeries]);

  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      {/* Header */}
      <View className="flex-row items-center border-b border-border bg-white px-4 py-4">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} strokeWidth={2} />
        </Pressable>
        <View className="flex-1">
          <Text className="font-poppins-bold text-xl text-text-primary">
            {subCategoryLabel}
          </Text>
          <Text className="font-poppins text-xs text-text-secondary">
            {categoryData?.label ?? ""}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-primary/10 px-3 py-1">
            <Text className="font-poppins-medium text-xs text-primary">
              {loading ? "..." : `${displayedProducts.length} items`}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/cart")}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-background-secondary"
          >
            <ShoppingCart size={22} color={COLORS.textPrimary} strokeWidth={2} />
            {cartItemCount > 0 && (
              <View className="absolute -right-1 -top-1 h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1">
                <Text className="font-poppins-semibold text-[10px] text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* Series Filter */}
      {filterSeriesList && (
        <View className="bg-white border-b border-border">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
          >
            {filterSeriesList.map((series) => {
              const isActive = selectedSeries === series;
              return (
                <Pressable
                  key={series}
                  onPress={() => setSelectedSeries(series)}
                  className={`px-4 py-2 rounded-full border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-background-secondary border-border"
                  }`}
                >
                  <Text
                    className={`font-poppins-medium text-sm ${
                      isActive ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    {series}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Product Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : displayedProducts.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
              <ProductCard
                product={item}
                onPress={() =>
                  router.push(`/${mainCategory}/${subCategory}/${item.id}`)
                }
              />
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
