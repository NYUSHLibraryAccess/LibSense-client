import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRole } from '@/utils/interfaces';

type IAuthState = {
  username: string;
  role: IRole;
};

const initialState: IAuthState = {
  username: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      username: payload,
    }),
    setRole: (state, { payload }: PayloadAction<IRole>) => ({
      ...state,
      role: payload,
    }),
  },
});

const { setUsername, setRole } = authSlice.actions;
const authReducer = authSlice.reducer;

export { IAuthState, setUsername, setRole, authReducer };
