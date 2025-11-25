import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

interface LocationContextType {
  location: UserLocation | null;
  loading: boolean;
  error: string | null;
  setLocation: (location: UserLocation) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 23.8103,
  longitude: 90.4125,
  name: 'ঢাকা',
  country: 'বাংলাদেশ',
};

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load saved location on mount
  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      const saved = await AsyncStorage.getItem('userLocation');
      if (saved) {
        setLocationState(JSON.parse(saved));
      } else {
        setLocationState(DEFAULT_LOCATION);
      }
    } catch (err) {
      setLocationState(DEFAULT_LOCATION);
    } finally {
      setLoading(false);
    }
  };

  const setLocation = useCallback(async (newLocation: UserLocation) => {
    try {
      setLocationState(newLocation);
      await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
    } catch (err) {
      setError('লোকেশন সংরক্ষণ করতে ব্যর্থ');
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (err) {
      setError('লোকেশন অনুমতি পেতে ব্যর্থ');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('লোকেশন অনুমতি প্রয়োজন');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Reverse geocoding to get city name
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const newLocation: UserLocation = {
        latitude,
        longitude,
        name: address[0]?.city || 'অজানা শহর',
        country: address[0]?.country || 'অজানা দেশ',
      };

      await setLocation(newLocation);
      setError(null);
    } catch (err) {
      setError('বর্তমান লোকেশন পেতে ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location: location || DEFAULT_LOCATION,
        loading,
        error,
        setLocation,
        requestPermission,
        getCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
