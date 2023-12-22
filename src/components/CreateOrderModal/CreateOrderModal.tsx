import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './CreateOrderModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing } from 'utils/types';
import { ListingAction } from 'utils/enums';
import { roundTo } from 'utils/helpers';
import NumberInput from 'components/NumberInput';
import BaseButton from 'components/BaseButton';
import { MIN_TOKEN_AMOUNT, ROUND_TO_TOKEN } from 'utils/config';

export interface CreateOrderModalProps extends EditableModalProps<number> {
  listing: Listing;
}

function CreateOrderModal({ onSubmit, listing, data, ...modalProps }: CreateOrderModalProps) {
  const minTokenOrderAmount = useMemo(
    () => roundTo(listing.minPerOrder / listing.price, ROUND_TO_TOKEN),
    [listing.minPerOrder, listing.price],
  );

  const maxTokenOrderAmount = useMemo(
    () => roundTo(listing.maxPerOrder / listing.price, ROUND_TO_TOKEN),
    [listing.maxPerOrder, listing.price],
  );

  const [orderAmount, setOrderAmount] = useState<number>(
    data ?? Math.min(maxTokenOrderAmount, listing.availableAmount),
  );
  const [orderAmountError, setOrderAmountError] = useState<string | undefined>(undefined);

  const modalTitle = useMemo(() => {
    switch (listing.action) {
      case ListingAction.Sell:
        return 'Create Sell Order';
      case ListingAction.Buy:
        return 'Create Buy Order';
    }
  }, [listing.action]);

  const orderAmountHelperText = useMemo(
    () =>
      `Enter an amount between ${minTokenOrderAmount} and ${maxTokenOrderAmount} ${listing.token}`,
    [listing.token, maxTokenOrderAmount, minTokenOrderAmount],
  );

  const handleOnSubmit = useCallback(() => {
    if (orderAmountError) return;
    onSubmit(orderAmount);
  }, [onSubmit, orderAmount, orderAmountError]);

  useEffect(() => {
    setOrderAmountError(undefined);

    if (orderAmount < minTokenOrderAmount) {
      setOrderAmountError(`Minimum order amount is ${minTokenOrderAmount} ${listing.token}`);
    } else if (orderAmount > maxTokenOrderAmount) {
      setOrderAmountError(`Maximum order amount is ${maxTokenOrderAmount} ${listing.token}`);
    }
  }, [listing.token, maxTokenOrderAmount, minTokenOrderAmount, orderAmount]);

  return (
    <Modal title={modalTitle} {...modalProps}>
      <Modal.Body>
        <NumberInput
          className={styles.numberInput}
          label="Order Amount"
          value={orderAmount}
          onChange={setOrderAmount}
          helperText={orderAmountHelperText}
          endAdornment={listing.token}
          roundTo={ROUND_TO_TOKEN}
          step={MIN_TOKEN_AMOUNT}
          error={orderAmountError}
        />
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <BaseButton disabled={!!orderAmountError} color="success" onClick={handleOnSubmit}>
          Create Order
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateOrderModal;
