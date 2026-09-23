import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';

interface PreloaderProps {
  onFinish?: () => void;
  isReady: boolean;
}

export function Preloader({ onFinish, isReady }: PreloaderProps) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.4)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation: Logo scale & fade in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous ambient pulse for logo glow
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.9,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 3. Shimmer loading animation
    const dotsLoop = Animated.loop(
      Animated.timing(dotsAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseLoop.start();
    dotsLoop.start();

    return () => {
      pulseLoop.stop();
      dotsLoop.stop();
    };
  }, []);

  // Exit animation when app resources are ready
  useEffect(() => {
    if (isReady) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }
  }, [isReady]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
        },
      ]}
      pointerEvents={isReady ? 'none' : 'auto'}
    >
      <StatusBar style="light" />

      {/* Ambient background glow */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowPulse,
            transform: [
              {
                scale: glowPulse.interpolate({
                  inputRange: [0.4, 0.9],
                  outputRange: [0.95, 1.15],
                }),
              },
            ],
          },
        ]}
      />

      {/* Center Logo with scaling */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../assets/images/elive.webp')}
          style={styles.logo}
          contentFit="contain"
          transition={200}
        />
      </Animated.View>

      {/* Modern loading indicator bar */}
      <View style={styles.loadingTrack}>
        <Animated.View
          style={[
            styles.loadingBar,
            {
              transform: [
                {
                  translateX: dotsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-120, 120],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#002249',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  glowCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loadingTrack: {
    width: 140,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 90,
  },
  loadingBar: {
    width: 70,
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 2,
  },
});
