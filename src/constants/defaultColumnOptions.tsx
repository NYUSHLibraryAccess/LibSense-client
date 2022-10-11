import { Tooltip } from 'antd';

import { GeneralAction } from '@/components/GeneralAction';
import { ColumnOption } from '@/types/ColumnOption';

const defaultColumnOptions: ColumnOption[] = [
  { visible: true, dataIndex: 'title', widthCls: 'w-48', sortable: true },
  { visible: true, dataIndex: 'orderNumber', widthCls: 'w-36', sortable: true },
  { visible: true, dataIndex: 'barcode', widthCls: 'w-36', sortable: true },
  { visible: true, dataIndex: 'createdDate', widthCls: 'w-24', sortable: true },
  { visible: true, dataIndex: 'scanningVendorPaymentDate', widthCls: 'w-24', sortable: true, cdlOnly: true },
  {
    visible: true,
    dataIndex: 'pdfDeliveryDate',
    title: 'PDF Delivery Date',
    widthCls: 'w-24',
    sortable: true,
    cdlOnly: true,
  },
  { visible: true, dataIndex: 'arrivalDate', widthCls: 'w-24', sortable: true },
  { visible: true, dataIndex: 'ipsDate', title: 'IPS Date', widthCls: 'w-24', sortable: true },
  {
    visible: true,
    dataIndex: 'ipsCode',
    title: 'IPS Code',
    render: (value, record) => (
      <Tooltip title={record.ips} mouseEnterDelay={0.5}>
        <div className="w-16 whitespace-nowrap overflow-hidden text-ellipsis">{value ?? '-'}</div>
      </Tooltip>
    ),
    sortable: true,
  },
  {
    visible: true,
    dataIndex: 'cdlItemStatus',
    title: 'CDL Item Status',
    widthCls: 'w-32',
    sortable: true,
    cdlOnly: true,
  },
  { visible: true, dataIndex: 'trackingNote', widthCls: 'w-72' },
  { visible: true, dataIndex: 'libraryNote', widthCls: 'w-72' },
  {
    visible: true,
    dataIndex: 'circPdfUrl',
    title: 'Circ PDF URL',
    render: (value) => (
      <Tooltip title={value} mouseEnterDelay={0.5}>
        <div className="w-48 whitespace-nowrap overflow-hidden text-ellipsis">
          <GeneralAction
            onClick={() => {
              value && window.open(value, '_blank').focus();
            }}
          >
            {value ?? '-'}
          </GeneralAction>
        </div>
      </Tooltip>
    ),
    sortable: true,
    cdlOnly: true,
  },

  { visible: false, dataIndex: 'orderRequestDate', widthCls: 'w-24', sortable: true, cdlOnly: true },
  {
    visible: false,
    dataIndex: 'backToKarmsDate',
    title: 'Back to KARMS Date',
    widthCls: 'w-24',
    sortable: true,
    cdlOnly: true,
  },
  { visible: false, dataIndex: 'vendorCode', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'bsn', title: 'BSN', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'arrivalText', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'arrivalStatus', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'arrivalOperator', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'itemsCreated', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'itemStatus', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'material', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'collection', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'ipsUpdateDate', title: 'IPS Update Date', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'ipsCodeOperator', title: 'IPS Code Operator', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'updateDate', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'sublibrary', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'orderStatus', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'invoiceStatus', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'materialType', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'orderType', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'orderUnit', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'totalPrice', widthCls: 'w-24', sortable: true },
  { visible: false, dataIndex: 'orderStatusUpdateDate', widthCls: 'w-24', sortable: true },
  // Hidden CDl columns
  { visible: false, dataIndex: 'dueDate', widthCls: 'w-48', sortable: true, cdlOnly: true },
  { visible: false, dataIndex: 'physicalCopyStatus', widthCls: 'w-48', sortable: true, cdlOnly: true },
  {
    visible: false,
    dataIndex: 'vendorFileUrl',
    title: 'Vendor File URL',
    render: (value) => (
      <Tooltip title={value} mouseEnterDelay={0.5}>
        <div className="w-48 whitespace-nowrap overflow-hidden text-ellipsis">
          <GeneralAction
            onClick={() => {
              value && window.open(value, '_blank').focus();
            }}
          >
            {value ?? '-'}
          </GeneralAction>
        </div>
      </Tooltip>
    ),
    sortable: true,
    cdlOnly: true,
  },
  {
    visible: false,
    dataIndex: 'bobcatPermanentLink',
    render: (value) => (
      <Tooltip title={value} mouseEnterDelay={0.5}>
        <div className="w-48 whitespace-nowrap overflow-hidden text-ellipsis">
          <GeneralAction
            onClick={() => {
              value && window.open(value, '_blank').focus();
            }}
          >
            {value ?? '-'}
          </GeneralAction>
        </div>
      </Tooltip>
    ),
    sortable: true,
    cdlOnly: true,
  },
  { visible: false, dataIndex: 'filePassword', widthCls: 'w-48', sortable: true, cdlOnly: true },
  { visible: false, dataIndex: 'author', widthCls: 'w-48', sortable: true, cdlOnly: true },
  { visible: false, dataIndex: 'pages', widthCls: 'w-48', sortable: true, cdlOnly: true },
];

export { defaultColumnOptions };
