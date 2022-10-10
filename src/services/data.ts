import { sortBy } from 'lodash-es';

import { MetaData } from '@/types/MetaData';
import { baseApi } from './baseApi';

type MetaDataResp = MetaData;

type UploadDataArgs = FormData;

type UploadSensitiveDataArgs = FormData;

const dataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    metaData: builder.query<MetaDataResp, void>({
      query: () => ({
        url: '/data/metadata',
      }),
      transformResponse: (response: MetaDataResp) =>
        // It must be a valid MetaDataResp
        Object.fromEntries(
          Object.entries(response).map(([key, value]) => [
            key,
            // Sort null in the first
            typeof value === 'object'
              ? sortBy(
                  value,
                  (item) => Number(item !== null),
                  (item) => item
                )
              : value,
          ])
        ) as MetaDataResp,
    }),
    uploadData: builder.mutation<void, UploadDataArgs>({
      query: (args) => ({
        url: '/data/upload',
        method: 'POST',
        data: args,
      }),
    }),
    uploadSensitiveData: builder.mutation<void, UploadSensitiveDataArgs>({
      query: (args) => ({
        url: '/data/upload-sensitive',
        method: 'POST',
        data: args,
      }),
    }),
  }),
});

export const { useMetaDataQuery, useUploadDataMutation, useUploadSensitiveDataMutation } = dataApi;
