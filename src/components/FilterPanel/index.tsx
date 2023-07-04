import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FilterOutlined, UndoOutlined } from '@ant-design/icons';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Badge, Button, DatePicker, Form, Input, Select, Switch, Tag, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import jsConvert from 'js-convert-case';
import Scrollbars from 'react-custom-scrollbars';

import { StyledModal } from '@/components/StyledModal';
import { OrderTableContext } from '@/routes/OrderTable';
import { useMetaDataQuery } from '@/services/data';
import { arrayRemove } from '@/utils/arrayRemove';
import { getClassName } from '@/utils/getClassName';
import { useOrderTable } from '@/hooks/useOrderTable';
import { orderTagColors } from '@/constants/orderTagColors';
import { FilterOption } from '@/types/FilterOption';
import { MetaData } from '@/types/MetaData';
import { OrderTag } from '@/types/OrderTag';

const FilterPanelContext = React.createContext<{
  cachedFilterOptions: ReturnType<typeof useOrderTable>['filterOptions'];
  setCachedFilterOptions: ReturnType<typeof useOrderTable>['setFilterOptions'];
}>(null);

const SelectWidget: React.FC<Required<Pick<FilterOption, 'metaDataIndex' | 'col'>>> = ({ metaDataIndex, col }) => {
  const { cachedFilterOptions, setCachedFilterOptions } = useContext(FilterPanelContext);

  const { data } = useMetaDataQuery();

  const widgetValue = useMemo(
    () => cachedFilterOptions.find((option) => option.op === 'in' && option.col === col)?.val as string[],
    [cachedFilterOptions]
  );
  const widgetOptions = useMemo(
    () =>
      (data?.[metaDataIndex || (col as keyof Omit<MetaData, 'oldestDate'>)] as string[])?.map((value) => ({
        label: value ?? 'N/A',
        value,
      })),
    [data]
  );

  const handleSelectChange = useCallback((values: string[]) => {
    setCachedFilterOptions((prevState) =>
      prevState.map(
        (option) =>
          // It must be a valid FilterOption
          ({
            ...option,
            val: option.op === 'in' && option.col === col ? values : option.val,
          } as FilterOption)
      )
    );
  }, []);
  const handleTagClose = useCallback((value: string) => {
    setCachedFilterOptions((prevState) =>
      prevState.map(
        (option) =>
          // It must be a valid FilterOption
          ({
            ...option,
            val: option.op === 'in' && option.col === col ? arrayRemove(option.val, value) : option.val,
          } as FilterOption)
      )
    );
  }, []);

  return (
    <Select
      mode="multiple"
      placeholder="Leave blank to select all orders."
      showArrow
      allowClear
      value={widgetValue}
      options={widgetOptions}
      onChange={handleSelectChange}
      tagRender={({ label, value }) => (
        <Tag
          className={getClassName(
            'mr-1',
            col === 'tags' && (orderTagColors[value as OrderTag] || orderTagColors.default)
          )}
          closable
          onClose={() => handleTagClose(value)}
        >
          {label}
        </Tag>
      )}
    />
  );
};

const DateRangeWidget: React.FC<Pick<FilterOption, 'col'>> = ({ col }) => {
  const { cachedFilterOptions, setCachedFilterOptions } = useContext(FilterPanelContext);

  const widgetValue = useMemo(
    () => cachedFilterOptions.find((option) => option.op === 'between' && option.col === col)?.val,
    [cachedFilterOptions]
  );

  const handleChange = useCallback((dates: [Dayjs, Dayjs], dateStrings: [string, string]) => {
    setCachedFilterOptions((prevState) =>
      prevState.map(
        (option) =>
          // It must be a valid FilterOption
          ({
            ...option,
            val: option.op === 'between' && option.col === col ? dateStrings : option.val,
          } as FilterOption)
      )
    );
  }, []);

  return (
    <DatePicker.RangePicker
      className="w-full"
      value={[widgetValue[0] ? dayjs(widgetValue[0]) : null, widgetValue[1] ? dayjs(widgetValue[1]) : null]}
      onChange={handleChange}
    />
  );
};

const InputWidget: React.FC<Pick<FilterOption, 'col'>> = ({ col }) => {
  const { cachedFilterOptions, setCachedFilterOptions } = useContext(FilterPanelContext);

  const widgetValue = useMemo(
    () => cachedFilterOptions.find((option) => option.op === 'like' && option.col === col)?.val,
    [cachedFilterOptions]
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCachedFilterOptions((prevState) =>
      prevState.map(
        (option) =>
          // It must be a valid FilterOption
          ({
            ...option,
            val: option.op === 'like' && option.col === col ? event.target.value : option.val,
          } as FilterOption)
      )
    );
  }, []);

  return (
    <Input placeholder="Leave blank to select all orders." allowClear value={widgetValue} onChange={handleChange} />
  );
};

