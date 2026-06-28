import React, { useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  // ── Slide-in from left ──
  const logoTranslateX = useSharedValue(-SCREEN_WIDTH);
  const logoOpacity = useSharedValue(0);

  const taglineTranslateX = useSharedValue(-SCREEN_WIDTH);
  const taglineOpacity = useSharedValue(0);

  // ── Exit ──
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Logo slides in from left
    logoTranslateX.value = withTiming(0, {
      duration: 1000,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    });
    logoOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.23, 1, 0.32, 1),
    });

    // 2. Tagline slides in from left (slight delay)
    taglineTranslateX.value = withDelay(
      200,
      withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      })
    );
    taglineOpacity.value = withDelay(
      200,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      })
    );

    // 3. Exit after 3.5s
    const timer = setTimeout(() => {
      exitOpacity.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      });
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // ── Animated styles ──

  const containerStyle = useAnimatedStyle(() => ({
    opacity: exitOpacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateX: logoTranslateX.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateX: taglineTranslateX.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* ── Red gradient background ── */}
      <LinearGradient
        colors={['#8B0000', '#7A1010', '#6B0F0F', '#7A1010']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Center content ── */}
      <View style={styles.content}>
        {/* Logo text block — slides in from left */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoBlock}>
            {/* "VIVA" */}
            <Text style={styles.vivaText}>VIVA</Text>
            {/* "FITNESS" */}
            <Text style={styles.fitnessText}>FITNESS</Text>
          </View>
        </Animated.View>

        {/* Tagline — slides in from left with slight delay */}
        <Animated.View style={[styles.taglineContainer, taglineStyle]}>
          <Text style={styles.tagline}>P U S H   Y O U R S E L F</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 999,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  logoBlock: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  vivaText: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 3,
    lineHeight: 56,
  },
  fitnessText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 10,
    lineHeight: 28,
    marginTop: -2,
  },
  taglineContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
