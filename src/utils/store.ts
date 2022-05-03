import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/slices/auth';
import { metadataReducer } from '@/slices/metadata';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    metadata: metadataReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
