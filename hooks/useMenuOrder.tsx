import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_MENU_ITEMS = [
  { id: 'home', icon: 'home', label: 'হোম', action: 'home' },
  { id: 'azan', icon: 'bell', label: 'আজান', action: 'azan' },
  { id: 'prayer-teaching', icon: 'book-open', label: 'নামাজ শিক্ষা', action: 'prayer-teaching' },
  { id: 'dua', icon: 'book', label: 'দুয়া', action: 'dua' },
  { id: 'hajj', icon: 'award', label: 'হজ্জ', action: 'hajj' },
  { id: 'zakat', icon: 'dollar-sign', label: 'যাকাত', action: 'zakat' },
  { id: 'kalima', icon: 'check-circle', label: 'কালেমা', action: 'kalima' },
  { id: 'prayer-time', icon: 'clock', label: 'নামাজের সময়সূচী', action: 'prayer-time' },
  { id: 'qibla', icon: 'compass', label: 'কিবলা কম্পাস', action: 'qibla' },
  { id: 'islamic-calendar', icon: 'calendar', label: 'ইসলামিক ক্যালেন্ডার', action: 'islamic-calendar' },
  { id: 'islamic-books', icon: 'book', label: 'ইসলামিক বই', action: 'islamic-books' },
  { id: 'community', icon: 'users', label: 'আমাদের কমিউনিটি', action: 'community' },
  { id: 'quran-recitation', icon: 'volume-2', label: 'কুরআন তেলাওয়াত', action: 'quran-recitation' },
  { id: 'settings', icon: 'settings', label: 'সেটিংস', action: 'settings' },
  { id: 'notifications', icon: 'bell', label: 'বিজ্ঞপ্তি', action: 'notifications' },
  { id: 'feedback', icon: 'message-circle', label: 'প্রতিক্রিয়া', action: 'feedback' },
  { id: 'about', icon: 'info', label: 'আমাদের সম্পর্কে', action: 'about' },
  { id: 'help', icon: 'help-circle', label: 'সাহায্য ও সহায়তা', action: 'help' },
  { id: 'share', icon: 'share-2', label: 'অ্যাপ শেয়ার করুন', action: 'share' },
];

export const useMenuOrder = () => {
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU_ITEMS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenuOrder();
  }, []);

  const loadMenuOrder = async () => {
    try {
      const savedOrder = await AsyncStorage.getItem('menuOrder');
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setMenuItems(parsedOrder);
      } else {
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
    } catch (error) {
      console.log('Error loading menu order:', error);
      setMenuItems(DEFAULT_MENU_ITEMS);
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenuOrder = async (newOrder: typeof DEFAULT_MENU_ITEMS) => {
    try {
      setMenuItems(newOrder);
      await AsyncStorage.setItem('menuOrder', JSON.stringify(newOrder));
    } catch (error) {
      console.log('Error saving menu order:', error);
    }
  };

  const reorderMenu = (fromIndex: number, toIndex: number) => {
    const newOrder = [...menuItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    updateMenuOrder(newOrder);
  };

  return { menuItems, isLoading, reorderMenu, updateMenuOrder };
};
