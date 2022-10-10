import React, { useContext, useState } from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Radio, Switch } from 'antd';

import { StyledModal } from '@/components/StyledModal';
import { OrderTableContext } from '@/routes/OrderTable';

const TablePanel: React.FC = () => {
  const {
    uiSize,
    setUiSize,
    highlightCheckMark,
    setHighlightCheckMark,
    highlightAttentionMark,
    setHighlightAttentionMark,
  } = useContext(OrderTableContext);

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={() => setVisible(true)}>
        Settings...
      </Button>
      <StyledModal
        title="Table Settings"
        visible={visible}
        footer={null}
        width={650}
        bodyStyle={{
          overflow: 'auto',
        }}
        onCancel={() => setVisible(false)}
      >
        <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
          <Form.Item label="Size" className="mb-4">
            <Radio.Group value={uiSize} onChange={(event) => setUiSize(event.target.value)}>
              <Radio.Button value="small">Small</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="large">Large</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Highlight Checked Marks" className="mb-2">
            <Switch checked={highlightCheckMark} onChange={setHighlightCheckMark} />
          </Form.Item>
          <Form.Item label="Highlight Attention-Required Marks" className="mb-0">
            <Switch checked={highlightAttentionMark} onChange={setHighlightAttentionMark} />
          </Form.Item>
        </Form>
      </StyledModal>
    </>
  );
};

export { TablePanel };
