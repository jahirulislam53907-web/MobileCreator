import React from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { useAppTheme } from "@/hooks/useAppTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CardProps {
  elevation?: number;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const getBackgroundColorForElevation = (
  elevation: number,
  theme: any,
): string => {
  if (!theme) return "#ffffff";

  switch (elevation) {
    case 1:
      return theme.backgroundDefault || "#ffffff";
    case 2:
      return theme.backgroundSecondary || "#f9f9f9";
    case 3:
      return theme.backgroundTertiary || "#eeeeee";
    default:
      return theme.backgroundRoot || "#f5f5f5";
  }
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export function Card({ elevation = 1, onPress, children, style }: CardProps) {
  const { theme } = useAppTheme();
  const scale = useSharedValue(1);

  const cardBackgroundColor = getBackgroundColorForElevation(elevation, theme);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const Component = onPress ? AnimatedPressable : AnimatedView;

  return (
    <Component
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
        },
        onPress ? animatedStyle : undefined,
        style,
      ]}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
  },
  cardTitle: {
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    opacity: 0.7,
  },
});
