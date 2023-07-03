import React, { useContext, useEffect, useMemo } from 'react';
import { AlertOutlined, ClearOutlined, FlagOutlined } from '@ant-design/icons';
import { Button, message, Pagination, Tooltip } from 'antd';

import { OrderTableContext } from '@/routes/OrderTable';
import { useAppSelector } from '@/store';
import { useMarkAttentionMutation, useMarkCheckMutation } from '@/services/orders';
import { getClassName } from '@/utils/getClassName';

const TableControl: React.FC<{ className?: string; showSelectedRowCount?: boolean; showSummary?: boolean }> = ({
  className,
  showSelectedRowCount = false,
  showSummary = false,
}) => {
  const { role } = useAppSelector((state) => state.auth);
  const {
    selectedRowKeys,
    setSelectedRowKeys,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    allOrders,
    refetchAllOrders,
    allOrdersStartedTimeStamp,
    allOrdersFulfilledTimeStamp,
  } = useContext(OrderTableContext);

  const [markCheck, { isSuccess: isMarkCheckSuccess, isError: isMarkCheckError }] = useMarkCheckMutation();
  const [markAttention, { isSuccess: isMarkAttentionSuccess, isError: isMarkAttentionError }] =
    useMarkAttentionMutation();

  const btnDisabled = useMemo(() => selectedRowKeys.length === 0, [selectedRowKeys]);

  // Reset row selection and re-fetch list data on success
  useEffect(() => {
    if (isMarkCheckSuccess) {
      message.success('Updated marks.');
      setSelectedRowKeys([]);
      refetchAllOrders();
    }
  }, [isMarkCheckSuccess]);
  useEffect(() => {
    if (isMarkAttentionSuccess) {
      message.success('Updated marks.');
      setSelectedRowKeys([]);
      refetchAllOrders();
    }
  }, [isMarkAttentionSuccess]);

  // Show message on error
  useEffect(() => {
    if (isMarkCheckError) {
      message.error('Failed to update marks.');
    }
  }, [isMarkCheckError]);
  useEffect(() => {
    if (isMarkAttentionError) {
      message.error('Failed to update marks.');
    }
  }, [isMarkAttentionError]);

  return (
    <div className={getClassName('flex items-center gap-2', className)}>
      <Tooltip title={!btnDisabled && 'Mark as Attention-Required'} mouseEnterDelay={0.5}>
        <Button
          icon={<AlertOutlined />}
          className="flex-none"
          disabled={btnDisabled}
          onClick={() => {
            markAttention({
              id: selectedRowKeys,
              attention: true,
            });
          }}
        />
      </Tooltip>
      <Tooltip title={!btnDisabled && 'Remove Attention-Required Marks'} mouseEnterDelay={0.5}>
        <Button
          icon={<ClearOutlined />}
          className="flex-none"
          disabled={btnDisabled}
          onClick={() => {
            markAttention({
              id: selectedRowKeys,
              attention: false,
            });
          }}
        />
      </Tooltip>
      {role === 'System Admin' && (
        <>
          <div className="flex-none w-px h-8 mx-1 bg-gray-300" />
          <Tooltip title={!btnDisabled && 'Mark as Tracked'} mouseEnterDelay={0.5}>
            <Button
              icon={<FlagOutlined />}
              className="flex-none"
              disabled={btnDisabled}
              onClick={() => {
                markCheck({
                  id: selectedRowKeys,
                  checked: true,
                });
              }}
            />
          </Tooltip>
          <Tooltip title={!btnDisabled && 'Remove Tracked Marks'} mouseEnterDelay={0.5}>
            <Button
              icon={<ClearOutlined />}
              className="flex-none"
              disabled={btnDisabled}
              onClick={() => {
                markCheck({
                  id: selectedRowKeys,
                  checked: false,
                });
              }}
            />
          </Tooltip>
        </>
      )}
      {showSelectedRowCount && (
        <>
          <div
            className={getClassName(
              'flex-none w-px h-8 mx-1 bg-gray-300 transition-opacity',
              selectedRowKeys.length === 0 && 'opacity-0'
            )}
          />
          <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <span
              className={getClassName(
                'text-xs text-gray-400 transition-opacity',
                selectedRowKeys.length === 0 && 'opacity-0'
              )}
            >
              {selectedRowKeys.length > 0 && `${selectedRowKeys.length} records selected`}
            </span>
          </div>
        </>
      )}
      {showSummary && (
        <>
          <div className="flex-none w-px h-8 mx-1 bg-gray-300" />
          <div className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
            <span className="text-xs text-gray-400">
              Queried {allOrders?.totalRecords || '-'} records in{' '}
              {allOrdersStartedTimeStamp && allOrdersFulfilledTimeStamp
                ? ((allOrdersFulfilledTimeStamp - allOrdersStartedTimeStamp) / 1000).toFixed(4)
                : '-'}{' '}
              seconds ({allOrders?.result.length || '-'} records displayed).
            </span>
          </div>
        </>
      )}
      <Pagination
        size="small"
        current={pageIndex + 1}
        total={allOrders?.totalRecords}
        pageSize={pageSize}
        pageSizeOptions={['15', '30', '50', '100']}
        showSizeChanger={true}
        showQuickJumper={true}
        onChange={(current, pageSize) => {
          setPageIndex(current - 1);
          setPageSize(pageSize);
        }}
        className="flex-none"
      />
    </div>
  );
};

export { TableControl };
