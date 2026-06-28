import React, { useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { MessageCircle, X } from "lucide-react-native";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const MIN_SCALE = 1;
const MAX_SCALE = 5;

interface FullScreenImageViewerProps {
  visible: boolean;
  source: any; // string uri or require() number
  onClose: () => void;
  onEnquire?: () => void;
}

export default function FullScreenImageViewer({
  visible,
  source,
  onClose,
  onEnquire,
}: FullScreenImageViewerProps) {
  /* ── shared values ───────────────────────────────── */
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetTransforms = useCallback(() => {
    "worklet";
    scale.value = withTiming(1, { duration: 250 });
    savedScale.value = 1;
    translateX.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(0, { duration: 250 });
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, []);

  /* ── gestures ────────────────────────────────────── */

  // Pinch to zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(newScale, 0.5), MAX_SCALE);
    })
    .onEnd(() => {
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);
        savedScale.value = MIN_SCALE;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else if (scale.value > MAX_SCALE) {
        scale.value = withSpring(MAX_SCALE);
        savedScale.value = MAX_SCALE;
      } else {
        savedScale.value = scale.value;
      }
    });

  // Pan to move when zoomed
  const panGesture = Gesture.Pan()
    .minPointers(1)
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;

      // If we're back to scale 1, snap translations back to 0
      if (savedScale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  // Double tap to toggle zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (savedScale.value > 1.5) {
        // Zoom out
        resetTransforms();
      } else {
        // Zoom in to 3× centered on tap point
        const targetScale = 3;
        const focusX = e.x - SCREEN_W / 2;
        const focusY = e.y - SCREEN_H / 2;

        scale.value = withSpring(targetScale);
        savedScale.value = targetScale;
        translateX.value = withSpring(-focusX * (targetScale - 1));
        translateY.value = withSpring(-focusY * (targetScale - 1));
        savedTranslateX.value = -focusX * (targetScale - 1);
        savedTranslateY.value = -focusY * (targetScale - 1);
      }
    });

  const composed = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  /* ── animated style ──────────────────────────────── */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  /* ── resolve image source ────────────────────────── */
  const imageSource = typeof source === "string" ? { uri: source } : source;

  const handleClose = () => {
    resetTransforms();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <GestureHandlerRootView style={styles.container}>
        {/* Close button */}
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={16}
        >
          <View style={styles.closeCircle}>
            <X size={22} color="#fff" strokeWidth={2.5} />
          </View>
        </Pressable>

        {/* Action button at bottom */}
        {onEnquire && (
          <View style={styles.actionContainer}>
            <Pressable
              onPress={() => {
                onClose();
                onEnquire();
              }}
              style={styles.enquireButton}
            >
              <MessageCircle size={18} color="#fff" strokeWidth={2.5} />
              <Text style={styles.enquireButtonText}>Enquire Now</Text>
            </Pressable>
            <Text style={styles.hintText}>Pinch or double-tap to zoom</Text>
          </View>
        )}
        {!onEnquire && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Pinch or double-tap to zoom</Text>
          </View>
        )}

        {/* Image with gestures */}
        <GestureDetector gesture={composed}>
          <Animated.View style={[styles.imageWrapper, animatedStyle]}>
            {source ? (
              <Image
                source={imageSource}
                contentFit="contain"
                style={styles.image}
                transition={200}
              />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image</Text>
              </View>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 56,
    right: 20,
    zIndex: 10,
  },
  closeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  hintContainer: {
    position: "absolute",
    bottom: 48,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionContainer: {
    position: "absolute",
    bottom: 40,
    zIndex: 10,
    alignItems: "center",
    gap: 12,
  },
  enquireButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B91C1C", // COLORS.primary
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enquireButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Poppins_700Bold",
    letterSpacing: 0.5,
  },
  hintText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  imageWrapper: {
    width: SCREEN_W,
    height: SCREEN_H,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.7,
  },
  noImage: {
    width: SCREEN_W,
    height: SCREEN_H * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
});
