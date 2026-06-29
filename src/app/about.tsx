import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#0f0f0f]">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="font-poppins-bold text-xl text-primary tracking-wide">
          ABOUT US
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="font-poppins-bold text-4xl text-primary mb-6 uppercase tracking-tighter">
          ABOUT US
        </Text>

        <View className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          
          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            We at VIVA FITNESS are distributing some of the world's best fitness equipment, that are sold and serviced in more than hundred countries. From hi-tech treadmills to ergonomic bikes, crosstrainers and gyms, our product range mirrors our dedication to provide products that standout in the crowded fitness market.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            <Text className="font-poppins-bold text-[#1A1A1A] dark:text-white">R&D : </Text>We have our own high technical team consisting of mechanical engineers, industrial stylists & biomechanic experts. Besides this, we have also hired international experts who continuously guide us in attaining higher standards.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            <Text className="font-poppins-bold text-[#1A1A1A] dark:text-white">Production Facility & Technology : </Text>World's most advanced manufacturing machines including the laser cutting machines from Germany, robot welding equipment from Japan, CNC mould making machines & latest spray painting technology is used to produce Viva Fitness cardio equipment. Excellent surface treatment technology ensures uniform quality and no rust to our equipment for lifetime.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            <Text className="font-poppins-bold text-[#1A1A1A] dark:text-white">Quality Inspection : </Text>Our factories strictly execute the ISO 9001 quality management system for maintaining high standards. We also follow strict standards for testing raw materials, welding precision & finish product testing for durability as per international standards. Never satisfied with the status quo, we are always trying to improve our product quality.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            <Text className="font-poppins-bold text-[#1A1A1A] dark:text-white">After Sales Service : </Text>We have our after sales offices across the country with sufficient stock of spare parts & trained technicians.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-6">
            From the first-timer to the hardcore exerciser, we know that all users have high expectations, so we spend significant time and resources asking them what they want and need. It's simply our way of letting the user know that we have their interests in mind every step of the way.
          </Text>

          <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[15px] leading-7 mb-8">
            As a dominant supplier of cardio equipment, we know that your facility is more than what kind of machines you offer. It's really about the experience you provide. That's why we're fully committed to working with our customers in order to help them offer their clientele a truly rewarding fitness environment. Whether it's a commercial fitness center, a hotel or university gym, or the workout space in a multi-housing complex, our one-on-one approach and speedy service coverage guarantees that we'll be there for you in every possible way.
          </Text>

          <View className="bg-[#FFF6F6] dark:bg-[#2A1616] p-4 rounded-xl items-center justify-center">
            <Text className="font-poppins-bold text-lg text-primary text-center uppercase tracking-widest">
              We have a singular focus : THE USER
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
