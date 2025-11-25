import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/useAppTheme";

const { width, height } = Dimensions.get("window");

export function DraggableFAB() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [initialPosition] = useState({
    x: width - 70,
    y: height - 140 - insets.bottom,
  });

  const translateX = useSharedValue(initialPosition.x);
  const translateY = useSharedValue(initialPosition.y);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = event.translationX + initialPosition.x;
      const newY = event.translationY + initialPosition.y;

      // Boundary constraints
      translateX.value = Math.max(10, Math.min(newX, width - 60));
      translateY.value = Math.max(10, Math.min(newY, height - 110 - insets.bottom));
    })
    .onEnd(() => {
      // Optional: Snap to edges or finalize position
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const rotatingBorderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const lighterPrimaryColor = theme.primaryLight || "#a8a5db";
  const primaryColor = theme.primary;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        {/* Rotating Loading Border */}
        <Animated.View
          style={[
            styles.spinningBorder,
            rotatingBorderStyle,
          ]}
        >
          <View
            style={[
              styles.spinnerRing,
              {
                borderTopColor: primaryColor,
                borderRightColor: lighterPrimaryColor,
                borderBottomColor: primaryColor,
                borderLeftColor: lighterPrimaryColor,
              },
            ]}
          />
        </Animated.View>

        {/* Center Button */}
        <View style={[styles.centerButton, { backgroundColor: lighterPrimaryColor }]}>
          <Feather name="plus" size={20} color="#ffffff" />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  spinningBorder: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
  },
  centerButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