const FilterPanel: React.FC = () => {
  const { views, setViews, resetViews, filterOptions, setFilterOptions, resetFilterOptions, filters } =
    useContext(OrderTableContext);

  const [visible, setVisible] = useState(false);
  const [cachedFilterOptions, setCachedFilterOptions] = useState<typeof filterOptions>([]);
  const [cachedViews, setCachedViews] = useState<typeof views>({});

  // Update cached values when modal gets visible
  useEffect(() => {
    if (visible) {
      setCachedFilterOptions(filterOptions);
      setCachedViews(views);
    }
  }, [visible, filterOptions, views]);

  const contextValue = useMemo(
    () => ({
      cachedFilterOptions,
      setCachedFilterOptions,
    }),
    [cachedFilterOptions]
  );
  const badgeCount = useMemo(
    () =>
      filters.length +
      Object.entries(views)
        .map(([, value]) => Number(!!value))
        .reduce((prev, cur) => prev + cur, 0),
    [filters, views]
  );

  const handleModalShow = useCallback(() => {
    setVisible(true);
  }, []);
  const handleModalReset = useCallback(() => {
    // Reset to default
    resetFilterOptions();
    resetViews();
    setVisible(false);
  }, [resetFilterOptions, resetViews]);
  const handleModalCancel = useCallback(() => {
    setVisible(false);
  }, []);
  const handleModalSubmit = useCallback(() => {
    // Submit cached values
    setFilterOptions(cachedFilterOptions);
    setViews(cachedViews);
    setVisible(false);
  }, [cachedFilterOptions, cachedViews]);

  return (
    <FilterPanelContext.Provider value={contextValue}>
      <Badge count={badgeCount} color="#7c3aed">
        <Button icon={<FilterOutlined />} onClick={handleModalShow}>
          Filters / Views...
        </Button>
      </Badge>
      <StyledModal
        title="Edit Filters / Views"
        open={visible}
        footer={
          <>
            <Button icon={<UndoOutlined />} onClick={handleModalReset} className="float-left">
              Reset to Preset Default
            </Button>
            <Button onClick={handleModalCancel}>Cancel</Button>
            <Button type="primary" onClick={handleModalSubmit}>
              OK
            </Button>
          </>
        }
        width={650}
        bodyStyle={{
          padding: 0,
        }}
        onCancel={handleModalCancel}
      >
        <Scrollbars style={{ height: 'calc(100vh - 308px)' }}>
          <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} className="px-8 py-6">
            <div className="grid grid-cols-1 gap-y-3 mb-6">
              {cachedFilterOptions
                // Do not render CDL-related items if CDL columns are invisible
                .filter(({ cdlOnly }) => !cdlOnly || cachedViews.cdlView)
                .map(({ title, metaDataIndex, op, col }, index) => (
                  <Form.Item key={index} label={title || jsConvert.toHeaderCase(col)} className="mb-0">
                    {op === 'in' && <SelectWidget metaDataIndex={metaDataIndex} col={col} />}
                    {op === 'between' && <DateRangeWidget col={col} />}
                    {op === 'like' && <InputWidget col={col} />}
                  </Form.Item>
                ))}
              {!cachedViews.cdlView && (
                <Form.Item wrapperCol={{ offset: 10 }} className="mb-0">
                  <span className="text-gray-400 select-none">
                    <Tooltip
                      title={
                        <span className="font-light">
                          To use filter options for CDL Orders, enable{' '}
                          <span className="font-bold">View CDL Orders</span> option.
                        </span>
                      }
                    >
                      <QuestionCircleOutlined className="mr-1 cursor-help" />
                    </Tooltip>
                    No filter options for CDL Orders?
                  </span>
                </Form.Item>
              )}
            </div>
            <div className="w-full h-px bg-gray-200 mb-6" />
            <Form.Item label="View CDL Orders" className="mb-2">
              <Switch
                checked={cachedViews.cdlView}
                onChange={(checked) => {
                  setCachedViews((prevState) => ({
                    ...prevState,
                    cdlView: checked,
                  }));
                }}
              />
            </Form.Item>
            <Form.Item label="View Pending Rush-Local Orders" className="mb-2">
              <Switch
                checked={cachedViews.pendingRushLocal}
                onChange={(checked) => {
                  setCachedViews((prevState) => ({
                    ...prevState,
                    pendingRushLocal: checked,
                  }));
                }}
              />
            </Form.Item>
            <Form.Item label="View Pending CDL Orders" className="mb-2">
              <Switch
                checked={cachedViews.pendingCdl}
                onChange={(checked) => {
                  setCachedViews((prevState) => ({
                    ...prevState,
                    pendingCdl: checked,
                  }));
                }}
              />
            </Form.Item>
            <Form.Item label="View Prioritize Orders" className="mb-0">
              <Switch
                checked={cachedViews.prioritize}
                onChange={(checked) => {
                  setCachedViews((prevState) => ({
                    ...prevState,
                    prioritize: checked,
                  }));
                }}
              />
            </Form.Item>
          </Form>
        </Scrollbars>
      </StyledModal>
    </FilterPanelContext.Provider>
  );
};

export { FilterPanel };
