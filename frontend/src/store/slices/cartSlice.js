import { createSlice } from '@reduxjs/toolkit';

/**
 * Cart Slice - Manages shopping cart state
 */

// Load cart from localStorage and calculate initial totals
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem('cart');
  const items = savedCart ? JSON.parse(savedCart) : [];

  // Calculate totals from saved items
  let totalItems = 0;
  let totalAmount = 0;

  items.forEach(item => {
    totalItems += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  return {
    items,
    totalItems,
    totalAmount
  };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const quantityToAdd = item.quantity || 1;

      // Check if item already exists
      const existingItem = state.items.find(i => i._id === item._id);

      if (existingItem) {
        // Add the specified quantity to existing item
        existingItem.quantity += quantityToAdd;
        // Update price if it changed (e.g., due to offer)
        if (item.finalPrice !== undefined) {
          existingItem.price = item.finalPrice;
          existingItem.finalPrice = item.finalPrice;
        }
      } else {
        // Add new item with specified quantity
        state.items.push({
          ...item,
          quantity: quantityToAdd,
          price: item.finalPrice || item.price // Use finalPrice if available
        });
      }

      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);

      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item._id !== itemId);

      // Clear restaurant if cart is empty
      // if (state.items.length === 0) {
      //   state.restaurantId = null;
      // }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i._id === itemId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }

      // Clear restaurant if cart is empty
      // if (state.items.length === 0) {
      //   state.restaurantId = null;
      // }

      cartSlice.caseReducers.calculateTotals(state);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },

    calculateTotals: (state) => {
      let totalItems = 0;
      let totalAmount = 0;

      state.items.forEach(item => {
        totalItems += item.quantity;
        totalAmount += item.price * item.quantity;
      });

      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;
