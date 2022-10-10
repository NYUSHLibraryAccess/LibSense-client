import { TablePreset } from '@/types/TablePreset';
import { baseApi } from './baseApi';

type AllPresetsResp = Required<TablePreset>[];

type CreatePresetResp = {
  msg: string;
  presetId: number;
};

type CreatePresetArgs = Required<Omit<TablePreset, 'presetId' | 'creator'>>;

type DeletePresetArgs = Pick<TablePreset, 'presetId'>;

type UpdatePresetArgs = Required<Omit<TablePreset, 'creator'>>;

const presetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allPresets: builder.query<AllPresetsResp, void>({
      query: () => ({
        url: '/preset',
      }),
    }),
    createPreset: builder.mutation<CreatePresetResp, CreatePresetArgs>({
      query: (args) => ({
        url: '/preset',
        method: 'POST',
        data: args,
      }),
    }),
    deletePreset: builder.mutation<void, DeletePresetArgs>({
      query: (args) => ({
        url: '/preset',
        method: 'DELETE',
        params: args,
      }),
    }),
    updatePreset: builder.mutation<void, UpdatePresetArgs>({
      query: (args) => ({
        url: '/preset',
        method: 'PATCH',
        data: args,
      }),
    }),
  }),
});

export const { useAllPresetsQuery, useCreatePresetMutation, useDeletePresetMutation, useUpdatePresetMutation } =
  presetsApi;
