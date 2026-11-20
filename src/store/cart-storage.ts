import AsyncStorage from '@react-native-async-storage/async-storage';

import { selectCartItems, setCartItems } from './cart-slice';
import { store } from './store';

const CART_STORAGE_KEY = 'cart';

/**
 * Loads the saved cart from AsyncStorage into Redux, then keeps AsyncStorage
 * up to date: every time the cart changes, the new contents are written back.
 * Call this once, when the app starts.
 */
export async function restoreAndPersistCart() {
  try {
    const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
    const items = saved ? JSON.parse(saved) : null;
    if (Array.isArray(items)) {
      store.dispatch(setCartItems(items));
    }
  } catch {
    // Unreadable or corrupted data: start with an empty cart.
  }

  // Saving starts only after loading, so an empty cart can't overwrite the saved one.
  let lastSavedItems = selectCartItems(store.getState());
  store.subscribe(() => {
    const items = selectCartItems(store.getState());
    if (items === lastSavedItems) return; // Something else in the store changed.

    lastSavedItems = items;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(() => {
      // Saving failed (e.g. device storage full); the in-memory cart still works.
    });
  });
}
