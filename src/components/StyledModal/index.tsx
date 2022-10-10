import { Modal, ModalProps } from 'antd';

const StyledModal: React.FC<Omit<ModalProps, 'wrapClassName' | 'focusTriggerAfterClose'>> = ({
  children,
  ...props
}) => {
  return (
    <Modal
      // Fix scrollbar glitch on open
      wrapClassName="overflow-hidden"
      // Fix blink on close
      focusTriggerAfterClose={false}
      {...props}
    >
      {children}
    </Modal>
  );
};

export { StyledModal };
