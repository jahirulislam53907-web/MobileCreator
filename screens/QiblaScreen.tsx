import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Card } from '@/components/Card';
import { TopNavigationBar } from '@/components/TopNavigationBar';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import {
  calculateQiblaBearing,
  calculateDistance,
  getBearingDirection,
  type Location as LocationType,
} from '@/utils/qiblaCalculator';

// Dhaka coordinates (default location)
const DHAKA_LOCATION: LocationType = {
  latitude: 23.8103,
  longitude: 90.4125,
};

export default function QiblaScreen() {
  const { theme } = useAppTheme();
  const [userLocation, setUserLocation] = useState<LocationType | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  const arrowRotation = useSharedValue(0);

  const animatedArrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${arrowRotation.value}deg` }],
  }));

  // Watch device heading (compass)
  useEffect(() => {
    const watchHeading = async () => {
      try {
        subscriptionRef.current = await Location.watchHeadingAsync((heading) => {
          setDeviceHeading(heading.trueHeading);
          // Update arrow rotation based on device heading
          const arrowAngle = qiblaBearing - heading.trueHeading;
          const normalizedAngle = ((arrowAngle + 360) % 360);
          arrowRotation.value = withSpring(normalizedAngle > 180 ? normalizedAngle - 360 : normalizedAngle, {
            damping: 15,
            mass: 1,
            stiffness: 120,
          });
        });
      } catch (error) {
        console.warn('কম্পাস উপলব্ধ নয়:', error);
      }
    };

    watchHeading();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [qiblaBearing]);

  // Get location and calculate Qibla bearing
  useEffect(() => {
    const getLocation = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        let userLoc: LocationType = DHAKA_LOCATION; // Default to Dhaka

        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            // Try to get current location
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            userLoc = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
          } catch (locError) {
            console.warn('অবস্থান পেতে সমস্যা, ঢাকা ব্যবহার করছি:', locError);
            setErrorMsg('অবস্থান পাওয়া যায়নি, ঢাকা ব্যবহার করছি');
          }
        } else {
          console.warn('অবস্থান অনুমতি দেওয়া হয়নি, ঢাকা ব্যবহার করছি');
          setErrorMsg('অবস্থান অনুমতি নেই, ঢাকা ব্যবহার করছি');
        }

        setUserLocation(userLoc);

        // Calculate Qibla bearing
        const bearing = calculateQiblaBearing(userLoc);
        setQiblaBearing(bearing);

        // Calculate distance to Kaaba
        const dist = calculateDistance(userLoc, {
          latitude: 21.4225,
          longitude: 39.8262,
        });
        setDistance(dist);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('কাবা দিক নির্ণয়ে ত্রুটি:', error);
        // Still use Dhaka as fallback
        setUserLocation(DHAKA_LOCATION);
        const bearing = calculateQiblaBearing(DHAKA_LOCATION);
        setQiblaBearing(bearing);
        const dist = calculateDistance(DHAKA_LOCATION, {
          latitude: 21.4225,
          longitude: 39.8262,
        });
        setDistance(dist);
        setErrorMsg('ঢাকা থেকে কাবার দিক দেখাচ্ছি');
      } finally {
        setLoading(false);
      }
    };

    getLocation();

    // Update location every 15 seconds
    const interval = setInterval(getLocation, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      let userLoc: LocationType = DHAKA_LOCATION; // Default to Dhaka

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } catch (locError) {
        console.warn('অবস্থান আপডেট ব্যর্থ, ঢাকা ব্যবহার করছি:', locError);
        setErrorMsg('অবস্থান পাওয়া যায়নি, ঢাকা ব্যবহার করছি');
      }

      setUserLocation(userLoc);
      const bearing = calculateQiblaBearing(userLoc);
      setQiblaBearing(bearing);

      const dist = calculateDistance(userLoc, {
        latitude: 21.4225,
        longitude: 39.8262,
      });
      setDistance(dist);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      arrowRotation.value = withSpring(bearing, {
        damping: 15,
        mass: 1,
        stiffness: 120,
      });
    } catch (error) {
      Alert.alert('ত্রুটি', 'আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigationBar activeTab="Qibla" />
      <ScreenScrollView>
        <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}>
          <ThemedText style={[styles.title, { color: theme.text }]}>
            কাবা কম্পাস
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            নামাজের জন্য সঠিক দিক খুঁজুন
          </ThemedText>

          {/* Main Compass Circle */}
          <Card style={[styles.compassCard, { backgroundColor: theme.backgroundDefault }]}>
            <View
              style={[
                styles.compassCircle,
                { borderColor: theme.primary, backgroundColor: theme.backgroundSecondary },
              ]}
            >
              {/* Cardinal Directions */}
              <View style={styles.directionLabel} pointerEvents="none">
                <ThemedText style={[styles.directionText, { color: theme.primary }]}>
                  N
                </ThemedText>
              </View>
              <View style={[styles.directionLabel, { left: 'auto', right: Spacing.md }]} pointerEvents="none">
                <ThemedText style={[styles.directionText, { color: theme.primary }]}>
                  E
                </ThemedText>
              </View>
              <View
                style={[
                  styles.directionLabel,
                  { top: 'auto', bottom: Spacing.md, left: Spacing.md },
                ]}
                pointerEvents="none"
              >
                <ThemedText style={[styles.directionText, { color: theme.primary }]}>
                  W
                </ThemedText>
              </View>
              <View
                style={[
                  styles.directionLabel,
                  { top: 'auto', bottom: Spacing.md, left: 'auto', right: Spacing.md },
                ]}
                pointerEvents="none"
              >
                <ThemedText style={[styles.directionText, { color: theme.primary }]}>
                  S
                </ThemedText>
              </View>

              {/* Qibla Arrow - Large and Prominent */}
              <Animated.View
                style={[
                  styles.arrowContainer,
                  animatedArrowStyle,
                ]}
              >
                <View style={[styles.arrow, { backgroundColor: theme.primary }]}>
                  <MaterialIcons name="arrow-upward" size={56} color="#fff" />
                </View>
                {/* Arrow label */}
                <ThemedText style={[styles.arrowLabel, { color: theme.primary }]}>
                  কাবা
                </ThemedText>
              </Animated.View>

              {/* Center Circle */}
              <View style={[styles.centerDot, { backgroundColor: theme.primary }]} />
            </View>
          </Card>

          {/* Info Cards */}
          <Card style={styles.infoCard}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
              কাবার দিক
            </ThemedText>
            <ThemedText style={[styles.infoValue, { color: theme.primary }]}>
              {qiblaBearing.toFixed(1)}° ({getBearingDirection(qiblaBearing)})
            </ThemedText>
          </Card>

          <Card style={styles.infoCard}>
            <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
              কাবা থেকে দূরত্ব
            </ThemedText>
            <ThemedText style={[styles.infoValue, { color: theme.secondary }]}>
              {distance.toFixed(0)} km
            </ThemedText>
          </Card>

          {userLocation && (
            <Card style={styles.infoCard}>
              <ThemedText style={[styles.infoLabel, { color: theme.textSecondary }]}>
                আপনার অবস্থান
              </ThemedText>
              <ThemedText style={[styles.infoValue, { color: theme.text, fontSize: 12 }]}>
                {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
              </ThemedText>
            </Card>
          )}

          {errorMsg && (
            <Card style={[styles.errorCard, { backgroundColor: theme.error + '15' }]}>
              <ThemedText style={[styles.errorText, { color: theme.error }]}>
                ⚠️ {errorMsg}
              </ThemedText>
            </Card>
          )}

          {/* Refresh Button */}
          <Pressable
            style={[styles.refreshButton, { backgroundColor: theme.primary }]}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={20} color="#fff" />
            <ThemedText style={styles.refreshButtonText}>
              {loading ? 'লোড হচ্ছে...' : 'আবার খুঁজুন'}
            </ThemedText>
          </Pressable>

          {/* Instructions */}
          <Card style={styles.instructionsCard}>
            <ThemedText style={[styles.instructionsTitle, { color: theme.text }]}>
              নির্দেশাবলী
            </ThemedText>
            <ThemedText style={[styles.instructionText, { color: theme.textSecondary }]}>
              • উপরের তীর কাবার দিক নির্দেশ করে{'\n'}
              • আপনার ফোন উত্তরের দিকে রাখুন{'\n'}
              • তীর ঘোরে এবং কাবার দিক দেখায়
            </ThemedText>
          </Card>
        </View>
      </ScreenScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  compassCard: {
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassCircle: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  directionLabel: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionText: {
    fontSize: 16,
    fontWeight: '700',
  },
  arrowContainer: {
    position: 'absolute',
  },
  arrow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  arrowLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 10,
  },
  infoCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  errorCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  instructionsCard: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
