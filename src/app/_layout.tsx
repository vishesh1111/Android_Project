import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import AnimatedSplash from "@/components/AnimatedSplash";
import FloatingChatBubble from "@/components/FloatingChatBubble";
import { CartProvider } from "@/lib/CartContext";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();

  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the native splash screen immediately — our custom animated one takes over
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <CartProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style={showSplash ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="selection" />
          <Stack.Screen name="about" />
          <Stack.Screen name="connect" />
          <Stack.Screen name="contact" />
          <Stack.Screen 
            name="cart" 
            options={{ 
              presentation: "modal", 
              animation: "slide_from_bottom" 
            }} 
          />
          <Stack.Screen 
            name="enquiry" 
            options={{ 
              presentation: "modal", 
              animation: "slide_from_bottom" 
            }} 
          />
        </Stack>
        {!showSplash && pathname === "/selection" && <FloatingChatBubble />}
        {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
      </View>
    </CartProvider>
  );
}

