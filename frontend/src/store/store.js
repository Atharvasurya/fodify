import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import adminAuthReducer from './slices/adminAuthSlice';

/**
 * Redux Store Configuration
 * Combines auth and cart reducers
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    adminAuth: adminAuthReducer,
  },
});

export default store;
