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
    // Permission logic can be added when expo-location is properly installed
    return true;
  };

  const getCurrentLocation = async () => {
    // For now, use default location
    // Full implementation requires proper expo-location setup
    setError(null);
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
