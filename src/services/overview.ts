import { Overview } from '@/types/Overview';
import { baseApi } from './baseApi';

type OverviewResp = Overview;

const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    overview: builder.query<OverviewResp, void>({
      query: () => ({
        url: '/overview',
      }),
    }),
  }),
});

export const { useOverviewQuery } = overviewApi;
