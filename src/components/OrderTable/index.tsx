import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, message, Space, Table, Typography } from 'antd';
import copy from 'copy-to-clipboard';
import { sortTags, useDidMountEffect, useIsSubscribed, useRequest } from '@/utils';
import { ICdlOrder, IColumn, IDetailedCdlOrder, IDetailedOrder, IFilter, IOrder, ITag } from '@/utils/interfaces';
import { getAllOrders } from '@/api/getAllOrders';
import { ColumnSelector, getColumnName, getDefaultColumns } from '@/components/ColumnSelector';
import { AggregatedFilters, getDefaultFilters } from '@/components/AggregatedFilters';
import { ColoredTag } from '@/components/ColoredTag';
import style from './style.module.less';
import { OrderModal } from '@/components/OrderModal';
import { getDetailedOrder } from '@/api/getDetailedOrder';
import { getAllCdlOrders } from '@/api/getAllCdlOrders';
import { getDetailedCdlOrder } from '@/api/getDetailedCdlOrder';

type IExpandedOrder = { key: number } & (IOrder | ICdlOrder);

const mapPathToIsCdl: Record<string, boolean> = {
  '/': false,
  '/Orders/All': false,
  '/Orders/Rush': false,
  '/Orders/CDL': true,
  '/Orders/NYC': false,
  '/Orders/Local': false,
  '/Orders/DVD': false,
  '/Orders/Course-Reserve': false,
  '/Orders/ILL': false,
  '/Orders/Non-Rush': false,
  '/Orders/Sensitive': false,
};
const mapPathToDefaultTagsToFilter: Record<string, ITag[]> = {
  '/': [],
  '/Orders/All': [],
  '/Orders/Rush': ['Rush'],
  '/Orders/CDL': [],
  '/Orders/NYC': ['NY'],
  '/Orders/Local': ['Local'],
  '/Orders/DVD': ['DVD'],
  '/Orders/Course-Reserve': ['Reserve'],
  '/Orders/ILL': ['ILL'],
  '/Orders/Non-Rush': ['Non-Rush'],
  '/Orders/Sensitive': ['Sensitive'],
};

