import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IAuthState = {
  displayUsername: string;
};

const initialState: IAuthState = {
  displayUsername: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setDisplayUsername: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      displayUsername: payload,
    }),
  },
});

const { setDisplayUsername } = authSlice.actions;
const authReducer = authSlice.reducer;

export { IAuthState, setDisplayUsername, authReducer };
