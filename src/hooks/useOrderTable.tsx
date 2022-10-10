import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { message, TableProps, Tag, Tooltip } from 'antd';
import { ColumnType } from 'antd/es/table';
import jsConvert from 'js-convert-case';

import { CopyAction } from '@/components/CopyAction';
import { GeneralAction } from '@/components/GeneralAction';
import { useAllOrdersQuery } from '@/services/orders';
import { getClassName } from '@/utils/getClassName';
import { defaultColumnOptions } from '@/constants/defaultColumnOptions';
import { defaultFilterOptions } from '@/constants/defaultFilterOptions';
import { orderTagColors } from '@/constants/orderTagColors';
import { CdlOrder } from '@/types/CdlOrder';
import { ColumnOption } from '@/types/ColumnOption';
import { FilterArgs } from '@/types/FilterArgs';
import { FilterOption } from '@/types/FilterOption';
import { GeneralOrder } from '@/types/GeneralOrder';
import { TablePreset } from '@/types/TablePreset';
import { ViewArgs } from '@/types/ViewArgs';

const useOrderTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // UI size
  const [uiSize, setUiSize] = useState<TableProps<GeneralOrder | CdlOrder>['size']>('small');
  // Highlight check mark
  const [highlightCheckMark, setHighlightCheckMark] = useState(false);
  // Highlight attention mark
  const [highlightAttentionMark, setHighlightAttentionMark] = useState(true);

  // Row selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // Pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // Sorter
  const [sortColumn, setSortColumn] = useState<keyof (GeneralOrder & CdlOrder)>('id');
  const [sortDescend, setSortDescend] = useState(false);

  // Current preset
  const [currentPreset, setCurrentPreset] = useState<TablePreset>();

  // Preset views
  const presetViews = useMemo(() => currentPreset?.views || {}, [currentPreset]);
  // Views
  const [views, setViews] = useState<ViewArgs>({});
  const resetViews = useCallback(() => {
    setViews(presetViews);
  }, [presetViews]);

  // Preset filter options
  const presetFilterOptions = useMemo(
    () =>
      defaultFilterOptions.map(
        ({ op, col, val, ...params }) =>
          // It must be a valid FilterOption
          ({
            ...params,
            op,
            col,
            val: currentPreset?.filters?.find((filter) => filter.op === op && filter.col === col)?.val ?? val,
          } as FilterOption)
      ),
    [currentPreset]
  );
  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>(defaultFilterOptions);
  // Function to reset filter options
  const resetFilterOptions = useCallback(() => {
    setFilterOptions(presetFilterOptions);
  }, [presetFilterOptions]);
  // Get filters from filter options
  const filters = useMemo<FilterArgs[]>(
    () =>
      filterOptions
        // Do not include CDL-related items if CDL columns are invisible
        .filter(({ cdlOnly }) => !cdlOnly || views.cdlView)
        .filter(
          (filterOption) =>
            (filterOption.op === 'in' && filterOption.val.length > 0) ||
            (filterOption.op === 'between' && filterOption.val[0] && filterOption.val[1]) ||
            (filterOption.op === 'like' && filterOption.val)
        )
        // It must be a valid FilterArgs
        .map(({ op, col, val }) => ({ op, col, val } as FilterArgs)),
    [filterOptions, views]
  );

  // Function to apply preset
  const applyPreset = useCallback(() => {
    // Update filter options
    resetFilterOptions();
    // Reset views
    resetViews();
  }, [resetFilterOptions, resetViews]);

  // All orders data
  const {
    data: allOrders,
    refetch: refetchAllOrders,
    isFetching: isAllOrdersFetching,
    isError: isAllOrdersError,
    startedTimeStamp: allOrdersStartedTimeStamp,
    fulfilledTimeStamp: allOrdersFulfilledTimeStamp,
  } = useAllOrdersQuery(
    {
      pageIndex,
      pageSize,
      sorter: {
        col: sortColumn,
        desc: sortDescend,
      },
      filters,
      fuzzy: searchParams.get('search') ?? '',
      views,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Column options
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>(defaultColumnOptions);
  // Function to reset column options
  const resetColumnOptions = useCallback(() => {
    setColumnOptions(defaultColumnOptions);
  }, []);
  // Get columns from column options
  const columns = useMemo<ColumnType<GeneralOrder | CdlOrder>[]>(
    () => [
      // Number column
      {
        key: 'number',
        title: '#',
        fixed: 'left',
        render: (value, record, index) => <div className="w-12">{pageIndex * pageSize + index + 1}</div>,
      },
      // Tag column
      {
        key: 'tags',
        title: 'Tags',
        render: (value, record) => (
          <div className="w-44 flex flex-wrap gap-1">
            {record.tags.map((tag, index) => (
              <Tag
                key={index}
                className={getClassName(
                  'select-none cursor-pointer mr-0 px-1',
                  orderTagColors[tag] || orderTagColors.default
                )}
                onClick={() => {
                  setFilterOptions((prevState) =>
                    prevState.map(
                      (option) =>
                        // It must be a valid FilterOption
                        ({
                          ...option,
                          val:
                            option.op === 'in' && option.col === 'tags' && !option.val.includes(tag)
                              ? [...option.val, tag]
                              : option.val,
                        } as FilterOption)
                    )
                  );
                }}
              >
                {tag}
              </Tag>
            ))}
          </div>
        ),
      },
      ...columnOptions
        // Do not include CDL-related items if CDL columns are invisible
        .filter(({ cdlOnly }) => !cdlOnly || views.cdlView)
        .filter(({ visible }) => visible)
        .map<ColumnType<GeneralOrder | CdlOrder>>((option) => ({
          dataIndex: option.dataIndex,
          // By default, get title by converting dataIndex to header case.
          title: option.title || jsConvert.toHeaderCase(option.dataIndex),
          // By default, render data with text ellipsis and tooltip.
          render:
            option.render ||
            ((value) => (
              <Tooltip title={value} mouseEnterDelay={0.5}>
                <div className={getClassName('whitespace-nowrap overflow-hidden text-ellipsis', option.widthCls)}>
                  {value ?? '-'}
                </div>
              </Tooltip>
            )),
          sorter: option.sortable,
          sortOrder: sortColumn === option.dataIndex ? (sortDescend ? 'descend' : 'ascend') : null,
        })),
      // Action column
      {
        key: 'actions',
        title: 'Actions',
        fixed: 'right',
        render: (value, record) => (
          // Assume the type of record is the union of GeneralOrder and CdlOrder
          <div className="flex gap-2 text-xs">
            {views.cdlView && (
              <CopyAction contentToCopy={(record as GeneralOrder & CdlOrder).circPdfUrl}>Copy PDF URL</CopyAction>
            )}
            <GeneralAction
              onClick={() => {
                searchParams.set('detail', (record as GeneralOrder & CdlOrder).id.toString());
                searchParams.set('cdl', record.tags.includes('CDL').toString());
                setSearchParams(searchParams);
              }}
            >
              Edit...
            </GeneralAction>
          </div>
        ),
      },
    ],
    [columnOptions, pageIndex, pageSize, views, sortColumn, sortDescend, searchParams]
  );

  // Load preset on applyPreset changes
  useEffect(() => {
    // Update row selection to default
    setSelectedRowKeys([]);
    // Apply preset
    applyPreset();
  }, [applyPreset]);

  // Reset page index on sorter, filters, extra filters, and fuzzy search changes
  useEffect(() => {
    setPageIndex(0);
  }, [sortColumn, sortDescend, filters, views, searchParams]);

  // Reset row selection on page index changes
  useEffect(() => {
    setSelectedRowKeys([]);
  }, [pageIndex]);

  // Show message on error
  useEffect(() => {
    if (isAllOrdersError) {
      message.error('Failed to fetch orders from server.');
    }
  }, [isAllOrdersError]);

  return {
    uiSize,
    setUiSize,
    highlightCheckMark,
    setHighlightCheckMark,
    highlightAttentionMark,
    setHighlightAttentionMark,
    selectedRowKeys,
    setSelectedRowKeys,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    sortColumn,
    setSortColumn,
    sortDescend,
    setSortDescend,
    currentPreset,
    setCurrentPreset,
    views,
    setViews,
    resetViews,
    filterOptions,
    setFilterOptions,
    resetFilterOptions,
    filters,
    applyPreset,
    allOrders,
    refetchAllOrders,
    isAllOrdersFetching,
    allOrdersStartedTimeStamp,
    allOrdersFulfilledTimeStamp,
    columnOptions,
    setColumnOptions,
    resetColumnOptions,
    columns,
  };
};

export { useOrderTable };
