import Animated, { FadeInDown } from "react-native-reanimated";
import CategoryCard from "@/components/CategoryCard";
import ThemeToggle from "@/components/ThemeToggle";
import { CATEGORIES } from "@/constants/categories";
import type { MainCategory } from "@/lib/types";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectionScreen() {
  const router = useRouter();

  const handleCategoryPress = (category: MainCategory) => {
    router.push(`/${category}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#0f0f0f]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Options */}
        <View className="items-end px-4 pt-4">
          <ThemeToggle />
        </View>

        {/* Header */}
        <View className="items-center px-6 pb-8 pt-2">
          <Text className="font-poppins-bold text-3xl text-primary tracking-wide">
            VIVA FITNESS
          </Text>
          <Text className="mt-2 text-center font-poppins text-sm text-[#4A5568] dark:text-gray-300">
            Premium Gym Equipments for Every Need
          </Text>
        </View>

        {/* Category Selection */}
        <View className="px-6">
          {(Object.keys(CATEGORIES) as MainCategory[]).map((key, index) => (
            <Animated.View 
              key={key}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <CategoryCard
                category={key}
                label={CATEGORIES[key].label}
                subtitle={CATEGORIES[key].subtitle}
                onPress={() => handleCategoryPress(key)}
              />
            </Animated.View>
          ))}
        </View>

        {/* Footer */}
        <View className="mt-auto items-center pb-8 pt-10">
          <Text className="font-poppins text-xs font-medium text-[#718096] dark:text-gray-500">
            Trusted By Gyms Across India
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
