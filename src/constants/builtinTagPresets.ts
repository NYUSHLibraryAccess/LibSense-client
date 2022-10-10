import { TablePreset } from '@/types/TablePreset';

const builtinTagPresets: TablePreset[] = [
  {
    presetId: -100,
    presetName: 'All',
  },
  {
    presetId: -101,
    presetName: 'Rush',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Rush'],
      },
    ],
  },
  {
    presetId: -102,
    presetName: 'CDL',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['CDL'],
      },
    ],
    views: {
      cdlView: true,
    },
  },
  {
    presetId: -103,
    presetName: 'Rush-NY',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Rush', 'NY'],
      },
    ],
  },
  {
    presetId: -104,
    presetName: 'Rush-Local',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Rush', 'Local'],
      },
    ],
  },
  {
    presetId: -105,
    presetName: 'Rush-DVD',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Rush', 'DVD'],
      },
    ],
  },
  {
    presetId: -106,
    presetName: 'Course Reserve',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Reserve'],
      },
    ],
  },
  {
    presetId: -107,
    presetName: 'ILL',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['ILL'],
      },
    ],
  },
  {
    presetId: -108,
    presetName: 'Non-Rush',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Non-Rush'],
      },
    ],
  },
  {
    presetId: -109,
    presetName: 'Sensitive',
    filters: [
      {
        op: 'in',
        col: 'tags',
        val: ['Sensitive'],
      },
    ],
  },
];

export { builtinTagPresets };
