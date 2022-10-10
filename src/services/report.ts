import { ReportType } from '@/types/ReportType';
import { baseApi } from './baseApi';

type TestArgs = {
  username: string;
  email: string;
  reportType: ReportType[];
};

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendReport: builder.mutation<void, TestArgs>({
      query: (args) => ({
        url: '/report/send-report',
        method: 'POST',
        data: args,
      }),
    }),
  }),
});

export const { useSendReportMutation } = reportApi;
