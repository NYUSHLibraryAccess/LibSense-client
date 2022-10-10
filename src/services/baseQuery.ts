import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
};

type AxiosBaseQueryResult = unknown;

type AxiosBaseQueryError = {
  status: number;
  data: unknown;
};

type AxiosBaseQueryDefinitionExtraOptions = Record<string, unknown>;

type AxiosBaseQueryMeta = {
  timeCost: number;
};

// Referenced code from https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#axios-basequery.
const axiosBaseQuery =
  (
    { baseUrl } = { baseUrl: '' }
  ): BaseQueryFn<
    AxiosBaseQueryArgs,
    AxiosBaseQueryResult,
    AxiosBaseQueryError,
    AxiosBaseQueryDefinitionExtraOptions,
    AxiosBaseQueryMeta
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({ url: baseUrl + url, method, data, params });
      return {
        data: result.data,
      };
    } catch (error) {
      // error must be an AxiosError
      return {
        error: {
          status: (error as AxiosError).response?.status,
          data: (error as AxiosError).response?.data || (error as AxiosError).message,
        },
      };
    }
  };

export {
  AxiosBaseQueryArgs,
  AxiosBaseQueryDefinitionExtraOptions,
  AxiosBaseQueryError,
  AxiosBaseQueryMeta,
  AxiosBaseQueryResult,
};
export { axiosBaseQuery };
