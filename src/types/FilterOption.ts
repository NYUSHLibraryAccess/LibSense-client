import { FilterArgs } from '@/types/FilterArgs';
import { MetaData } from '@/types/MetaData';

type FilterOption = {
  title?: string;
  metaDataIndex?: keyof Omit<MetaData, 'oldestDate'>;
  cdlOnly?: boolean;
} & FilterArgs;

export { FilterOption };
