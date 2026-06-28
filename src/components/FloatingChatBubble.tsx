import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Linking,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { MessageCircle, X } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  FadeIn,
} from "react-native-reanimated";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=919141550000&text=I%27m+on+the+VIVA+Fitness+Website+and+have+some+questions+...&type=phone_number&app_absent=0";

// --- FAB sizing constants -----------------------------------------------
const BUBBLE_SIZE = 56;
const HALO_GAP = 3; // ring sits 2-3px outside the main button radius
const STROKE = 2; // 2px racing line
const RING_DIAMETER = BUBBLE_SIZE + HALO_GAP * 2 + STROKE * 2; // 66
const CONTAINER_SIZE = RING_DIAMETER; // outer anchor box

const RING_COLOR = "#b91c1c";

/**
 * Rotating Ring
 *
 * A continuous "racing line" (~90° arc) tracing the outer boundary of the FAB.
 *
 * Spec:
 *  - 2px stroke, ~quarter-circle segment, neon glow (blur ~4px)
 *  - constant 3s / 360° linear rotation (technical scanning feel)
 *  - subtle scale-up + fade-in on first appearance
 *  - sits centered ~3px outside the button radius (halo effect)
 *  - FAB icon + solid background remain completely static (separate layer)
 */
function RotatingRing() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Entrance: subtle scale-up + fade-in, independent of the continuous rotate
  const entering = () => {
    "worklet";
    return {
      initialValues: {
        opacity: 0,
        transform: [{ scale: 0.6 }],
      },
      animations: {
        opacity: withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
        transform: [
          { scale: withSpring(1, { damping: 14, stiffness: 120 }) },
        ],
      },
    };
  };

  return (
    // Wrapper handles entrance; inner View handles continuous rotation
    <Animated.View
      entering={entering}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Animated.View style={[StyleSheet.absoluteFill, rotatingStyle]}>
        <View
          style={[
            styles.ring,
            {
              width: RING_DIAMETER,
              height: RING_DIAMETER,
              borderRadius: RING_DIAMETER / 2,
              borderWidth: STROKE,
              borderTopColor: RING_COLOR,
              // Remaining sides left transparent so only the ~90° top arc renders
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
              // Neon glow
              shadowColor: RING_COLOR,
              shadowOpacity: 0.9,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 4,
              elevation: 4,
            },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
}

export default function FloatingChatBubble() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const scale = useSharedValue(1);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    setModalVisible(true);
  };

  const handleWhatsApp = () => {
    setModalVisible(false);
    Linking.openURL(WHATSAPP_URL).catch(() => {
      console.error("Failed to open WhatsApp");
    });
  };

  const handleEnquiry = () => {
    setModalVisible(false);
    router.push("/enquiry");
  };

  return (
    <>
      {/* Floating Bubble + Rotating Ring */}
      <View style={styles.outerContainer}>
        {/* Rotating ring — BEHIND the static FAB, centered, overflows as halo */}
        <RotatingRing />

        {/* Static FAB (icon + solid bg) — unaffected by the ring rotation */}
        <Animated.View style={[styles.bubbleWrapper, animatedBubbleStyle]}>
          <Pressable
            onPress={handlePress}
            style={[
              styles.bubble,
              {
                backgroundColor: isDark ? "#222" : "#fff",
                shadowColor: isDark ? "#B91C1C" : "#000",
              },
            ]}
          >
            {/* Speech bubble with two dots */}
            <View style={styles.bubbleInner}>
              <View
                style={[
                  styles.speechBubble,
                  { backgroundColor: isDark ? "#444" : "#d1d5db" },
                ]}
              >
                <View style={styles.dotsRow}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isDark ? "#111" : "#374151" },
                    ]}
                  />
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isDark ? "#111" : "#374151" },
                    ]}
                  />
                </View>
              </View>
              {/* Speech bubble tail */}
              <View
                style={[
                  styles.speechTail,
                  { borderTopColor: isDark ? "#444" : "#d1d5db" },
                ]}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>

      {/* Contact Options Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(0,0,0,0.85)"
                : "rgba(0,0,0,0.6)",
            },
          ]}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
          >
            {/* Close Button */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={[
                styles.closeButton,
                { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" },
              ]}
            >
              <X size={22} color={isDark ? "#fff" : "#333"} strokeWidth={2.5} />
            </Pressable>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* WhatsApp Option */}
              <Pressable
                onPress={handleWhatsApp}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(30,30,30,0.95)"
                      : "rgba(255,255,255,0.95)",
                    borderColor: isDark ? "#333" : "#e5e7eb",
                  },
                ]}
              >
                <View style={[styles.optionIcon, { backgroundColor: "#25D366" }]}>
                  {/* WhatsApp "W" logo */}
                  <Text style={styles.whatsappText}>W</Text>
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: isDark ? "#fff" : "#111827" },
                  ]}
                >
                  WhatsApp
                </Text>
                <Text
                  style={[
                    styles.optionSub,
                    { color: isDark ? "#9ca3af" : "#6b7280" },
                  ]}
                >
                  Chat with us instantly
                </Text>
              </Pressable>

              {/* Enquiry Form Option */}
              <Pressable
                onPress={handleEnquiry}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: isDark
                      ? "rgba(30,30,30,0.95)"
                      : "rgba(255,255,255,0.95)",
                    borderColor: isDark ? "#333" : "#e5e7eb",
                  },
                ]}
              >
                <View style={[styles.optionIcon, { backgroundColor: "#B91C1C" }]}>
                  <MessageCircle size={24} color="#fff" strokeWidth={2} />
                </View>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: isDark ? "#fff" : "#111827" },
                  ]}
                >
                  Enquiry Form
                </Text>
                <Text
                  style={[
                    styles.optionSub,
                    { color: isDark ? "#9ca3af" : "#6b7280" },
                  ]}
                >
                  Send us your requirements
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    // Centered on the original FAB anchor so the bubble stays in place:
    // original center was right:48 / bottom:56 -> box of 66 -> right:15 / bottom:23
    bottom: 23,
    right: 15,
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  bubbleWrapper: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  ring: {
    position: "absolute",
    alignSelf: "center",
  },
  bubbleInner: {
    alignItems: "center",
  },
  speechBubble: {
    width: 32,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  speechTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
    marginLeft: -12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    gap: 16,
    width: "80%",
    maxWidth: 300,
  },
  optionCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  whatsappText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    fontFamily: "Poppins_700Bold",
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },
  optionSub: {
    fontSize: 13,
    fontFamily: "Poppins_400Regular",
  },
});
