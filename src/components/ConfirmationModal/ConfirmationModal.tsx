import React from 'react';

import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import BaseButton from 'components/BaseButton';

export interface ConfirmationModalProps extends ModalProps<boolean> {
  title?: string;
  text: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
}

function ConfirmationModal({
  onSubmit,
  onClose,
  title,
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmIcon,
  cancelIcon,
}: ConfirmationModalProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <BaseButton color="success" onClick={() => onSubmit(true)} endIcon={confirmIcon}>
          {confirmText}
        </BaseButton>
        <BaseButton color="error" onClick={() => onSubmit(false)} endIcon={cancelIcon}>
          {cancelText}
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
