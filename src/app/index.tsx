import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Smartphone, Gift, ChevronDown, ChevronRight } from 'lucide-react-native';
import { COLORS } from "@/constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const handleContinue = () => {
    if (!fullName.trim() || !mobileNumber.trim()) {
      Alert.alert(
        "Missing Information", 
        "Please enter your Full Name and Mobile Number to proceed."
      );
      return;
    }
    
    // In a real app, you might want to save this data to AsyncStorage or your backend here
    
    router.replace('/selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A1A]" edges={['top', 'bottom']}>
      {/* Add a dotted background pattern here if needed in the future, for now using a solid dark background */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center p-4"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-white rounded-3xl p-6 shadow-lg m-2">
            <Text 
              className="text-center font-poppins-bold text-xl mb-6"
              style={{ color: COLORS.primary }}
            >
              VIVA FITNESS
            </Text>
            <Text className="text-3xl font-poppins-bold text-[#1A1A1A] mb-1">
              Welcome!
            </Text>
            <Text className="text-[#4A4A4A] font-poppins mb-6">
              Let's get to know you before we begin.
            </Text>
            
            {/* Full Name */}
            <View className="mb-4">
              <Text className="text-[#1A1A1A] font-poppins-semibold text-[13px] mb-2">Full Name</Text>
              <View className="flex-row items-center border border-[#F0E6E6] rounded-2xl px-4 py-3.5 bg-[#FFF9F9]">
                <User color="#4A4A4A" size={20} />
                <TextInput
                  className="flex-1 ml-3 font-poppins text-base text-[#1A1A1A] pb-1"
                  placeholder="Enter your full name"
                  placeholderTextColor="#999999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View className="mb-4">
              <Text className="text-[#1A1A1A] font-poppins-semibold text-[13px] mb-2">Mobile Number</Text>
              <View className="flex-row">
                <View className="flex-row items-center justify-between border border-[#F0E6E6] rounded-2xl px-4 py-3.5 bg-[#FFF9F9] mr-3">
                  <Text className="font-poppins text-base mr-2 pb-1 text-[#1A1A1A]">+91</Text>
                  <ChevronDown color="#4A4A4A" size={16} />
                </View>
                <View className="flex-1 flex-row items-center border border-[#F0E6E6] rounded-2xl px-4 py-3.5 bg-[#FFF9F9]">
                  <Smartphone color="#4A4A4A" size={20} />
                  <TextInput
                    className="flex-1 ml-3 font-poppins text-base text-[#1A1A1A] pb-1"
                    placeholder="Enter your mobile number"
                    placeholderTextColor="#999999"
                    keyboardType="phone-pad"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                  />
                </View>
              </View>
            </View>

            {/* Referral / Dealer Code */}
            <View className="mb-6">
              <Text className="text-[#1A1A1A] font-poppins-semibold text-[13px] mb-2">Referral / Dealer Code</Text>
              <View className="flex-row items-center border border-[#F0E6E6] rounded-2xl px-4 py-3.5 bg-[#FFF9F9]">
                <Gift color="#4A4A4A" size={20} />
                <TextInput
                  className="flex-1 ml-3 font-poppins text-base text-[#1A1A1A] pb-1"
                  placeholder="Enter code"
                  placeholderTextColor="#999999"
                  value={referralCode}
                  onChangeText={setReferralCode}
                  autoCapitalize="characters"
                />
              </View>
              <Text className="text-[#666666] font-poppins text-[11px] mt-2 ml-1">
                Leave blank if you don't have one.
              </Text>
            </View>

            <TouchableOpacity 
              className="rounded-full py-4 flex-row justify-center items-center mb-6 shadow-sm"
              style={{ backgroundColor: COLORS.primary }}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text className="text-white font-poppins-semibold text-lg mr-2 pb-1">Continue</Text>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>

            <Text className="text-center font-poppins text-[11px] text-[#666666] leading-5 px-2">
              By continuing, you agree to our{" "}
              <Text style={{ color: COLORS.primary }} className="font-poppins-semibold">Terms & Conditions</Text> 
              {" "}and{" "}
              <Text style={{ color: COLORS.primary }} className="font-poppins-semibold">Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
