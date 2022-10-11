import { CdlOnlyOrder } from '@/types/CdlOnlyOrder';
import { CdlOrder } from '@/types/CdlOrder';
import { FilterArgs } from '@/types/FilterArgs';
import { GeneralOrder } from '@/types/GeneralOrder';
import { SorterArgs } from '@/types/SorterArgs';
import { ViewArgs } from '@/types/ViewArgs';
import { baseApi } from './baseApi';

type AllOrdersResp = {
  pageIndex: number;
  pageLimit: number;
  totalRecords: number;
  result: (GeneralOrder | CdlOrder)[];
};

type AllOrdersArgs = {
  pageIndex: number;
  pageSize: number;
  filters?: FilterArgs[];
  sorter?: SorterArgs;
  fuzzy?: string;
  views?: ViewArgs;
};

type OrderDetailResp = GeneralOrder | CdlOrder;

type OrderDetailArgs = {
  bookId: number;
  cdlView?: boolean;
};

type UpdateOrderArgs = {
  bookId: number;
  trackingNote?: string;
  checked?: boolean;
  checkAnyway?: boolean;
  attention?: boolean;
  sensitive?: boolean;
  overrideReminderTime?: string;
  cdl?: Partial<CdlOnlyOrder>;
};

type CreateCdlArgs = {
  bookId: number;
};

type DeleteCdlArgs = {
  bookId: number;
};

type MarkCheckArgs = {
  id: number[];
  checked: boolean;
  date?: string;
};

type MarkAttentionArgs = {
  id: number[];
  attention: boolean;
};

type ResetCdlVendorDateArgs = {
  date: string;
};

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOrders: builder.query<AllOrdersResp, AllOrdersArgs>({
      query: (args) => ({
        url: '/orders/all-orders',
        method: 'POST',
        data: args,
      }),
    }),
    orderDetail: builder.query<OrderDetailResp, OrderDetailArgs>({
      query: (args) => ({
        url: '/orders/all-orders/detail',
        params: args,
      }),
    }),
    updateOrder: builder.mutation<void, UpdateOrderArgs>({
      query: (args) => ({
        url: '/orders/all-orders/detail',
        method: 'PATCH',
        data: args,
      }),
    }),
    createCdl: builder.mutation<void, CreateCdlArgs>({
      query: (args) => ({
        url: '/orders/cdl',
        method: 'POST',
        data: args,
      }),
    }),
    deleteCdl: builder.mutation<void, DeleteCdlArgs>({
      query: (args) => ({
        url: '/orders/cdl',
        method: 'DELETE',
        params: args,
      }),
    }),
    markCheck: builder.mutation<void, MarkCheckArgs>({
      query: (args) => ({
        url: '/orders/check',
        method: 'POST',
        data: args,
      }),
    }),
    markAttention: builder.mutation<void, MarkAttentionArgs>({
      query: (args) => ({
        url: '/orders/attention',
        method: 'POST',
        data: args,
      }),
    }),
    resetCdlVendorDate: builder.mutation<void, ResetCdlVendorDateArgs>({
      query: (args) => ({
        url: '/orders/cdl/reset-vendor-date',
        method: 'POST',
        data: args,
      }),
    }),
  }),
});

export const {
  useAllOrdersQuery,
  useOrderDetailQuery,
  useUpdateOrderMutation,
  useCreateCdlMutation,
  useDeleteCdlMutation,
  useMarkCheckMutation,
  useMarkAttentionMutation,
  useResetCdlVendorDateMutation,
} = ordersApi;
