import { createApi, retry } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './baseQuery';

const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: retry(
    axiosBaseQuery({
      baseUrl: '/api/v1',
    }),
    {
      maxRetries: 3,
    }
  ),
  endpoints: () => ({}),
});

export { baseApi };
