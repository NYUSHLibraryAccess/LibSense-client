import { Vendor } from '@/types/Vendor';
import { baseApi } from './baseApi';

type AllVendorsResp = Vendor[];

type VendorsResp = Vendor;

type VendorArgs = Pick<Vendor, 'vendorCode'>;

type CreateVendorArgs = Vendor;

type DeleteVendorArgs = Pick<Vendor, 'vendorCode'>;

type UpdateVendorArgs = Vendor;

const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allVendors: builder.query<AllVendorsResp, void>({
      query: () => ({
        url: '/vendor/all-vendors',
      }),
    }),
    vendors: builder.query<VendorsResp, VendorArgs>({
      query: (args) => ({
        url: '/vendor',
        params: args,
      }),
    }),
    createVendor: builder.mutation<void, CreateVendorArgs>({
      query: (args) => ({
        url: '/vendor',
        method: 'POST',
        data: args,
      }),
    }),
    deleteVendor: builder.mutation<void, DeleteVendorArgs>({
      query: (args) => ({
        url: '/vendor',
        method: 'DELETE',
        params: args,
      }),
    }),
    updateVendor: builder.mutation<void, UpdateVendorArgs>({
      query: (args) => ({
        url: '/vendor',
        method: 'PATCH',
        data: args,
      }),
    }),
  }),
});

export const {
  useAllVendorsQuery,
  useVendorsQuery,
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useUpdateVendorMutation,
} = vendorsApi;
