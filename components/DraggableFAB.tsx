import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
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
        duration: 4000,
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

  // Lighter color for the button (increase brightness)
  const lighterPrimaryColor = theme.primaryLight || "#a8a5db";

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        <Animated.View
          style={[
            styles.rotatingBorder,
            {
              borderColor: theme.primary,
            },
            rotatingBorderStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.fabContainer,
              {
                backgroundColor: lighterPrimaryColor,
              },
            ]}
          >
            <Feather name="plus" size={20} color="#ffffff" />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  rotatingBorder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  fabContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
