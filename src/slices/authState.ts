import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type IAuthState = {
  displayUsername: string;
};

const initialState: IAuthState = {
  displayUsername: '',
};

const authStateSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    setDisplayUsername: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      displayUsername: payload,
    }),
  },
});

const { setDisplayUsername } = authStateSlice.actions;
const authStateReducer = authStateSlice.reducer;

export { IAuthState, setDisplayUsername, authStateReducer };
