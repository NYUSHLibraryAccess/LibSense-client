import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MetaTagState = {
  title: string;
};

const initialState: MetaTagState = {
  title: null,
};

const metaTagSlice = createSlice({
  name: 'metaTag',
  initialState,
  reducers: {
    updateTitle: (state, action: PayloadAction<string>) => ({
      ...state,
      title: action.payload,
    }),
  },
});

export const { updateTitle } = metaTagSlice.actions;
export { metaTagSlice };
