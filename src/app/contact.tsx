import React from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export default function ContactScreen() {
  const router = useRouter();

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open link", err));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB] dark:bg-[#0f0f0f]">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <ArrowLeft size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text className="font-poppins-bold text-xl text-primary tracking-wide">
          CONTACT
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text className="font-poppins-bold text-5xl text-primary mb-8 uppercase tracking-tighter">
          CONTACT
        </Text>

        <View className="bg-white dark:bg-[#1A1A1A] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          
          {/* Email */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity 
              onPress={() => handleLink('mailto:info@vivafitness.net')}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mr-4"
              activeOpacity={0.7}
            >
              <Mail color="#4A4A4A" className="dark:text-white" size={24} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[17px] leading-7">
                Send us an email at{" "}
                <Text 
                  onPress={() => handleLink('mailto:info@vivafitness.net')} 
                  className="text-[#0066CC] dark:text-[#4da6ff] font-poppins"
                >
                  info@vivafitness.net
                </Text>
              </Text>
            </View>
          </View>

          {/* Mobile */}
          <View className="flex-row items-center mb-8">
            <TouchableOpacity 
              onPress={() => handleLink('tel:+919041115347')}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mr-4"
              activeOpacity={0.7}
            >
              <Phone color="#4A4A4A" className="dark:text-white" size={24} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[17px] leading-7">
                Mobile :{" "}
                <Text onPress={() => handleLink('tel:+919041115347')} className="font-poppins text-[#1A1A1A] dark:text-white">
                  904 111 5347
                </Text>
                ,{" "}
                <Text onPress={() => handleLink('tel:+919999995455')} className="font-poppins text-[#1A1A1A] dark:text-white">
                  9999995455
                </Text>
              </Text>
            </View>
          </View>

          {/* WhatsApp */}
          <View className="flex-row items-center">
            {/* The prompt specifically asks to make the link directly embedded to the whatsapp logo */}
            <TouchableOpacity 
              onPress={() => handleLink('https://wa.me/919141550000')}
              className="bg-[#25D366] p-4 rounded-full mr-4 shadow-sm"
              activeOpacity={0.7}
            >
              <MessageCircle color="white" size={24} />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="font-poppins text-[#4A4A4A] dark:text-gray-300 text-[17px] leading-7">
                WhatsApp:{" "}
                <Text onPress={() => handleLink('https://wa.me/919141550000')} className="font-poppins text-[#1A1A1A] dark:text-white">
                  914 155 0000
                </Text>
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
