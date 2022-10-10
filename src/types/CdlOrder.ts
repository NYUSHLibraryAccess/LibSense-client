import { CdlOnlyOrder } from '@/types/CdlOnlyOrder';
import { GeneralOrder } from '@/types/GeneralOrder';

type CdlOrder = GeneralOrder & CdlOnlyOrder;

export { CdlOrder };
