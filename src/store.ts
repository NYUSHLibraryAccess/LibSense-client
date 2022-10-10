import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@/slices/auth';
import { metaTagSlice } from '@/slices/metaTag';
import { baseApi } from '@/services/baseApi';

const store = configureStore({
  reducer: {
    [metaTagSlice.name]: metaTagSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppDispatch: () => AppDispatch = useDispatch;

export { AppDispatch, RootState, store, useAppDispatch, useAppSelector };
