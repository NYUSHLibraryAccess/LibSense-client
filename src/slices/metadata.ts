import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestWithCatch, sortTags, prioritizeNull } from '@/utils';
import { IMetadata } from '@/utils/interfaces';
import { IRootState } from '@/utils/store';
import { getMetadata } from '@/api/getMetadata';

type IMetadataState = {
  hasMetadata: boolean;
  metadata: IMetadata;
};

const initialState: IMetadataState = {
  hasMetadata: false,
  metadata: {
    ipsCode: [],
    tags: [],
    vendors: [],
    oldestDate: '',
    material: [],
    materialType: [],
    cdlTags: [],
  },
};

const fetchMetadata = createAsyncThunk<IMetadata, void, { state: IRootState }>(
  'metadata/fetchMetadata',
  async (arg, { getState }) => {
    const state = getState();
    if (state.metadata.hasMetadata) {
      throw new Error();
    }
    return requestWithCatch(getMetadata());
  }
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMetadata.fulfilled, (state, { payload }) => {
      return {
        hasMetadata: true,
        metadata: {
          ipsCode: prioritizeNull(payload.ipsCode),
          tags: prioritizeNull(sortTags(payload.tags)).filter((item) => item !== 'CDL'),
          vendors: prioritizeNull(payload.vendors),
          oldestDate: payload.oldestDate,
          material: prioritizeNull(payload.material),
          materialType: prioritizeNull(payload.materialType),
          cdlTags: prioritizeNull(payload.cdlTags),
        },
      };
    });
  },
});

const metadataReducer = metadataSlice.reducer;

export { IMetadataState, fetchMetadata, metadataReducer };
