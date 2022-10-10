import { ColumnType } from 'antd/es/table';

import { CdlOrder } from '@/types/CdlOrder';
import { GeneralOrder } from '@/types/GeneralOrder';

type ColumnOption = {
  visible: boolean;
  dataIndex: keyof (GeneralOrder & CdlOrder);
  title?: string;
  widthCls?: string;
  render?: ColumnType<GeneralOrder | CdlOrder>['render'];
  sortable?: boolean;
  cdlOnly?: boolean;
};

export { ColumnOption };
