import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
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
    x: width - 80,
    y: height - 150 - insets.bottom,
  });

  const translateX = useSharedValue(initialPosition.x);
  const translateY = useSharedValue(initialPosition.y);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = event.translationX + initialPosition.x;
      const newY = event.translationY + initialPosition.y;

      // Boundary constraints
      translateX.value = Math.max(10, Math.min(newX, width - 70));
      translateY.value = Math.max(10, Math.min(newY, height - 120 - insets.bottom));
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

  // Lighter color for the button (increase brightness)
  const lighterPrimaryColor = theme.primaryLight || "#a8a5db";

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.fab, animatedStyle]}>
        <Animated.View
          style={[
            styles.fabContainer,
            {
              backgroundColor: lighterPrimaryColor,
              borderColor: theme.primary,
            },
          ]}
        >
          <Feather name="plus" size={28} color="#ffffff" />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
  },
  fabContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
