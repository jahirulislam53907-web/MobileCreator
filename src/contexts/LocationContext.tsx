import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 23.8103,
  longitude: 90.4125,
  name: 'ঢাকা',
  country: 'বাংলাদেশ',
};

// City location mapping for reverse geocoding fallback
const CITY_COORDINATES = [
  { name: 'ঢাকা', country: 'বাংলাদেশ', lat: 23.8103, lng: 90.4125 },
  { name: 'চট্টগ্রাম', country: 'বাংলাদেশ', lat: 22.3569, lng: 91.7832 },
  { name: 'সিলেট', country: 'বাংলাদেশ', lat: 24.8152, lng: 91.2736 },
  { name: 'খুলনা', country: 'বাংলাদেশ', lat: 22.8456, lng: 89.5664 },
  { name: 'রাজশাহী', country: 'বাংলাদেশ', lat: 24.3745, lng: 88.6042 },
  { name: 'করাচি', country: 'পাকিস্তান', lat: 24.8607, lng: 67.0011 },
  { name: 'লাহোর', country: 'পাকিস্তান', lat: 31.5204, lng: 74.3587 },
];

const getClosestCity = (lat: number, lng: number): UserLocation => {
  let closest = DEFAULT_LOCATION;
  let minDistance = Infinity;

  CITY_COORDINATES.forEach((city) => {
    const distance = Math.hypot(city.lat - lat, city.lng - lng);
    if (distance < minDistance) {
      minDistance = distance;
      closest = {
        latitude: city.lat,
        longitude: city.lng,
        name: city.name,
        country: city.country,
      };
    }
  });

  return closest;
};

export const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize location on app start
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // Check if user has already selected a location
      const saved = await AsyncStorage.getItem('userLocation');
      if (saved) {
        setLocationState(JSON.parse(saved));
        setLoading(false);
        return;
      }

      // Try to get device location with permission
      requestLocationPermission();
    } catch (err) {
      console.error('Location init error:', err);
      setLocationState(DEFAULT_LOCATION);
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      // Dynamic import to avoid dependency issues
      try {
        // @ts-ignore - Dynamic import
        const LocationModule = require('expo-location');
        const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = LocationModule;
        
        const { status } = await requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          const loc = await getCurrentPositionAsync({});
          const { latitude, longitude } = loc.coords;

          // Find closest city for name
          const cityLocation = getClosestCity(latitude, longitude);

          const newLocation: UserLocation = {
            latitude,
            longitude,
            name: cityLocation.name,
            country: cityLocation.country,
          };

          await setLocation(newLocation);
        } else {
          // Permission denied - use default
          setLocationState(DEFAULT_LOCATION);
          setError('লোকেশন অনুমতি প্রয়োজন');
          setLoading(false);
        }
      } catch (moduleErr) {
        console.log('expo-location not available, using default');
        setLocationState(DEFAULT_LOCATION);
        setLoading(false);
      }
    } catch (err) {
      console.error('Permission error:', err);
      setLocationState(DEFAULT_LOCATION);
      setError('লোকেশন পেতে ব্যর্থ হয়েছে');
      setLoading(false);
    }
  };

  const setLocation = useCallback(async (newLocation: UserLocation) => {
    try {
      setLocationState(newLocation);
      await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('লোকেশন সংরক্ষণ করতে ব্যর্থ');
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    try {
      // @ts-ignore - Dynamic import
      const LocationModule = require('expo-location');
      const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = LocationModule;
      
      const { status } = await requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;
        
        const cityLocation = getClosestCity(latitude, longitude);
        await setLocation({
          latitude,
          longitude,
          name: cityLocation.name,
          country: cityLocation.country,
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('expo-location error:', err);
      return false;
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
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
