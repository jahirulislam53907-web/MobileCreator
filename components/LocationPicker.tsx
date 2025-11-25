import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, BorderRadius } from '@/constants/theme';
import { useLocation } from '@/src/hooks/useLocation';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { name: 'ঢাকা', country: 'বাংলাদেশ', latitude: 23.8103, longitude: 90.4125 },
  { name: 'চট্টগ্রাম', country: 'বাংলাদেশ', latitude: 22.3569, longitude: 91.7832 },
  { name: 'সিলেট', country: 'বাংলাদেশ', latitude: 24.8152, longitude: 91.2736 },
  { name: 'খুলনা', country: 'বাংলাদেশ', latitude: 22.8456, longitude: 89.5664 },
  { name: 'রাজশাহী', country: 'বাংলাদেশ', latitude: 24.3745, longitude: 88.6042 },
  { name: 'করাচি', country: 'পাকিস্তান', latitude: 24.8607, longitude: 67.0011 },
  { name: 'ঢাকা', country: 'পাকিস্তান', latitude: 24.8607, longitude: 67.0011 },
  { name: 'লাহোর', country: 'পাকিস্তান', latitude: 31.5204, longitude: 74.3587 },
];

export function LocationPicker({ visible, onClose }: LocationPickerProps) {
  const { theme } = useAppTheme();
  const { setLocation, getCurrentLocation, loading } = useLocation();
  const [search, setSearch] = useState('');

  const filteredCities = POPULAR_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectCity = async (city: typeof POPULAR_CITIES[0]) => {
    await setLocation({
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <Pressable onPress={onClose}>
            <Feather name="x" size={24} color={theme.buttonText} />
          </Pressable>
          <ThemedText style={[styles.headerTitle, { color: theme.buttonText }]}>
            লোকেশন নির্বাচন করুন
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="search" size={18} color={theme.textSecondary} />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme.text, borderColor: theme.border },
            ]}
            placeholder="শহর খুঁজুন..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search && (
            <Pressable onPress={() => setSearch('')}>
              <Feather name="x" size={18} color={theme.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Current Location Button */}
        <Pressable
          onPress={getCurrentLocation}
          style={[styles.currentLocBtn, { backgroundColor: theme.secondary + '15', borderColor: theme.secondary }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.secondary} size="small" />
          ) : (
            <>
              <Feather name="map-pin" size={18} color={theme.secondary} />
              <ThemedText style={{ color: theme.secondary, fontWeight: '600', marginLeft: Spacing.md }}>
                বর্তমান লোকেশন ব্যবহার করুন
              </ThemedText>
            </>
          )}
        </Pressable>

        {/* Cities List */}
        <ScrollView style={styles.citiesList} showsVerticalScrollIndicator={false}>
          {filteredCities.map((city, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSelectCity(city)}
              style={[styles.cityItem, { backgroundColor: theme.backgroundDefault }]}
            >
              <View style={[styles.cityIcon, { backgroundColor: theme.primary + '15' }]}>
                <Feather name="map-pin" size={16} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>
                  {city.name}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>
                  {city.country}
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={16} color={theme.textSecondary} />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    fontSize: 14,
  },
  currentLocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  citiesList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  cityIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
