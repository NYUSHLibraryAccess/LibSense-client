import { configureStore } from '@reduxjs/toolkit';
import { authStateReducer } from '@/slices/authState';

const store = configureStore({
  reducer: {
    authState: authStateReducer,
  },
});

export { store };
