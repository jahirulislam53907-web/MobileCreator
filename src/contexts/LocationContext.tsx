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
  requestLocationPermission: () => Promise<boolean>;
}

const DEFAULT_LOCATION: UserLocation = {
  latitude: 23.8103,
  longitude: 90.4125,
  name: 'ঢাকা',
  country: 'বাংলাদেশ',
};

const CITY_COORDINATES = [
  { name: 'ঢাকা', country: 'বাংলাদেশ', lat: 23.8103, lng: 90.4125 },
  { name: 'চট্টগ্রাম', country: 'বাংলাদেশ', lat: 22.3569, lng: 91.7832 },
  { name: 'সিলেট', country: 'বাংলাদেশ', lat: 24.8152, lng: 91.2736 },
  { name: 'খুলনা', country: 'বাংলাদেশ', lat: 22.8456, lng: 89.5664 },
  { name: 'রাজশাহী', country: 'বাংলাদেশ', lat: 24.3745, lng: 88.6042 },
  { name: 'করাচি', country: 'পাকিস্তান', lat: 24.8607, lng: 67.0011 },
  { name: 'লাহোর', country: 'পাকিস্তান', lat: 31.5204, lng: 74.3587 },
  { name: 'লন্ডন', country: 'যুক্তরাজ্য', lat: 51.5074, lng: -0.1278 },
  { name: 'নিউইয়র্ক', country: 'যুক্তরাষ্ট্র', lat: 40.7128, lng: -74.006 },
  { name: 'দোহা', country: 'কাতার', lat: 25.2854, lng: 51.5310 },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // Clear old location data for new behavior
      await AsyncStorage.removeItem('userLocation');
      // Start with null - no location selected yet
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const setLocation = useCallback(async (newLocation: UserLocation) => {
    try {
      setLocationState(newLocation);
      await AsyncStorage.setItem('userLocation', JSON.stringify(newLocation));
      setError(null);
    } catch (err) {
      setError('লোকেশন সংরক্ষণ করতে ব্যর্থ');
    }
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('লোকেশন পারমিশন প্রয়োজন');
        await setLocation(DEFAULT_LOCATION);
        setLoading(false);
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const closest = getClosestCity(location.coords.latitude, location.coords.longitude);
      await setLocation(closest);
      setLoading(false);
      return true;
    } catch (err) {
      setError('লোকেশন প্রাপ্ত করতে ব্যর্থ হয়েছে');
      await setLocation(DEFAULT_LOCATION);
      setLoading(false);
      return false;
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        setLocation,
        requestLocationPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
