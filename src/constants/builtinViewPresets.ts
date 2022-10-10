import { TablePreset } from '@/types/TablePreset';

const builtinViewPresets: TablePreset[] = [
  {
    presetId: -200,
    presetName: 'Pending Rush-Local',
    views: {
      pendingRushLocal: true,
    },
  },
  {
    presetId: -201,
    presetName: 'Pending CDL',
    views: {
      cdlView: true,
      pendingCdl: true,
    },
  },
  {
    presetId: -202,
    presetName: 'Prioritize',
    views: {
      prioritize: true,
    },
  },
];

export { builtinViewPresets };
