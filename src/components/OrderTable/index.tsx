import * as React from 'react';
import { useEffect, useState } from 'react';
import { autorun, observable, computed } from 'mobx';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Card, Form, Input, Modal, Popover, Space, Table, Tag, message } from 'antd';
import { EyeOutlined, FilterOutlined, MailOutlined } from '@ant-design/icons';
import { IOrder } from '@/utils/interfaces';
import { allTags } from '@/utils/constants';
import { getAllOrders, IFilter } from '@/api/getAllOrders';
import { exportToEmail } from '@/api/exportToEmail';
import { requestWithCatch } from '@/utils/requestWithCatch';
import { FilterController, IFilterControllerRecord } from '@/components/FilterController';
import { ColumnSelector, IColumnSelectorRecord } from '@/components/ColumnSelector';
import style from './style.module.less';
import tagStyle from '@/styles/tags.module.less';

type IOrderWithKey = { key: number } & IOrder;

const filterControllerDefaultData: IFilterControllerRecord[] = [
  { key: 'tags', name: 'Tags', type: 'tagSelect', options: allTags, values: [] },
  { key: 'barcode', name: 'Barcode', type: 'input', values: '' },
  { key: 'title', name: 'Title', type: 'input', values: '' },
  { key: 'orderNumber', name: 'Order Number', type: 'input', values: '' },
  { key: 'createdDate', name: 'Created Date', type: 'dateRange', values: ['', ''] },
  { key: 'arrivalDate', name: 'Arrival Date', type: 'dateRange', values: ['', ''] },
  { key: 'ipsCode', name: 'IPS Code', type: 'multiSelect', options: [], values: [] },
  { key: 'ipsDate', name: 'IPS Date', type: 'dateRange', values: ['', ''] },
  { key: 'vendorCode', name: 'Vendor Code', type: 'multiSelect', options: [], values: [] },
  { key: 'material', name: 'Material', type: 'multiSelect', options: [], values: [] },
  { key: 'materialType', name: 'Material Type', type: 'multiSelect', options: [], values: [] },
  { key: 'libraryNote', name: 'Library Note', type: 'input', values: '' },
];

