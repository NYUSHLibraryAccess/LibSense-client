import * as React from 'react';
import { useEffect, useState } from 'react';
import { IObservableArray, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { Badge, Button, DatePicker, Form, Input, Select, Space, Tag } from 'antd';
import { CheckOutlined, UndoOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ITag } from '@/utils/interfaces';
import { getMetadata } from '@/api/getMetadata';
import { requestWithCatch } from '@/utils/requestWithCatch';
import style from './style.module.less';
import tagStyle from '@/styles/tags.module.less';

type IFilterControllerRecord = { key: string; name: string } & (
  | { type: 'tagSelect'; options: ITag[]; values: ITag[] }
  | { type: 'multiSelect'; options: string[]; values: (string | null)[] }
  | { type: 'input'; values: string }
  | { type: 'dateRange'; values: [string, string] }
);

const dateFormat = 'YYYY-MM-DD';

const FilterController: React.FC<{
  data: IObservableArray<IFilterControllerRecord>;
  effectData: IObservableArray<IFilterControllerRecord>;
  defaultData: IFilterControllerRecord[];
}> = observer(({ data, effectData, defaultData }) => {
  // Metadata states
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  // Load metadata at component creation
  useEffect(() => {
    requestWithCatch(getMetadata()).then((r) => {
      if (r !== undefined) {
        data.forEach((item) => {
          item.type === 'multiSelect' &&
            item.key === 'ipsCode' &&
            (item.options = r.ipsCode.sort((a, b) => (a === null ? 0 : 1) - (b === null ? 0 : 1)));
          item.type === 'multiSelect' &&
            item.key === 'vendors' &&
            (item.options = r.vendors.sort((a, b) => (a === null ? 0 : 1) - (b === null ? 0 : 1)));
          item.type === 'multiSelect' &&
            item.key === 'material' &&
            (item.options = r.material.sort((a, b) => (a === null ? 0 : 1) - (b === null ? 0 : 1)));
          item.type === 'multiSelect' &&
            item.key === 'materialType' &&
            (item.options = r.materialType.sort((a, b) => (a === null ? 0 : 1) - (b === null ? 0 : 1)));
        });
      }
      setIsLoadingMetadata(false);
    });
  }, []);

  return (
    <>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={style.form}>
        {data.map((item, index) => (
          <Form.Item label={item.name} key={index}>
            {item.type === 'tagSelect' && (
              <Select<ITag[]>
                mode="multiple"
                placeholder="Leave blank to select all records."
                showArrow
                allowClear
                options={item.options.map((item) => ({ value: item, label: item }))}
                value={item.values}
                onChange={(value) => {
                  item.values = value;
                }}
                tagRender={(props) => {
                  return (
                    <Tag
                      className={tagStyle[`tag-${props.value}`]}
                      closable
                      onClose={() => {
                        item.values = item.values.filter((value) => value !== props.value);
                      }}
                    >
                      {props.value}
                    </Tag>
                  );
                }}
              />
            )}
            {item.type === 'multiSelect' && (
              <Select<(string | null)[]>
                mode="multiple"
                placeholder="Leave blank to select all records."
                showArrow
                allowClear
                options={item.options.map((item) => ({ value: item, label: item !== null ? item : '(Empty)' }))}
                value={item.values}
                onChange={(value) => {
                  item.values = value;
                }}
              />
            )}
            {item.type === 'input' && (
              <Input
                placeholder="Leave blank to select all records."
                allowClear
                value={item.values}
                onChange={(event) => {
                  item.values = event.target.value;
                }}
              />
            )}
            {item.type === 'dateRange' && (
              <DatePicker.RangePicker
                className={style.dateRangePicker}
                format={dateFormat}
                value={[
                  item.values[0] !== '' ? moment(item.values[0], dateFormat) : null,
                  item.values[1] !== '' ? moment(item.values[1], dateFormat) : null,
                ]}
                onChange={(dates) => {
                  if (dates === null) {
                    item.values = ['', ''];
                    return;
                  }
                  item.values = [dates[0].format(dateFormat), dates[1].format(dateFormat)];
                }}
              />
            )}
          </Form.Item>
        ))}
        <Form.Item wrapperCol={{ span: 24 }}>
          <Space className={style.buttons}>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => {
                runInAction(() => {
                  for (const key in data) {
                    effectData[key].values = data[key].values;
                  }
                });
              }}
            >
              Apply
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={() => {
                runInAction(() => {
                  for (const key in data) {
                    data[key].values = defaultData[key].values;
                    effectData[key].values = defaultData[key].values;
                  }
                });
              }}
            >
              Reset
            </Button>
            {isLoadingMetadata && <Badge status="processing" text="Loading metadata..." />}
          </Space>
        </Form.Item>
      </Form>
    </>
  );
});

export { FilterController, IFilterControllerRecord };
