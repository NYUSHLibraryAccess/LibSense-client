import { CdlOrder } from '@/types/CdlOrder';
import { GeneralOrder } from '@/types/GeneralOrder';

type SorterArgs = {
  col: keyof (GeneralOrder & CdlOrder);
  desc: boolean;
};

export { SorterArgs };
