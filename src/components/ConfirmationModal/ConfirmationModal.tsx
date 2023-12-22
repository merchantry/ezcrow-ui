import React from 'react';

import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import BaseButton from 'components/BaseButton';
import { ColorType } from 'mui/helpers';
import styles from './ConfirmationModal.module.scss';

export interface ConfirmationModalProps extends ModalProps<boolean> {
  text: string;
  confirmText?: string;
  cancelText?: string;
  confirmIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  confirmStartIcon?: React.ReactNode;
  cancelStartIcon?: React.ReactNode;
  confirmColor?: ColorType;
  cancelColor?: ColorType;
  noCancelBtn?: boolean;
}

function ConfirmationModal({
  onSubmit,
  text,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmIcon,
  cancelIcon,
  confirmStartIcon,
  cancelStartIcon,
  confirmColor = 'success',
  cancelColor = 'error',
  noCancelBtn = false,
  ...modalProps
}: ConfirmationModalProps) {
  const onConfirm = () => {
    onSubmit(true);
  };

  const onCancel = () => {
    onSubmit(false);
  };

  return (
    <Modal {...modalProps}>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer className={noCancelBtn ? styles.center : undefined}>
        {!noCancelBtn && (
          <BaseButton
            color={cancelColor}
            onClick={onCancel}
            startIcon={cancelStartIcon}
            endIcon={cancelIcon}
          >
            {cancelText}
          </BaseButton>
        )}
        <BaseButton
          color={confirmColor}
          onClick={onConfirm}
          startIcon={confirmStartIcon}
          endIcon={confirmIcon}
        >
          {confirmText}
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
