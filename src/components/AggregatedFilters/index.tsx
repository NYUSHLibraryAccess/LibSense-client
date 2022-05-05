import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { observable, runInAction, computed, toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  InputProps,
  Popover,
  Select,
  SelectProps,
  Space,
  Typography,
} from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { CheckOutlined, FilterOutlined, UndoOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { assign, isEqual } from 'lodash';
import { useDidMountEffect, useReaction } from '@/utils';
import { IRootState, IAppDispatch } from '@/utils/store';
import { IFilter, ITag, IMetadata } from '@/utils/interfaces';
import { fetchMetadata } from '@/slices/metadata';
import { ColoredTag } from '@/components/ColoredTag';
import style from './style.module.less';

type IAggregatedFiltersData = {
  tagsToFilter: ITag[];
  ipsCodesToFilter: string[];
  vendorCodeToFilter: string[];
  materialToFilter: string[];
  materialTypeToFilter: string[];
  cdlItemStatusToFilter: string[];
  createdDateRange: [string, string];
  arrivalDateRange: [string, string];
  ipsDateRange: [string, string];
  orderRequestDateRange: [string, string];
  scanningVendorPaymentDateRange: [string, string];
  pdfDeliveryDateRange: [string, string];
  backToKarmsDateRange: [string, string];
  barcodeKeyword: string;
  titleKeyword: string;
  orderNumberKeyword: string;
  libraryNoteKeyword: string;
};

// Default component data
const defaultData: IAggregatedFiltersData = {
  tagsToFilter: [],
  ipsCodesToFilter: [],
  vendorCodeToFilter: [],
  materialToFilter: [],
  materialTypeToFilter: [],
  cdlItemStatusToFilter: [],
  createdDateRange: ['', ''],
  arrivalDateRange: ['', ''],
  ipsDateRange: ['', ''],
  orderRequestDateRange: ['', ''],
  scanningVendorPaymentDateRange: ['', ''],
  pdfDeliveryDateRange: ['', ''],
  backToKarmsDateRange: ['', ''],
  barcodeKeyword: '',
  titleKeyword: '',
  orderNumberKeyword: '',
  libraryNoteKeyword: '',
};

const dateFormat = 'YYYY-MM-DD';

// Component props
const selectProps: Pick<SelectProps<never>, 'mode' | 'placeholder' | 'showArrow' | 'allowClear'> = {
  mode: 'multiple',
  placeholder: 'Leave blank to select all records.',
  showArrow: true,
  allowClear: true,
};

const dateRangePickerProps: Pick<RangePickerProps, 'className' | 'format'> = {
  className: style.dateRangePicker,
  format: dateFormat,
};

const inputProps: Pick<InputProps, 'placeholder' | 'allowClear'> = {
  placeholder: 'Leave blank to select all records.',
  allowClear: true,
};

// Convert strings to Select options
const getSelectOptions = (items: string[]): { value: string; label: string }[] =>
  items.map((item) => ({
    value: item,
    label: item !== null ? item : '(Empty)',
  }));

// Convert strings to DateRangePicker value
const getDateRangePickerValue = (items: [string, string]): [Moment, Moment] => [
  items[0] !== '' ? moment(items[0], dateFormat) : null,
  items[1] !== '' ? moment(items[1], dateFormat) : null,
];

// Convert boolean value to FormItem className
const getFormItemClassName = (value: boolean): string =>
  `${style.formItem} ${value ? style['formItem-Active'] : style['formItem-Inactive']}`;

// Check if a DateRangePicker is enabled or not
const isDateRangePickerEnabled = (items: [string, string]): boolean => items[0] !== '' && items[1] !== '';

// Convert data to filters
const getFilters = (data: IAggregatedFiltersData): IFilter[] => {
  const draft: (IFilter | false)[] = [
    data.tagsToFilter.length > 0 && { col: 'tags', op: 'in', val: data.tagsToFilter },
    data.ipsCodesToFilter.length > 0 && { col: 'ipsCode', op: 'in', val: data.ipsCodesToFilter },
    data.vendorCodeToFilter.length > 0 && { col: 'vendorCode', op: 'in', val: data.vendorCodeToFilter },
    data.materialToFilter.length > 0 && { col: 'material', op: 'in', val: data.materialToFilter },
    data.materialTypeToFilter.length > 0 && { col: 'materialType', op: 'in', val: data.materialTypeToFilter },
    data.cdlItemStatusToFilter.length > 0 && { col: 'cdlItemStatus', op: 'in', val: data.cdlItemStatusToFilter },
    isDateRangePickerEnabled(data.createdDateRange) && {
      col: 'createdDate',
      op: 'between',
      val: data.createdDateRange,
    },
    isDateRangePickerEnabled(data.arrivalDateRange) && {
      col: 'arrivalDate',
      op: 'between',
      val: data.arrivalDateRange,
    },
    isDateRangePickerEnabled(data.ipsDateRange) && { col: 'ipsDate', op: 'between', val: data.ipsDateRange },
    isDateRangePickerEnabled(data.orderRequestDateRange) && {
      col: 'orderRequestDate',
      op: 'between',
      val: data.orderRequestDateRange,
    },
    isDateRangePickerEnabled(data.scanningVendorPaymentDateRange) && {
      col: 'scanningVendorPaymentDate',
      op: 'between',
      val: data.scanningVendorPaymentDateRange,
    },
    isDateRangePickerEnabled(data.pdfDeliveryDateRange) && {
      col: 'pdfDeliveryDate',
      op: 'between',
      val: data.pdfDeliveryDateRange,
    },
    isDateRangePickerEnabled(data.backToKarmsDateRange) && {
      col: 'backToKarmsDate',
      op: 'between',
      val: data.backToKarmsDateRange,
    },
    data.barcodeKeyword !== '' && { col: 'barcode', op: 'like', val: data.barcodeKeyword },
    data.titleKeyword !== '' && { col: 'title', op: 'like', val: data.titleKeyword },
    data.orderNumberKeyword !== '' && { col: 'orderNumber', op: 'like', val: data.orderNumberKeyword },
    data.libraryNoteKeyword !== '' && { col: 'libraryNote', op: 'like', val: data.libraryNoteKeyword },
  ];
  const removeFalsyItems = (item: IFilter | false): item is IFilter => item !== false;
  return draft.filter<IFilter>(removeFalsyItems);
};

// Get default filters
const getDefaultFilters = (): IFilter[] => getFilters(defaultData);

// TODO: remove `mobx`
// TODO: get rid of global navigation state, pass props and use separate Route instead
// TODO: add height limit to prevent from pointing to wrong position
const AggregatedFilters: React.FC<{
  isCdl: boolean;
  defaultTagsToFilter: ITag[];
  onChange: (filters: IFilter[]) => void;
}> = observer(({ isCdl, defaultTagsToFilter, onChange }) => {
  const dispatch = useDispatch<IAppDispatch>();

  // Popover states
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Metadata states
  const isLoadingMetadata = useSelector<IRootState, boolean>(({ metadata }) => !metadata.hasMetadata);
  const metadata = useSelector<IRootState, IMetadata>(({ metadata }) => metadata.metadata);

  // Filter states
  const [displayData] = useState(
    observable<IAggregatedFiltersData>({
      ...defaultData,
      tagsToFilter: defaultTagsToFilter,
    })
  );
  const [savedData] = useState(
    observable<IAggregatedFiltersData>({
      ...defaultData,
      tagsToFilter: defaultTagsToFilter,
    })
  );
  const [filters] = useState(computed(() => getFilters(toJS(savedData))));

  // Load metadata at component creation
  useEffect(() => {
    dispatch(fetchMetadata());
  }, []);

  // Update the data to preset when `isCdl` or `defaultTagsToFilter` changes
  useDidMountEffect(() => {
    runInAction(() => {
      assign(displayData, { ...defaultData, tagsToFilter: defaultTagsToFilter });
      assign(savedData, displayData);
    });
  }, [isCdl, defaultTagsToFilter]);

  // Side effect hook that runs when filters are updated
  useReaction(
    () => filters.get(),
    (filters) => {
      onChange(filters);
    }
  );

  return (
    <Popover
      trigger="click"
      visible={isPopoverVisible}
      onVisibleChange={(visible) => {
        setIsPopoverVisible(visible);
        // Reset the display data to the saved data
        if (!visible) {
          runInAction(() => {
            assign(displayData, savedData);
          });
        }
      }}
      placement="bottomRight"
      getPopupContainer={() => document.getElementById('orderTableCard')}
      overlayClassName={style.overlay}
      content={
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} className={style.form} colon={true}>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Typography.Title level={5}>Change Filters</Typography.Title>
          </Form.Item>
          {/* Tag Select */}
          <Form.Item label="Tags" className={getFormItemClassName(displayData.tagsToFilter.length > 0)}>
            <Select<ITag[]>
              {...selectProps}
              options={metadata.tags.map((item) => ({ value: item, label: item }))}
              value={displayData.tagsToFilter}
              onChange={(value) => {
                runInAction(() => {
                  displayData.tagsToFilter = value;
                });
              }}
              tagRender={({ value }) => {
                return (
                  <ColoredTag
                    tag={value as ITag}
                    closable
                    onClose={() => {
                      runInAction(() => {
                        displayData.tagsToFilter = displayData.tagsToFilter.filter((item) => item !== (value as ITag));
                      });
                    }}
                  />
                );
              }}
            />
          </Form.Item>
          {/* IPS Code Select */}
          <Form.Item label="IPS Code" className={getFormItemClassName(displayData.ipsCodesToFilter.length > 0)}>
            <Select<string[]>
              {...selectProps}
              options={getSelectOptions(metadata.ipsCode)}
              value={displayData.ipsCodesToFilter}
              onChange={(value) => {
                runInAction(() => {
                  displayData.ipsCodesToFilter = value;
                });
              }}
            />
          </Form.Item>
          {/* Vendor Code Select */}
          <Form.Item label="Vendor Code" className={getFormItemClassName(displayData.vendorCodeToFilter.length > 0)}>
            <Select<string[]>
              {...selectProps}
              options={getSelectOptions(metadata.vendors)}
              value={displayData.vendorCodeToFilter}
              onChange={(value) => {
                runInAction(() => {
                  displayData.vendorCodeToFilter = value;
                });
              }}
            />
          </Form.Item>
          {/* Material Select */}
          <Form.Item label="Material" className={getFormItemClassName(displayData.materialToFilter.length > 0)}>
            <Select<string[]>
              {...selectProps}
              options={getSelectOptions(metadata.material)}
              value={displayData.materialToFilter}
              onChange={(value) => {
                runInAction(() => {
                  displayData.materialToFilter = value;
                });
              }}
            />
          </Form.Item>
          {/* Material Type Select */}
          <Form.Item
            label="Material Type"
            className={getFormItemClassName(displayData.materialTypeToFilter.length > 0)}
          >
            <Select<string[]>
              {...selectProps}
              options={getSelectOptions(metadata.materialType)}
              value={displayData.materialTypeToFilter}
              onChange={(value) => {
                runInAction(() => {
                  displayData.materialTypeToFilter = value;
                });
              }}
            />
          </Form.Item>
          {/* CDL Item Status Selector */}
          {isCdl && (
            <Form.Item
              label="CDL Item Status"
              className={getFormItemClassName(displayData.cdlItemStatusToFilter.length > 0)}
            >
              <Select<string[]>
                {...selectProps}
                options={getSelectOptions(metadata.cdlTags)}
                value={displayData.cdlItemStatusToFilter}
                onChange={(value) => {
                  runInAction(() => {
                    displayData.cdlItemStatusToFilter = value;
                  });
                }}
              />
            </Form.Item>
          )}
          {/* Created Date Range Picker */}
          <Form.Item
            label="Created Date"
            className={getFormItemClassName(isDateRangePickerEnabled(displayData.createdDateRange))}
          >
            <DatePicker.RangePicker
              {...dateRangePickerProps}
              value={getDateRangePickerValue(displayData.createdDateRange)}
              onChange={(dates) => {
                runInAction(() => {
                  displayData.createdDateRange =
                    dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                });
              }}
            />
          </Form.Item>
          {/* Arrival Date Range Picker */}
          <Form.Item
            label="Arrival Date"
            className={getFormItemClassName(isDateRangePickerEnabled(displayData.arrivalDateRange))}
          >
            <DatePicker.RangePicker
              {...dateRangePickerProps}
              value={getDateRangePickerValue(displayData.arrivalDateRange)}
              onChange={(dates) => {
                runInAction(() => {
                  displayData.arrivalDateRange =
                    dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                });
              }}
            />
          </Form.Item>
          {/* IPS Date Range Picker */}
          <Form.Item
            label="IPS Date"
            className={getFormItemClassName(isDateRangePickerEnabled(displayData.ipsDateRange))}
          >
            <DatePicker.RangePicker
              {...dateRangePickerProps}
              value={getDateRangePickerValue(displayData.ipsDateRange)}
              onChange={(dates) => {
                runInAction(() => {
                  displayData.ipsDateRange =
                    dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                });
              }}
            />
          </Form.Item>
          {/* Order Request Date Range Picker */}
          {isCdl && (
            <Form.Item
              label="Order Request Date"
              className={getFormItemClassName(isDateRangePickerEnabled(displayData.orderRequestDateRange))}
            >
              <DatePicker.RangePicker
                {...dateRangePickerProps}
                value={getDateRangePickerValue(displayData.orderRequestDateRange)}
                onChange={(dates) => {
                  runInAction(() => {
                    displayData.orderRequestDateRange =
                      dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                  });
                }}
              />
            </Form.Item>
          )}
          {/* Scanning Vendor Payment Date Range Picker */}
          {isCdl && (
            <Form.Item
              label="Scanning Vendor Payment Date"
              className={getFormItemClassName(isDateRangePickerEnabled(displayData.scanningVendorPaymentDateRange))}
            >
              <DatePicker.RangePicker
                {...dateRangePickerProps}
                value={getDateRangePickerValue(displayData.scanningVendorPaymentDateRange)}
                onChange={(dates) => {
                  runInAction(() => {
                    displayData.scanningVendorPaymentDateRange =
                      dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                  });
                }}
              />
            </Form.Item>
          )}
          {/* PDF Delivery Date Range Picker */}
          {isCdl && (
            <Form.Item
              label="PDF Delivery Date"
              className={getFormItemClassName(isDateRangePickerEnabled(displayData.pdfDeliveryDateRange))}
            >
              <DatePicker.RangePicker
                {...dateRangePickerProps}
                value={getDateRangePickerValue(displayData.pdfDeliveryDateRange)}
                onChange={(dates) => {
                  runInAction(() => {
                    displayData.pdfDeliveryDateRange =
                      dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                  });
                }}
              />
            </Form.Item>
          )}
          {/* Back to KARMS Date Range Picker */}
          {isCdl && (
            <Form.Item
              label="Back to KARMS Date"
              className={getFormItemClassName(isDateRangePickerEnabled(displayData.backToKarmsDateRange))}
            >
              <DatePicker.RangePicker
                {...dateRangePickerProps}
                value={getDateRangePickerValue(displayData.backToKarmsDateRange)}
                onChange={(dates) => {
                  runInAction(() => {
                    displayData.backToKarmsDateRange =
                      dates !== null ? [dates[0].format(dateFormat), dates[1].format(dateFormat)] : ['', ''];
                  });
                }}
              />
            </Form.Item>
          )}
          {/* Barcode Keyword Input */}
          <Form.Item label="Barcode" className={getFormItemClassName(displayData.barcodeKeyword !== '')}>
            <Input
              {...inputProps}
              value={displayData.barcodeKeyword}
              onChange={(e) => {
                runInAction(() => {
                  displayData.barcodeKeyword = e.target.value;
                });
              }}
            />
          </Form.Item>
          {/* Title Keyword Input */}
          <Form.Item label="Title" className={getFormItemClassName(displayData.titleKeyword !== '')}>
            <Input
              {...inputProps}
              value={displayData.titleKeyword}
              onChange={(e) => {
                runInAction(() => {
                  displayData.titleKeyword = e.target.value;
                });
              }}
            />
          </Form.Item>
          {/* Order Number Keyword Input */}
          <Form.Item label="Order Number" className={getFormItemClassName(displayData.orderNumberKeyword !== '')}>
            <Input
              {...inputProps}
              value={displayData.orderNumberKeyword}
              onChange={(e) => {
                runInAction(() => {
                  displayData.orderNumberKeyword = e.target.value;
                });
              }}
            />
          </Form.Item>
          {/* Library Note Input */}
          <Form.Item label="Library Note" className={getFormItemClassName(displayData.libraryNoteKeyword !== '')}>
            <Input
              {...inputProps}
              value={displayData.libraryNoteKeyword}
              onChange={(e) => {
                runInAction(() => {
                  displayData.libraryNoteKeyword = e.target.value;
                });
              }}
            />
          </Form.Item>
          {/* Buttons */}
          <Form.Item wrapperCol={{ span: 24 }}>
            <Space className={style.buttons}>
              {isLoadingMetadata ? (
                <Badge status="processing" text="Loading metadata..." />
              ) : !isEqual(displayData, savedData) ? (
                <Badge status="warning" text="Changes not saved" />
              ) : filters.get().length === 0 ? (
                <Badge status="default" text="Filters not enabled" />
              ) : (
                <Badge status="success" text="Filters enabled" />
              )}
              <Button
                icon={<UndoOutlined />}
                onClick={() => {
                  // Reset and save the display data
                  runInAction(() => {
                    assign<IAggregatedFiltersData, IAggregatedFiltersData>(displayData, defaultData);
                    assign<IAggregatedFiltersData, IAggregatedFiltersData>(savedData, displayData);
                  });
                  // Hide Popover
                  setIsPopoverVisible(false);
                }}
              >
                Reset
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  // Save the display data
                  runInAction(() => {
                    assign<IAggregatedFiltersData, IAggregatedFiltersData>(savedData, displayData);
                  });
                  // Hide Popover
                  setIsPopoverVisible(false);
                }}
              >
                Apply
              </Button>
            </Space>
          </Form.Item>
        </Form>
      }
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
  );
});

export { AggregatedFilters, getDefaultFilters };
