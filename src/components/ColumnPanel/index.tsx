import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { EditOutlined, QuestionCircleOutlined, UndoOutlined } from '@ant-design/icons';
import { MinusOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, Form, Tooltip } from 'antd';
import jsConvert from 'js-convert-case';
import { Scrollbars } from 'react-custom-scrollbars';

import { StyledModal } from '@/components/StyledModal';
import { OrderTableContext } from '@/routes/OrderTable';
import { useOrderTable } from '@/hooks/useOrderTable';

const SortableItem: React.FC<{
  id: string;
  title: string;
  checked: boolean;
  onChange: (event: { id: string; checked: boolean }) => void;
}> = ({ id, title, checked, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...attributes} style={style} className="select-none flex items-center gap-2">
      <FontAwesomeIcon icon={faBars} {...listeners} className="w-3 h-3 text-gray-400" />
      <Checkbox checked={checked} onChange={(event) => onChange({ id, checked: event.target.checked })}>
        {title}
      </Checkbox>
    </div>
  );
};

const ColumnSorter: React.FC<{
  cachedColumnOptions: ReturnType<typeof useOrderTable>['columnOptions'];
  setCachedColumnOptions: ReturnType<typeof useOrderTable>['setColumnOptions'];
}> = ({ cachedColumnOptions, setCachedColumnOptions }) => {
  const { views } = useContext(OrderTableContext);

  // Use dataIndex as id
  const items = useMemo(
    () =>
      cachedColumnOptions.map((option) => ({
        id: option.dataIndex,
        ...option,
      })),
    [cachedColumnOptions]
  );

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!active || !over) return;
    // Here, id is dataIndex
    setCachedColumnOptions((prevState) => {
      const oldIndex = prevState.findIndex(({ dataIndex }) => dataIndex === active.id);
      const newIndex = prevState.findIndex(({ dataIndex }) => dataIndex === over.id);
      return arrayMove(prevState, oldIndex, newIndex);
    });
  }, []);
  const handleCheckboxChange = useCallback(({ id, checked }: { id: string; checked: boolean }) => {
    // Here, id is dataIndex
    setCachedColumnOptions((prevState) =>
      prevState.map((option) => ({
        ...option,
        visible: option.dataIndex === id ? checked : option.visible,
      }))
    );
  }, []);
  const handleSelectAll = useCallback(() => {
    // Here, id is dateIndex
    setCachedColumnOptions((prevState) =>
      prevState.map((option) => ({
        ...option,
        visible: !option.cdlOnly || views.cdlView ? true : option.visible,
      }))
    );
  }, [views]);
  const handleSelectNone = useCallback(() => {
    // Here, id is dateIndex
    setCachedColumnOptions((prevState) =>
      prevState.map((option) => ({
        ...option,
        visible: !option.cdlOnly || views.cdlView ? false : option.visible,
      }))
    );
  }, [views]);
  const handleSelectReverse = useCallback(() => {
    // Here, id is dateIndex
    setCachedColumnOptions((prevState) =>
      prevState.map((option) => ({
        ...option,
        visible: !option.cdlOnly || views.cdlView ? !option.visible : option.visible,
      }))
    );
  }, [views]);

  return (
    <>
      <div className="border rounded-md border-gray-200 mb-2">
        <Scrollbars style={{ height: 360 }}>
          <div className="px-4 py-1">
            <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={items}>
                {items
                  // Do not render CDL-related items if CDL columns are invisible
                  .filter(({ cdlOnly }) => !cdlOnly || views.cdlView)
                  .map(({ id, visible, dataIndex, title }) => (
                    <SortableItem
                      key={id}
                      id={id}
                      title={title || jsConvert.toHeaderCase(dataIndex)}
                      checked={visible}
                      onChange={handleCheckboxChange}
                    />
                  ))}
              </SortableContext>
            </DndContext>
          </div>
        </Scrollbars>
      </div>
      <div className="flex gap-1">
        <Button size="small" shape="round" icon={<PlusOutlined />} onClick={handleSelectAll}>
          Select All
        </Button>
        <Button size="small" shape="round" icon={<MinusOutlined />} onClick={handleSelectNone}>
          Select None
        </Button>
        <Button size="small" shape="round" icon={<SwapOutlined />} onClick={handleSelectReverse}>
          Reverse
        </Button>
      </div>
    </>
  );
};

const ColumnPanel: React.FC = () => {
  const { views, columnOptions, setColumnOptions, resetColumnOptions } = useContext(OrderTableContext);

  const [visible, setVisible] = useState(false);
  const [cachedColumnOptions, setCachedColumnOptions] = useState<typeof columnOptions>([]);

  // Update previous values when modal gets visible
  useEffect(() => {
    if (visible) {
      setCachedColumnOptions(columnOptions);
    }
  }, [visible, columnOptions]);

  const handleModalShow = useCallback(() => {
    setVisible(true);
  }, []);
  const handleModalReset = useCallback(() => {
    // Reset to default
    resetColumnOptions();
    setVisible(false);
  }, [resetColumnOptions]);
  const handleModalCancel = useCallback(() => {
    setVisible(false);
  }, []);
  const handleModalSubmit = useCallback(() => {
    // Submit cached values
    setColumnOptions(cachedColumnOptions);
    setVisible(false);
  }, [cachedColumnOptions]);

  return (
    <>
      <Button icon={<EditOutlined />} onClick={handleModalShow}>
        Columns...
      </Button>
      <StyledModal
        title="Edit Columns"
        open={visible}
        footer={
          <>
            <Button icon={<UndoOutlined />} onClick={handleModalReset} className="float-left">
              Reset to Default
            </Button>
            <Button onClick={handleModalCancel}>Cancel</Button>
            <Button type="primary" onClick={handleModalSubmit}>
              OK
            </Button>
          </>
        }
        width={650}
        onCancel={handleModalCancel}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <div className="grid grid-cols-1 gap-y-2">
            <Form.Item label="Columns" className="mb-0">
              <ColumnSorter cachedColumnOptions={cachedColumnOptions} setCachedColumnOptions={setCachedColumnOptions} />
            </Form.Item>
            {!views.cdlView && (
              <Form.Item wrapperCol={{ offset: 8 }} className="mb-0">
                <span className="text-gray-400 select-none">
                  <Tooltip
                    title={
                      <span className="font-light">
                        To enable CDL Order columns, enable <span className="font-bold">View CDL Orders</span> option in
                        the <span className="font-bold">Filters / Views</span>.
                      </span>
                    }
                  >
                    <QuestionCircleOutlined className="mr-1 cursor-help" />
                  </Tooltip>
                  No CDL Order columns?
                </span>
              </Form.Item>
            )}
          </div>
        </Form>
      </StyledModal>
    </>
  );
};

export { ColumnPanel };
