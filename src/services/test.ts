import { baseApi } from './baseApi';

type TestArgs = {
  error?: boolean;
};

const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    test: builder.mutation<void, TestArgs>({
      query: (args) => ({
        url: '/test',
        method: 'POST',
        data: args,
      }),
    }),
  }),
});

export const { useTestMutation } = testApi;
