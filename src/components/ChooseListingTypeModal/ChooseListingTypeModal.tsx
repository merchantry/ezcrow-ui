import React from 'react';

import styles from './ChooseListingTypeModal.module.scss';
import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import BaseButton from 'components/BaseButton';
import { ListingAction } from 'utils/enums';

interface ChooseListingTypeModalProps extends ModalProps<ListingAction> {}

function ChooseListingTypeModal({ onSubmit, onClose }: ChooseListingTypeModalProps) {
  return (
    <Modal title="Choose Listing Type" onClose={onClose}>
      <Modal.Body className={styles.modalBody}>
        <BaseButton color="success" onClick={() => onSubmit(ListingAction.Sell)}>
          I want to buy tokens
        </BaseButton>
        <BaseButton color="error" onClick={() => onSubmit(ListingAction.Buy)}>
          I want to sell tokens
        </BaseButton>
      </Modal.Body>
    </Modal>
  );
}

export default ChooseListingTypeModal;