const columnSelectorDefaultData: IColumnSelectorRecord[] = [
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

const ExportToEmailModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [tags] = useState(['Rush-Local']);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <>
      <Button
        type="link"
        icon={<MailOutlined />}
        onClick={() => {
          setVisible(true);
        }}
      >
        Export to E-Mail
      </Button>
      <Modal
        visible={visible}
        closeIcon={<></>}
        confirmLoading={confirming}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          if (tags.length === 0 || username === '' || email === '') {
            message.error('Please enter all information.');
          }
          setConfirming(true);
          requestWithCatch(
            exportToEmail({
              report_types: tags,
              username,
              email,
            })
          ).then((r) => {
            if (r !== undefined) {
              message.success(`Successfully exported: ${r}`);
            } else {
              message.error(`Failed to export: ${r}`);
            }
            setConfirming(false);
            setVisible(false);
          });
        }}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {/*<Form.Item label="Tags">*/}
          {/*  <Select<ITag[]>*/}
          {/*    mode="multiple"*/}
          {/*    showArrow*/}
          {/*    allowClear*/}
          {/*    options={allTags.map((tag) => ({ value: tag, label: tag }))}*/}
          {/*    value={tags}*/}
          {/*    onChange={(value) => {*/}
          {/*      setTags(value);*/}
          {/*    }}*/}
          {/*    tagRender={(props) => {*/}
          {/*      return (*/}
          {/*        <Tag*/}
          {/*          className={tagStyle[`tag-${props.value}`]}*/}
          {/*          closable*/}
          {/*          onClose={() => {*/}
          {/*            setTags(tags.filter((value) => value !== props.value));*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          {props.value}*/}
          {/*        </Tag>*/}
          {/*      );*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          <Form.Item label="Username">
            <Input
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const OrderTable: React.FC<RouteComponentProps> = observer(({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<IOrderWithKey[]>([]);

  // Filter controller states
  const [filterControllerData] = useState(observable(filterControllerDefaultData));
  const [filterControllerEffectData] = useState(observable(filterControllerDefaultData));
  const [filters] = useState(
    computed(() =>
      filterControllerEffectData.reduce<IFilter[]>((prev, item) => {
        if (item.type === 'tagSelect' && item.values.length > 0) {
          return prev.concat({
            col: 'tags',
            op: 'in',
            val: item.values,
          });
        }
        if (item.type === 'multiSelect' && item.values.length > 0) {
          return prev.concat({
            col: item.key,
            op: 'in',
            val: item.values,
          });
        }
        if (item.type === 'input' && item.values !== '') {
          return prev.concat({
            col: item.key,
            op: 'like',
            val: item.values,
          });
        }
        if (item.type === 'dateRange' && item.values[0] !== '' && item.values[1] !== '') {
          return prev.concat({
            col: item.key,
            op: 'between',
            val: item.values,
          });
        }
        return prev;
      }, [])
    )
  );

  // Sorter states
  const [sorterData] = useState(
    observable<{
      key: string;
      order: 'ascend' | 'descend';
    }>({
      key: 'createdDate',
      order: 'descend',
    })
  );

  // Column selector states
  const [columnSelectorData] = useState(observable(columnSelectorDefaultData));

  // Page selector states
  const [paginationData] = useState(
    observable({
      currentPage: 1,
      totalRecords: 50,
      pageSize: 10,
    })
  );

  // Update dataSource on currentPage and pageSize change
  useEffect(() => {
    let isSubscribed = true;
    const disposer = autorun(() => {
      setIsLoading(true);
      requestWithCatch(
        getAllOrders({
          pageIndex: paginationData.currentPage - 1,
          pageSize: paginationData.pageSize,
          filters: filters.get(),
          sorter: {
            col: sorterData.key,
            desc: sorterData.order === 'descend',
          },
        })
      ).then((r) => {
        if (!isSubscribed) {
          return;
        }
        if (r !== undefined) {
          setDataSource(
            r.result.map((item) => ({
              key: item.id,
              ...item,
            }))
          );
          paginationData.totalRecords = r.totalRecords;
        }
        setIsLoading(false);
      });
    });
    return () => {
      isSubscribed = false;
      disposer();
    };
  }, []);

  return (
    <Card id="orderTableCard">
      <Space className={style.toolbox}>
        <Popover
          trigger="click"
          placement="bottomRight"
          getPopupContainer={() => document.getElementById('orderTableCard')}
          overlayClassName={style.overlay}
          title="Filter Orders"
          content={
            <FilterController
              data={filterControllerData}
              effectData={filterControllerEffectData}
              defaultData={filterControllerDefaultData}
            />
          }
          onVisibleChange={(visible) => {
            if (!visible) {
              for (const key in filterControllerData) {
                filterControllerData[key].values = filterControllerEffectData[key].values;
              }
            }
          }}
        >
          <Button
            type={filters.get().length > 0 ? 'primary' : 'default'}
            shape="round"
            size="small"
            icon={<FilterOutlined />}
          >
            Change Filters...
          </Button>
        </Popover>
        <Popover
          trigger="click"
          placement="bottomRight"
          getPopupContainer={() => document.getElementById('orderTableCard')}
          overlayClassName={style.overlay}
          content={<ColumnSelector data={columnSelectorData} defaultData={columnSelectorDefaultData} />}
        >
          <Button shape="round" size="small" icon={<EyeOutlined />}>
            Change Columns...
          </Button>
        </Popover>
        <ExportToEmailModal />
      </Space>
      <Table<IOrderWithKey>
        bordered
        size="small"
        scroll={{ x: 'auto' }}
        pagination={{
          current: paginationData.currentPage,
          total: paginationData.totalRecords,
          pageSize: paginationData.pageSize,
          pageSizeOptions: ['10', '25', '50', '100'],
          onChange: (current, size) => {
            paginationData.currentPage = current;
            paginationData.pageSize = size;
          },
          showSizeChanger: true,
          showQuickJumper: true,
          position: ['topRight', 'bottomRight'],
        }}
        loading={{
          spinning: isLoading,
          delay: 100,
          tip: 'Loading...',
        }}
        dataSource={dataSource}
        onChange={(
          pagination,
          filters,
          sorter: { column: { dataIndex: string } | undefined; order: 'ascend' | 'descend' | undefined }
        ) => {
          sorterData.key = sorter.order !== undefined ? sorter.column.dataIndex : 'id';
          sorterData.order = sorter.order !== undefined ? sorter.order : 'ascend';
        }}
      >
        <Table.Column<IOrderWithKey>
          key="tags"
          dataIndex="tags"
          title="Tags"
          ellipsis
          render={(text, record) => (
            <>
              {record.tags
                .sort((a, b) => allTags.findIndex((value) => value === a) - allTags.findIndex((value) => value === b))
                .map((tag, index) => (
                  <Tag className={tagStyle[`tag-${tag}`]} key={index}>
                    {tag}
                  </Tag>
                ))}
            </>
          )}
        />
        {columnSelectorData
          .filter((item) => item.checked)
          .map((item) => (
            <Table.Column<IOrderWithKey>
              key={item.key}
              dataIndex={item.key}
              title={item.name}
              ellipsis
              sorter
              sortOrder={sorterData.key === item.key ? sorterData.order : undefined}
            />
          ))}
        <Table.Column<IOrderWithKey>
          key="actions"
          title="Actions"
          fixed="right"
          render={(text, record) => (
            <Button.Group>
              <Button
                type="link"
                onClick={() => {
                  history.push(`/Orders/Detail/${record.id}`);
                }}
              >
                Edit...
              </Button>
            </Button.Group>
          )}
        />
      </Table>
    </Card>
  );
});

export { OrderTable };
