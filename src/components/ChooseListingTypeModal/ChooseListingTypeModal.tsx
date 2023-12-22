import React from 'react';

import styles from './ChooseListingTypeModal.module.scss';
import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import BaseButton from 'components/BaseButton';
import { ListingAction } from 'utils/enums';

interface ChooseListingTypeModalProps extends ModalProps<ListingAction> {}

function ChooseListingTypeModal({ onSubmit, ...modalProps }: ChooseListingTypeModalProps) {
  return (
    <Modal title="Choose Listing Type" {...modalProps}>
      <Modal.Body>
        Choose whether you want to <span className={`${styles.fontSpan} ${styles.buy}`}>buy</span>
        or
        <span className={`${styles.fontSpan} ${styles.sell}`}>sell</span> tokens
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <BaseButton color="success" onClick={() => onSubmit(ListingAction.Sell)}>
          I want to buy tokens
        </BaseButton>
        <BaseButton color="error" onClick={() => onSubmit(ListingAction.Buy)}>
          I want to sell tokens
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ChooseListingTypeModal;
