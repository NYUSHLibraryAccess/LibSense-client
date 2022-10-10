import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DeleteOutlined, DownOutlined, EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Dropdown, Form, Input, Menu, message, Select } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { isEqual, sortBy } from 'lodash-es';

import { StyledModal } from '@/components/StyledModal';
import { OrderTableContext } from '@/routes/OrderTable';
import {
  useAllPresetsQuery,
  useCreatePresetMutation,
  useDeletePresetMutation,
  useUpdatePresetMutation,
} from '@/services/presets';
import { builtinTagPresets } from '@/constants/builtinTagPresets';
import { builtinViewPresets } from '@/constants/builtinViewPresets';

type ModalName = 'save' | 'saveAsNew' | 'rename' | 'delete' | null;

const PresetControlContext = React.createContext<{
  visibleModal: ModalName;
  setVisibleModal: React.Dispatch<React.SetStateAction<ModalName>>;
  refetch: () => void;
}>(null);

const SaveModal: React.FC = () => {
  const { currentPreset, views, filters } = useContext(OrderTableContext);
  const { visibleModal, setVisibleModal, refetch } = useContext(PresetControlContext);
  const [updatePreset, { isLoading, isSuccess, isError, reset }] = useUpdatePresetMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success('Preset saved.');
      refetch();
      setVisibleModal(null);
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error('Failed to save the preset.');
      reset();
    }
  }, [isError]);

  return (
    <StyledModal
      title="Save Preset"
      visible={visibleModal === 'save'}
      width={420}
      confirmLoading={isLoading}
      onCancel={() => setVisibleModal(null)}
      onOk={() => {
        updatePreset({
          presetId: currentPreset?.presetId,
          presetName: currentPreset?.presetName,
          filters,
          views,
        });
      }}
    >
      Would you like to save the changes to the preset?
    </StyledModal>
  );
};

const SaveAsNewModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { views, filters } = useContext(OrderTableContext);
  const { visibleModal, setVisibleModal, refetch } = useContext(PresetControlContext);
  const [createPreset, { isLoading, isSuccess, data, isError, reset }] = useCreatePresetMutation();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      createPreset({
        presetName: form.getFieldValue('presetName'),
        filters,
        views,
      });
    } catch (e) {
      // Do nothing
    }
  }, [filters, views]);

  useEffect(() => {
    if (isSuccess && data && searchParams.get('preset') !== data.presetId.toString()) {
      message.success('Saved as a new preset.');
      refetch();
      searchParams.set('preset', data.presetId.toString());
      searchParams.delete('search');
      setSearchParams(searchParams);
      form.resetFields();
      setVisibleModal(null);
      reset();
    }
  }, [isSuccess, data, searchParams]);

  useEffect(() => {
    if (isError) {
      message.error('Failed to save as a new preset.');
      reset();
    }
  }, [isError]);

  return (
    <StyledModal
      title="Save As New Preset"
      visible={visibleModal === 'saveAsNew'}
      width={500}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields();
        setVisibleModal(null);
      }}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        onKeyDown={(e) => {
          e.key === 'Enter' && handleSubmit();
        }}
      >
        <Form.Item
          name="presetName"
          label="Preset Name"
          className="mb-0"
          rules={[
            {
              required: true,
              message: 'Please input the preset name!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

const RenameModal: React.FC = () => {
  const { currentPreset, views, filters } = useContext(OrderTableContext);
  const { visibleModal, setVisibleModal, refetch } = useContext(PresetControlContext);
  const [updatePreset, { isLoading, isSuccess, isError, reset }] = useUpdatePresetMutation();

  const [form] = Form.useForm();

  const handleSubmit = useCallback(async () => {
    try {
      await form.validateFields();
      updatePreset({
        presetId: currentPreset?.presetId,
        presetName: form.getFieldValue('presetName'),
        filters,
        views,
      });
    } catch (e) {
      // Do nothing
    }
  }, [currentPreset, filters, views]);

  useEffect(() => {
    if (visibleModal === 'rename') {
      form.setFieldsValue({ presetName: currentPreset?.presetName });
    }
  }, [visibleModal, currentPreset]);

  useEffect(() => {
    if (isSuccess) {
      message.success('Preset renamed.');
      refetch();
      form.resetFields();
      setVisibleModal(null);
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      message.error('Failed to rename the preset.');
      reset();
    }
  }, [isError]);

  return (
    <StyledModal
      title="Rename Preset"
      visible={visibleModal === 'rename'}
      width={500}
      confirmLoading={isLoading}
      onCancel={() => {
        form.resetFields();
        setVisibleModal(null);
      }}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        onKeyDown={(e) => {
          e.key === 'Enter' && handleSubmit();
        }}
      >
        <Form.Item
          name="presetName"
          label="Preset Name"
          className="mb-0"
          rules={[
            {
              required: true,
              message: 'Please input the preset name!',
            },
          ]}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

const DeleteModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPreset } = useContext(OrderTableContext);
  const { visibleModal, setVisibleModal, refetch } = useContext(PresetControlContext);
  const [deletePreset, { isLoading, isSuccess, isError, reset }] = useDeletePresetMutation();

  useEffect(() => {
    if (isSuccess && searchParams.get('preset') !== builtinTagPresets[0].presetId.toString()) {
      message.success('Preset deleted.');
      refetch();
      searchParams.set('preset', builtinTagPresets[0].presetId.toString());
      searchParams.delete('search');
      setSearchParams(searchParams);
      setVisibleModal(null);
      reset();
    }
  }, [isSuccess, searchParams]);

  useEffect(() => {
    if (isError) {
      message.error('Failed to delete the preset.');
      reset();
    }
  }, [isError]);

  return (
    <StyledModal
      title="Delete Preset"
      visible={visibleModal === 'delete'}
      width={420}
      confirmLoading={isLoading}
      onCancel={() => setVisibleModal(null)}
      onOk={() => {
        deletePreset({
          presetId: currentPreset?.presetId,
        });
      }}
    >
      Would you like to delete the preset?
    </StyledModal>
  );
};

const PresetControl: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentPreset, setCurrentPreset, views, filters, applyPreset } = useContext(OrderTableContext);
  const { data: customPresets, refetch } = useAllPresetsQuery();

  // Apply the preset with the corresponding presetId on URL changes
  useEffect(() => {
    // Use the first built-in tag preset as the fallback
    const preset =
      [...builtinTagPresets, ...builtinViewPresets, ...(customPresets || [])].find(
        ({ presetId }) => presetId === parseInt(searchParams.get('preset'))
      ) || builtinTagPresets[0];
    setCurrentPreset(preset);
  }, [customPresets, searchParams]);

  const [visibleModal, setVisibleModal] = useState<ModalName>(null);
  const contextValue = useMemo(
    () => ({
      visibleModal,
      setVisibleModal,
      refetch,
    }),
    [visibleModal]
  );

  // Whether the temporary preset is different from the current preset or not.
  const hasPresetChanges = useMemo(
    () =>
      // Compare filters
      !isEqual(
        sortBy(filters, ['col']).map((filter) => ({
          ...filter,
          val: filter.op === 'in' ? sortBy(filter.val) : filter.val,
        })),
        sortBy(currentPreset?.filters || [], ['col']).map((filter) => ({
          ...filter,
          val: filter.op === 'in' ? sortBy(filter.val) : filter.val,
        }))
      ) ||
      // Compare views
      !isEqual(
        {
          cdlView: false,
          pendingRushLocal: false,
          pendingCdl: false,
          prioritize: false,
          ...views,
        },
        {
          cdlView: false,
          pendingRushLocal: false,
          pendingCdl: false,
          prioritize: false,
          ...currentPreset?.views,
        }
      ),
    [filters, views, currentPreset]
  );
  const isBuiltinPreset = useMemo(
    () =>
      builtinTagPresets.findIndex(({ presetId }) => presetId === currentPreset?.presetId) !== -1 ||
      builtinViewPresets.findIndex(({ presetId }) => presetId === currentPreset?.presetId) !== -1,
    [currentPreset]
  );
  const selectValue = useMemo(
    () => [currentPreset?.presetName, currentPreset && hasPresetChanges && '(*)'].filter(Boolean).join(' '),
    [currentPreset, hasPresetChanges]
  );
  // Dropdown menu items
  const menuItems = useMemo<ItemType[]>(
    () => [
      {
        key: 'save',
        icon: <SaveOutlined />,
        label: <span className="select-none">Save...</span>,
        disabled: isBuiltinPreset || !hasPresetChanges,
        onClick: () => setVisibleModal('save'),
      },
      {
        key: 'saveAsNew',
        icon: <SaveOutlined />,
        label: <span className="select-none">Save As New...</span>,
        onClick: () => setVisibleModal('saveAsNew'),
      },
      {
        key: 'rename',
        icon: <EditOutlined />,
        label: <span className="select-none">Rename...</span>,
        disabled: isBuiltinPreset,
        onClick: () => setVisibleModal('rename'),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: <span className="select-none">Delete...</span>,
        disabled: isBuiltinPreset,
        onClick: () => setVisibleModal('delete'),
      },
      {
        type: 'divider',
      },
      {
        key: 'apply',
        icon: <UndoOutlined />,
        label: <span className="select-none">Re-Apply Preset</span>,
        onClick: () => applyPreset(),
      },
    ],
    [isBuiltinPreset, hasPresetChanges, applyPreset]
  );

  return (
    <PresetControlContext.Provider value={contextValue}>
      <div className="flex items-center gap-4">
        <span className="select-none">Preset:</span>
        <Select
          showSearch
          value={selectValue}
          onChange={(presetId) => {
            searchParams.set('preset', presetId.toString());
            searchParams.delete('search');
            setSearchParams(searchParams);
          }}
          className="w-56"
        >
          <Select.OptGroup label="Tag Presets">
            {builtinTagPresets.map(({ presetId, presetName }) => (
              <Select.Option key={presetId} value={presetId}>
                {presetName}
              </Select.Option>
            ))}
          </Select.OptGroup>
          <Select.OptGroup label="View Presets">
            {builtinViewPresets.map(({ presetId, presetName }) => (
              <Select.Option key={presetId} value={presetId}>
                {presetName}
              </Select.Option>
            ))}
          </Select.OptGroup>
          {customPresets?.length > 0 && (
            <Select.OptGroup label="Custom Presets">
              {customPresets?.map(({ presetId, presetName }) => (
                <Select.Option key={presetId} value={presetId}>
                  {presetName}
                </Select.Option>
              ))}
            </Select.OptGroup>
          )}
        </Select>
        <Dropdown overlay={<Menu items={menuItems} />}>
          <div className="flex items-center gap-2 select-none cursor-pointer text-violet-600 transition-colors hover:text-violet-900">
            Preset Actions
            <DownOutlined />
          </div>
        </Dropdown>
      </div>
      <SaveModal />
      <SaveAsNewModal />
      <RenameModal />
      <DeleteModal />
    </PresetControlContext.Provider>
  );
};

export { PresetControl };
