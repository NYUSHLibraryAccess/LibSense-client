import { ViewArgs } from '@/types/ViewArgs';
import { FilterArgs } from './FilterArgs';

type TablePreset = {
  presetId: number;
  presetName: string;
  creator?: string;
  filters?: FilterArgs[];
  views?: ViewArgs;
};

export { TablePreset };