// TODO: separate into CDL and non-CDL
const OrderTable: React.FC = () => {
  const location = useLocation();
  const [isCdl, setIsCdl] = useState(mapPathToIsCdl[location.pathname]);
  const [defaultTagsToFilter, setDefaultTagsToFilter] = useState(mapPathToDefaultTagsToFilter[location.pathname]);

  const isSubscribed = useIsSubscribed();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(1);
  // Sorter
  const [sorterCol, setSorterCol] = useState<IColumn>('createdDate');
  const [sorterOrder, setSorterOrder] = useState<'ascend' | 'descend'>('descend');
  // Filters
  const [filters, setFilters] = useState<IFilter[]>(getDefaultFilters());
  // Visible columns
  const [columns, setColumns] = useState<IColumn[]>(getDefaultColumns(mapPathToIsCdl[location.pathname]));

  // Table states
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [tableData, setTableData] = useState<IExpandedOrder[]>([]);
  const [requestInfo, setRequestInfo] = useState({ displayCount: 0, totalCount: 0, time: 0 });

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [modalData, setModalData] = useState<IDetailedOrder | IDetailedCdlOrder>();

  // Update `isCdl` and `defaultTagsToFilter` when path changes
  useDidMountEffect(() => {
    setIsCdl(mapPathToIsCdl[location.pathname]);
    setDefaultTagsToFilter(mapPathToDefaultTagsToFilter[location.pathname]);
  }, [location.pathname]);

  // Update table data when filters, sorter, or pagination is changed
  useEffect(() => {
    setIsTableLoading(true);
    const startTime = performance.now();
    useRequest(
      !isCdl
        ? getAllOrders({
            pageIndex: currentPage - 1,
            pageSize,
            sorter: {
              col: sorterCol,
              desc: sorterOrder === 'descend',
            },
            filters,
          })
        : getAllCdlOrders({
            pageIndex: currentPage - 1,
            pageSize,
            sorter: {
              col: sorterCol,
              desc: sorterOrder === 'descend',
            },
            filters,
          })
    ).then((response) => {
      if (!isSubscribed) {
        return;
      }
      if (response !== undefined) {
        // Update request information
        setRequestInfo({
          displayCount: response.result.length,
          totalCount: response.totalRecords,
          time: (performance.now() - startTime) / 1000,
        });
        // Update table data
        setTableData(
          response.result.map((item, index) => ({ ...item, key: (currentPage - 1) * pageSize + index + 1 }))
        );
        // Update the total number of records, avoid 0 because it will hide pagination control
        setTotalRecords(response.totalRecords > 0 ? response.totalRecords : 1);
      }
      setIsTableLoading(false);
    });
  }, [currentPage, pageSize, sorterCol, sorterOrder, filters, isModalVisible]);

  return (
    <>
      {/* Set element id for Popover container */}
      <Card id="orderTableCard">
        <Space className={style.toolbox}>
          <ColumnSelector
            isCdl={isCdl}
            onChange={useCallback((data) => {
              setColumns(data);
            }, [])}
          />
          <AggregatedFilters
            isCdl={isCdl}
            defaultTagsToFilter={defaultTagsToFilter}
            onChange={useCallback((data) => {
              setFilters(data);
              // Set pagination to the first page
              setCurrentPage(1);
            }, [])}
          />
        </Space>
        <Table<IExpandedOrder>
          bordered
          size="small"
          scroll={{ x: 'auto' }}
          pagination={{
            current: currentPage,
            total: totalRecords,
            pageSize,
            pageSizeOptions: ['10', '25', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
            position: ['topRight', 'bottomRight'],
          }}
          loading={{
            spinning: isTableLoading,
            delay: 50,
            tip: 'Loading...',
          }}
          dataSource={tableData}
          onChange={(pagination, filters, sorter: { column: { dataIndex: IColumn }; order: 'ascend' | 'descend' }) => {
            // Filters are managed by external components
            // Update pagination
            setCurrentPage(pagination.current);
            setPageSize(pagination.pageSize);
            // Update sorter
            setSorterCol(sorter.column !== undefined ? sorter.column.dataIndex : 'id');
            setSorterOrder(sorter.order !== undefined ? sorter.order : 'ascend');
          }}
        >
          <Table.Column<IExpandedOrder>
            key="number"
            dataIndex="key"
            title="No."
            ellipsis
            render={(text, record) => <span>{record.key}</span>}
          />
          <Table.Column<IExpandedOrder>
            key="tags"
            dataIndex="tags"
            title="Tags"
            ellipsis
            render={(text, record) => (
              <>
                {sortTags(record.tags).map((tag, index) => (
                  <ColoredTag tag={tag} key={index} />
                ))}
              </>
            )}
          />
          {columns.map((column) => (
            <Table.Column<IExpandedOrder>
              key={column}
              dataIndex={column}
              title={getColumnName(isCdl, column)}
              ellipsis
              sorter
              sortOrder={sorterCol === column ? sorterOrder : null}
              render={(text) =>
                typeof text === 'string' && text.startsWith('http') ? (
                  <a href={text} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                ) : (
                  text
                )
              }
            />
          ))}
          <Table.Column<IExpandedOrder>
            key="actions"
            title="Actions"
            fixed="right"
            render={(text, record) => (
              <Button.Group>
                {isCdl && (
                  <Button
                    type="link"
                    disabled={(record as ICdlOrder).circPdfUrl === null}
                    onClick={() => {
                      // Copy PDF URL to clipboard
                      copy((record as ICdlOrder)?.circPdfUrl);
                      message.success('Copied PDF URL to clipboard!');
                    }}
                  >
                    Copy PDF URL
                  </Button>
                )}
                <Button
                  type="link"
                  onClick={async () => {
                    // Show order detail modal and request data
                    setModalData(undefined);
                    setIsModalLoading(true);
                    setIsModalVisible(true);
                    let r = await useRequest(getDetailedOrder({ orderId: record.id }));
                    if (r !== undefined) {
                      if (!r.tags.includes('CDL')) {
                        // Ordinary order
                        setModalData(r);
                      } else {
                        // CDL order
                        r = await useRequest(getDetailedCdlOrder({ orderId: record.id }));
                        if (r !== undefined) {
                          setModalData(r);
                        }
                      }
                    }
                    setIsModalLoading(false);
                  }}
                >
                  Edit...
                </Button>
              </Button.Group>
            )}
          />
        </Table>
        <Typography.Text type="secondary">
          Query {requestInfo.totalCount.toString()} records in {requestInfo.time.toFixed(3)} seconds (
          {requestInfo.displayCount.toString()} displayed).
        </Typography.Text>
      </Card>
      <OrderModal
        visible={isModalVisible}
        setVisible={setIsModalVisible}
        isLoading={isModalLoading}
        data={modalData}
        setData={setModalData}
        isCdl={isCdl}
        onReload={async () => {
          // Show order detail modal and request data
          setModalData(undefined);
          setIsModalLoading(true);
          setIsModalVisible(true);
          let r = await useRequest(getDetailedOrder({ orderId: modalData.id }));
          if (r !== undefined) {
            if (!r.tags.includes('CDL')) {
              // Ordinary order
              setModalData(r);
            } else {
              // CDL order
              r = await useRequest(getDetailedCdlOrder({ orderId: modalData.id }));
              if (r !== undefined) {
                setModalData(r);
              }
            }
          }
          setIsModalLoading(false);
        }}
      />
    </>
  );
};
export { OrderTable };
