import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Send } from "lucide-react-native";
import { Image } from "expo-image";
import { COLORS } from "@/constants/theme";
import { getLocalProductById } from "@/constants/products";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringButton({ onPress, children, className, style, disabled }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => (scale.value = withSpring(0.95, { damping: 12, stiffness: 400 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 12, stiffness: 400 }))}
      className={className}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function EnquiryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const params = useLocalSearchParams<{
    productName?: string;
    productType?: string;
    productId?: string;
  }>();

  // If we have a productId, look up the product for its image
  const product = params.productId
    ? getLocalProductById(params.productId)
    : null;
  const productImage = product?.images?.[0] ?? null;
  const productName = params.productName ?? null;
  const productType = params.productType ?? null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState(
    productName
      ? `I'm interested in the ${productName}. Please share pricing and availability details.`
      : ""
  );
  const [iAmNotAMachine, setIAmNotAMachine] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const shakeValue = useSharedValue(0);
  const multiFocused = useSharedValue(0);

  const multiAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      multiFocused.value,
      [0, 1],
      [isDark ? "#1e3a5f" : "#e5e7eb", COLORS.primary]
    );
    return { borderColor };
  });

  const isValid =
    fullName.trim() && contactNumber.trim() && city.trim() && iAmNotAMachine;

  const handleSubmit = () => {
    if (!isValid) {
      shakeValue.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      Alert.alert(
        "Incomplete",
        "Please fill in all required fields and confirm you are not a machine."
      );
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1000);
    }, 1500);
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
  }));

  // ── Color palette ──
  const bg = isDark ? "#0a1628" : "#fef2f2";
  const cardBg = isDark ? "#0f1f3a" : "#fff0f0";
  const inputBg = isDark ? "#0a1628" : "#fff";
  const inputBorder = isDark ? "#1e3a5f" : "#e5e7eb";
  const labelColor = isDark ? "#94a3b8" : "#6b7280";
  const textColor = isDark ? "#f1f5f9" : "#111827";
  const placeholderColor = isDark ? "#475569" : "#9ca3af";
  const sectionDivColor = isDark ? "#1e3a5f" : "#e5e7eb";
  const accentColor = isDark ? "#f87171" : COLORS.primary;

  const imageSource =
    productImage && typeof productImage === "string"
      ? { uri: productImage }
      : productImage;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowLeft
              size={22}
              color={isDark ? "#fff" : "#111"}
              strokeWidth={2}
            />
          </Pressable>

          {productName && (
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Poppins_700Bold",
                color: COLORS.primary,
                letterSpacing: 0.5,
              }}
            >
              VIVA FITNESS
            </Text>
          )}

          <Pressable
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Search
              size={20}
              color={isDark ? "#94a3b8" : "#6b7280"}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Product Card (when opened from a product) ── */}
          {productName && (
            <View
              style={{
                backgroundColor: cardBg,
                marginHorizontal: 20,
                borderRadius: 16,
                padding: 16,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              {productImage && (
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: isDark ? "#1a2744" : "#fff",
                    marginRight: 14,
                  }}
                >
                  <Image
                    source={imageSource}
                    contentFit="contain"
                    style={{ width: 72, height: 72 }}
                    transition={200}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins_600SemiBold",
                    color: textColor,
                  }}
                  numberOfLines={2}
                >
                  {productName}
                </Text>
                {productType && (
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Poppins_600SemiBold",
                      color: labelColor,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {productType}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* ── Title ── */}
          <View style={{ paddingHorizontal: 20, marginBottom: 6 }}>
            <Text
              style={{
                fontSize: 26,
                fontFamily: "Poppins_700Bold",
                color: textColor,
                lineHeight: 34,
              }}
            >
              Enter Product Query
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Poppins_400Regular",
                color: labelColor,
                lineHeight: 20,
                marginTop: 6,
                marginBottom: 24,
              }}
            >
              Our performance consultants will tailor a solution for your
              facility.
            </Text>
          </View>

          {/* ── CONTACT INFORMATION ── */}
          <View style={{ paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: sectionDivColor,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_600SemiBold",
                  color: accentColor,
                  letterSpacing: 1.5,
                  marginHorizontal: 12,
                }}
              >
                CONTACT INFORMATION
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: sectionDivColor,
                }}
              />
            </View>

            {/* Full Name */}
            <InputField
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              isDark={isDark}
              inputBg={inputBg}
              inputBorder={inputBorder}
              labelColor={labelColor}
              textColor={textColor}
              placeholderColor={placeholderColor}
            />

            {/* Email */}
            <InputField
              label="Email Address"
              placeholder="john@athlete.com"
              value={email}
              onChangeText={setEmail}
              isDark={isDark}
              inputBg={inputBg}
              inputBorder={inputBorder}
              labelColor={labelColor}
              textColor={textColor}
              placeholderColor={placeholderColor}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Contact Number */}
            <InputField
              label="Contact Number"
              placeholder="+1  (555) 000-0000"
              value={contactNumber}
              onChangeText={setContactNumber}
              isDark={isDark}
              inputBg={inputBg}
              inputBorder={inputBorder}
              labelColor={labelColor}
              textColor={textColor}
              placeholderColor={placeholderColor}
              keyboardType="phone-pad"
            />

            {/* City / State */}
            <InputField
              label="City / State"
              placeholder="New York, NY"
              value={city}
              onChangeText={setCity}
              isDark={isDark}
              inputBg={inputBg}
              inputBorder={inputBorder}
              labelColor={labelColor}
              textColor={textColor}
              placeholderColor={placeholderColor}
            />
          </View>

          {/* ── INQUIRY DETAILS ── */}
          <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: sectionDivColor,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontFamily: "Poppins_600SemiBold",
                  color: accentColor,
                  letterSpacing: 1.5,
                  marginHorizontal: 12,
                }}
              >
                INQUIRY DETAILS
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: sectionDivColor,
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins_500Medium",
                color: labelColor,
                marginBottom: 6,
              }}
            >
              How can we assist you?
            </Text>
            <AnimatedTextInput
              value={message}
              onChangeText={setMessage}
              placeholder={
                productName
                  ? `Describe your facility requirements or specific questions about the ${productName}...`
                  : "Describe your facility requirements or specific equipment needs..."
              }
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              onFocus={() => (multiFocused.value = withTiming(1, { duration: 200 }))}
              onBlur={() => (multiFocused.value = withTiming(0, { duration: 200 }))}
              style={[
                {
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: textColor,
                  backgroundColor: inputBg,
                  minHeight: 130,
                },
                multiAnimatedStyle
              ]}
            />
          </View>

          {/* ── Captcha / Not a machine ── */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginTop: 28,
              marginBottom: 28,
            }}
          >
            <Pressable
              onPress={() => setIAmNotAMachine(!iAmNotAMachine)}
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderWidth: 2,
                  borderColor: iAmNotAMachine ? COLORS.primary : inputBorder,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: iAmNotAMachine
                    ? COLORS.primary
                    : "transparent",
                }}
              >
                {iAmNotAMachine && (
                  <Text
                    style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
                )}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_400Regular",
                  color: textColor,
                }}
              >
                I am not a{"\n"}machine
              </Text>
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins_500Medium",
                  color: labelColor,
                }}
              >
                ◉ SECURE
              </Text>
            </View>
          </View>

          {/* ── Submit Button ── */}
          <Animated.View style={[{ paddingHorizontal: 20, marginBottom: 20 }, shakeStyle]}>
            <SpringButton
              onPress={handleSubmit}
              disabled={submitting || success}
              style={{
                backgroundColor: success ? "#16a34a" : submitting ? "#991B1B" : COLORS.primary,
                borderRadius: 16,
                paddingVertical: 18,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontFamily: "Poppins_700Bold",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {success ? "Success!" : submitting ? "Submitting..." : "Submit Query"}
              </Text>
              {!submitting && !success && (
                <Send
                  size={16}
                  color="#fff"
                  strokeWidth={2.5}
                  style={{ marginLeft: 10 }}
                />
              )}
            </SpringButton>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ── Reusable Input Field ── */
function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  isDark,
  inputBg,
  inputBorder,
  labelColor,
  textColor,
  placeholderColor,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  isDark: boolean;
  inputBg: string;
  inputBorder: string;
  labelColor: string;
  textColor: string;
  placeholderColor: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences";
}) {
  const focused = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focused.value,
      [0, 1],
      [inputBorder, COLORS.primary]
    );
    return {
      borderColor,
    };
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 12,
          fontFamily: "Poppins_500Medium",
          color: labelColor,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <AnimatedTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => (focused.value = withTiming(1, { duration: 200 }))}
        onBlur={() => (focused.value = withTiming(0, { duration: 200 }))}
        style={[
          {
            borderWidth: 1,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 15,
            fontFamily: "Poppins_400Regular",
            color: textColor,
            backgroundColor: inputBg,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
