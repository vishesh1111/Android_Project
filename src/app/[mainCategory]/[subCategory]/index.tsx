import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductCard from "@/components/ProductCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import { CATEGORIES } from "@/constants/categories";
import { getLocalProducts } from "@/constants/products";
import { COLORS } from "@/constants/theme";
import type { Product, MainCategory } from "@/lib/types";

export default function ProductListingScreen() {
  const { mainCategory, subCategory } = useLocalSearchParams<{
    mainCategory: string;
    subCategory: string;
  }>();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Get subcategory label from constants
  const categoryData = CATEGORIES[mainCategory as MainCategory];
  const subCategoryData = categoryData?.subcategories.find(
    (sc) => sc.id === subCategory
  );
  const subCategoryLabel = subCategoryData?.label ?? subCategory ?? "";

  useEffect(() => {
    fetchProducts();
  }, [mainCategory, subCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Check for local/hardcoded data first (for demo)
      const localProducts = getLocalProducts(
        mainCategory as string,
        subCategory as string
      );
      if (localProducts.length > 0) {
        setProducts(localProducts);
        return;
      }

      // Fallback to Firebase
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
        <View className="rounded-full bg-primary/10 px-3 py-1">
          <Text className="font-poppins-medium text-xs text-primary">
            {loading ? "..." : `${products.length} items`}
          </Text>
        </View>
      </View>

      {/* Product Grid */}
      {loading ? (
        <LoadingSkeleton />
      ) : products.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                router.push(`/${mainCategory}/${subCategory}/${item.id}`)
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
