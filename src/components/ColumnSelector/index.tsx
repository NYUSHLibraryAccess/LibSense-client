import * as React from 'react';
import { useCallback, useState } from 'react';
import { Button, Checkbox, Divider, Popover, Space, Table } from 'antd';
import { EyeOutlined, MenuOutlined, SwapOutlined, UndoOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, SortEndHandler } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { concat } from 'lodash';
import { useDidMountEffect } from '@/utils';
import { IColumn } from '@/utils/interfaces';
import style from './style.module.less';

type IColumnSelectorRecord = { key: IColumn; checked: boolean; name: string };

// Default component data
const defaultData: IColumnSelectorRecord[] = [
  { key: 'barcode', checked: true, name: 'Barcode' },
  { key: 'title', checked: true, name: 'Title' },
  { key: 'orderNumber', checked: true, name: 'Order Number' },
  { key: 'createdDate', checked: true, name: 'Created Date' },
  { key: 'arrivalDate', checked: true, name: 'Arrival Date' },
  { key: 'ipsCode', checked: true, name: 'IPS Code' },
  { key: 'ips', checked: true, name: 'IPS' },
  { key: 'ipsDate', checked: true, name: 'IPS Date' },
  { key: 'vendorCode', checked: true, name: 'Vendor Code' },
  { key: 'libraryNote', checked: true, name: 'Library Note' },
];
const defaultCdlData = concat<IColumnSelectorRecord>(defaultData, [
  { key: 'cdlItemStatus', checked: true, name: 'CDL Item Status' },
  { key: 'orderRequestDate', checked: true, name: 'Order Request Date' },
  { key: 'scanningVendorPaymentDate', checked: true, name: 'Scanning Vendor Payment Date' },
  { key: 'pdfDeliveryDate', checked: true, name: 'PDF Delivery Date' },
  { key: 'backToKarmsDate', checked: true, name: 'Back to KARMS Date' },
  { key: 'circPdfUrl', checked: true, name: 'Circ PDF URL' },
]);

// Change one record
const changeOne = (data: IColumnSelectorRecord[], key: IColumn, checked: boolean): IColumnSelectorRecord[] =>
  data.map((item) =>
    item.key === key
      ? {
          ...item,
          checked,
        }
      : item
  );

// Change all records
const changeAll = (data: IColumnSelectorRecord[], checked: boolean): IColumnSelectorRecord[] =>
  data.map((item) => ({
    ...item,
    checked,
  }));

// Reverse all records
const reverseAll = (data: IColumnSelectorRecord[]): IColumnSelectorRecord[] =>
  data.map((item) => ({
    ...item,
    checked: !item.checked,
  }));

// Convert data to columns
const getColumns = (data: IColumnSelectorRecord[]): IColumn[] =>
  data.filter((item) => item.checked).map((item) => item.key);

// Get default columns
const getDefaultColumns = (isCdl: boolean): IColumn[] => getColumns(!isCdl ? defaultData : defaultCdlData);

// Get column name
const getColumnName = (isCdl: boolean, key: IColumn): string =>
  (!isCdl ? defaultData : defaultCdlData).find((item) => item.key === key)?.name;

// Helper component for drag-and-drop sorting
const DragHandle = SortableHandle(() => <MenuOutlined className={style.dragHandle} />);
const SortableRow = SortableElement(({ children }: { children: React.ReactNode }) => <tr>{children}</tr>);
const SortableBody = SortableContainer(({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>);

const ColumnSelector: React.FC<{
  isCdl: boolean;
  onChange: (columns: IColumn[]) => void;
}> = ({ isCdl, onChange }) => {
  // TODO: separate states into arrays to improve performance
  // Component core states
  const [data, setData] = useState(!isCdl ? defaultData : defaultCdlData);

  // Helper states
  const [checkedAll, setCheckedAll] = useState(data.every((item) => item.checked));
  const [checkedNone, setCheckedNone] = useState(data.every((item) => !item.checked));

  // Side effect hook that runs when data is updated
  useDidMountEffect(() => {
    // Update helper states
    setCheckedAll(data.every((item) => item.checked));
    setCheckedNone(data.every((item) => !item.checked));
    // Invoke callback
    onChange(getColumns(data));
  }, [data]);

  // Reset data when `isCdl` changes
  useDidMountEffect(() => {
    setData(!isCdl ? defaultData : defaultCdlData);
  }, [isCdl]);

  const onSortEnd: SortEndHandler = useCallback(
    ({ oldIndex, newIndex }) => {
      setData(arrayMoveImmutable(data, oldIndex, newIndex));
    },
    [data]
  );

  const Row: React.FC<{ 'data-row-key': string; children: React.ReactNode }> = ({
    'data-row-key': dataRowKey,
    children,
  }) => {
    const index = data.findIndex((value) => value.key === dataRowKey);
    return <SortableRow index={index}>{children}</SortableRow>;
  };

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <SortableBody useDragHandle disableAutoscroll helperClass={style.draggingRowHelper} onSortEnd={onSortEnd}>
        {children}
      </SortableBody>
    );
  };

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      getPopupContainer={() => document.getElementById('orderTableCard')}
      overlayClassName={style.overlay}
      content={
        <>
          <Checkbox
            className={style.checkAll}
            indeterminate={!checkedAll && !checkedNone}
            checked={checkedAll}
            onChange={(e) => {
              // Toggle all items
              setData(changeAll(data, e.target.checked));
            }}
          >
            Select All
          </Checkbox>
          <Divider className={style.divider} />
          <Table<IColumnSelectorRecord>
            showHeader={false}
            pagination={false}
            dataSource={data}
            components={{
              body: {
                row: Row,
                wrapper: Wrapper,
              },
            }}
          >
            <Table.Column<IColumnSelectorRecord> key="handle" render={() => <DragHandle />} width="24px" />
            <Table.Column<IColumnSelectorRecord>
              render={(text, record) => (
                <Checkbox
                  className={`${style.checkOne} ${
                    record.checked ? style['checkOne-Checked'] : style['checkOne-Unchecked']
                  }`}
                  checked={record.checked}
                  onChange={(e) => {
                    // Toggle one item
                    setData(changeOne(data, record.key, e.target.checked));
                  }}
                >
                  {record.name}
                </Checkbox>
              )}
            />
          </Table>
          <Divider className={style.divider} />
          <Space className={style.buttons}>
            <Button
              shape="round"
              size="small"
              icon={<SwapOutlined />}
              onClick={() => {
                // Reverse all items
                setData(reverseAll(data));
              }}
            >
              Reverse
            </Button>
            <Button
              shape="round"
              size="small"
              icon={<UndoOutlined />}
              onClick={() => {
                // Reset all items
                setData(!isCdl ? defaultData : defaultCdlData);
              }}
            >
              Reset
            </Button>
          </Space>
        </>
      }
    >
      <Button shape="round" size="small" icon={<EyeOutlined />}>
        Change Columns...
      </Button>
    </Popover>
  );
};

export { ColumnSelector, getDefaultColumns, getColumnName };
