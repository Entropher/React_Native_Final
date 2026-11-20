import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Product } from '@/types/product';

export const MAX_QUANTITY = 10;

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Used once on app start to load the cart saved in AsyncStorage.
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    addToCart(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity = Math.min(MAX_QUANTITY, existingItem.quantity + 1);
        return;
      }

      state.items.push({ ...product, quantity: 1 });
    },
    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((entry) => entry.id === action.payload);

      if (item) {
        item.quantity = Math.min(MAX_QUANTITY, item.quantity + 1);
      }
    },
    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((entry) => entry.id === action.payload);

      if (item) {
        item.quantity = Math.max(1, item.quantity - 1);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setCartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
  cartSlice.actions;

type StateWithCart = { cart: CartState };

export const selectCartItems = (state: StateWithCart) => state.cart.items;
export const selectCartItemCount = (state: StateWithCart) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state: StateWithCart) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectItemQuantity = (productId: number) => (state: StateWithCart) =>
  state.cart.items.find((item) => item.id === productId)?.quantity ?? 0;

export default cartSlice.reducer;
