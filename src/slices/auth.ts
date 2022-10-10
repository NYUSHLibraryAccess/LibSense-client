import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SystemUser } from '@/types/SystemUser';

type AuthState = SystemUser;

const initialState: AuthState = {
  username: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => ({
      ...state,
      username: action.payload,
    }),
    updateRole: (state, action: PayloadAction<SystemUser['role']>) => ({
      ...state,
      role: action.payload,
    }),
  },
});

export const { updateUsername, updateRole } = authSlice.actions;
export { authSlice };
