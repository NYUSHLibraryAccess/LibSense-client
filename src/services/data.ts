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
