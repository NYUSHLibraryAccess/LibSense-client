import { CdlOrder } from './CdlOrder';
import { GeneralOrder } from './GeneralOrder';

type FilterArgs =
  | {
      op: 'in';
      col: keyof (GeneralOrder & CdlOrder);
      val: string[];
    }
  | {
      op: 'between';
      col: keyof (GeneralOrder & CdlOrder);
      val: [string, string];
    }
  | {
      op: 'like' | 'eq' | 'greater' | 'smaller';
      col: keyof (GeneralOrder & CdlOrder);
      val: string;
    };

export { FilterArgs };
