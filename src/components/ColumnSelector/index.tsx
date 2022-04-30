import * as React from 'react';
import { useState } from 'react';
import { IObservableArray, toJS, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Checkbox, Divider, Space, Table } from 'antd';
import { MenuOutlined, SwapOutlined, UndoOutlined } from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle, SortEndHandler } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import style from './style.module.less';

type IColumnSelectorRecord = { key: string; checked: boolean; name: string };

const DragHandle = SortableHandle(() => <MenuOutlined className={style.dragHandle} />);
const SortableRow = SortableElement(({ children }: { children: React.ReactNode }) => <tr>{children}</tr>);
const SortableBody = SortableContainer(({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>);

const ColumnSelector: React.FC<{
  data: IObservableArray<IColumnSelectorRecord>;
  defaultData: IColumnSelectorRecord[];
}> = observer(({ data, defaultData }) => {
  const [checkedAll] = useState(computed(() => data.every((item) => item.checked)));
  const [checkedNone] = useState(computed(() => data.every((item) => !item.checked)));

  const onSortEnd: SortEndHandler = ({ oldIndex, newIndex }) => {
    data.replace(arrayMoveImmutable(data, oldIndex, newIndex));
  };

  const Row: React.FC<{ 'data-row-key': string; children: React.ReactNode }> = observer(
    ({ 'data-row-key': dataRowKey, children }) => {
      const index = data.findIndex((value) => value.key === dataRowKey);
      return <SortableRow index={index}>{children}</SortableRow>;
    }
  );

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <SortableBody useDragHandle disableAutoscroll helperClass={style.draggedRow} onSortEnd={onSortEnd}>
        {children}
      </SortableBody>
    );
  };

  return (
    <>
      <Checkbox
        className={style.checkAll}
        indeterminate={!checkedAll.get() && !checkedNone.get()}
        checked={checkedAll.get()}
        onChange={(e) => {
          data.forEach((item) => {
            item.checked = e.target.checked;
          });
        }}
      >
        Select All
      </Checkbox>
      <Divider className={style.divider} />
      <Table<IColumnSelectorRecord>
        showHeader={false}
        pagination={false}
        dataSource={toJS(data)}
        components={{
          body: {
            row: Row,
            wrapper: Wrapper,
          },
        }}
      >
        <Table.Column<IColumnSelectorRecord> key="handle" render={() => <DragHandle />} width="24px" />
        <Table.Column<IColumnSelectorRecord>
          render={(text, record) => {
            return (
              <Checkbox
                className={record.checked ? style.checkOneChecked : style.checkOne}
                checked={record.checked}
                onChange={(event) => {
                  data.forEach((item) => {
                    if (item.key === record.key) {
                      item.checked = event.target.checked;
                    }
                  });
                }}
              >
                {record.name}
              </Checkbox>
            );
          }}
        />
      </Table>
      <Divider className={style.divider} />
      <Space className={style.buttons}>
        <Button
          shape="round"
          size="small"
          icon={<SwapOutlined />}
          onClick={() => {
            data.forEach((item) => {
              item.checked = !item.checked;
            });
          }}
        >
          Revert
        </Button>
        <Button
          shape="round"
          size="small"
          icon={<UndoOutlined />}
          onClick={() => {
            data.replace(defaultData);
          }}
        >
          Reset
        </Button>
      </Space>
    </>
  );
});

export { ColumnSelector, IColumnSelectorRecord };
