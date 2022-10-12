import React from 'react';
import { Outlet } from 'react-router-dom';
import { Table } from 'antd';

import { ColumnPanel } from '@/components/ColumnPanel';
import { FilterPanel } from '@/components/FilterPanel';
import { FuzzySearch } from '@/components/FuzzySearch';
import { PresetControl } from '@/components/PresetControl';
import { StyledCard } from '@/components/StyledCard';
import { TableControl } from '@/components/TableControl';
import { TablePanel } from '@/components/TablePanel';
import { getClassName } from '@/utils/getClassName';
import { useOrderTable } from '@/hooks/useOrderTable';
import { CdlOrder } from '@/types/CdlOrder';
import { GeneralOrder } from '@/types/GeneralOrder';
import style from './index.module.less';

const OrderTableContext = React.createContext<ReturnType<typeof useOrderTable>>(null);

const OrderTable: React.FC = () => {
  const orderTable = useOrderTable();
  const {
    uiSize,
    highlightAttentionMark,
    selectedRowKeys,
    setSelectedRowKeys,
    setSortColumn,
    setSortDescend,
    allOrders,
    isAllOrdersFetching,
    columns,
  } = orderTable;

  return (
    <OrderTableContext.Provider value={orderTable}>
      <div className="min-h-screen p-10 pt-0 overflow-auto bg-gray-100">
        <div className="my-8 text-xl font-bold select-none">Manage Orders</div>
        <div className="grid gap-6 grid-cols-1">
          <StyledCard>
            <div className="flex justify-between">
              <PresetControl />
              <FuzzySearch className="w-80" />
            </div>
          </StyledCard>
          <StyledCard>
            <div className="mb-4 flex gap-2">
              <FilterPanel />
              <div className="flex-none w-px h-8 mx-2 bg-gray-300" />
              <ColumnPanel />
              <TablePanel />
            </div>
            <TableControl className="mb-4" showSelectedRowCount />
            <Table<GeneralOrder | CdlOrder>
              dataSource={allOrders?.result}
              // Use the order id as the row key
              rowKey={(record) => record.id}
              rowClassName={(record, index) =>
                getClassName(
                  index % 2 !== 0 && style.oddIndexRow,
                  highlightAttentionMark && record.attention && style.attentionRow
                )
              }
              // Since row key is the order id, it must be a number.
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys as (keys: React.Key[]) => void,
              }}
              pagination={false}
              columns={columns}
              size={uiSize}
              bordered
              scroll={{ x: 'auto' }}
              loading={{
                spinning: isAllOrdersFetching,
                tip: 'Loading...',
              }}
              onChange={(pagination, filters, sorter) => {
                if (!Array.isArray(sorter) && sorter.order) {
                  // dataIndex must be a key of GeneralOrder or a key of CdlOrder
                  setSortColumn(sorter.column.dataIndex as keyof (GeneralOrder & CdlOrder));
                  setSortDescend(sorter.order === 'descend');
                } else {
                  setSortColumn('id');
                  setSortDescend(false);
                }
              }}
              className={getClassName(style.table, uiSize === 'small' && style.shrinkHeader)}
            />
            <TableControl className="mt-4" showSummary />
          </StyledCard>
        </div>
      </div>
      <Outlet />
    </OrderTableContext.Provider>
  );
};

export { OrderTable, OrderTableContext };
