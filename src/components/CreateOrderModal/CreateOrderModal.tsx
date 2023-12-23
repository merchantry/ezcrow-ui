import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './CreateOrderModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing } from 'utils/types';
import { ListingAction } from 'utils/enums';
import { currencyToSymbol, decapitalize, opposite, priceFormat, roundTo } from 'utils/helpers';
import BaseButton from 'components/BaseButton';
import { ROUND_TO_FIAT, ROUND_TO_TOKEN } from 'utils/config';
import { FiatInput, TokenInput } from 'components/NumberInput/ModifiedNumberInputs';

type CreateOrderData = {
  orderAmount: number;
  orderCost: number;
};

export interface CreateOrderModalProps extends EditableModalProps<CreateOrderData> {
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
    data?.orderAmount ?? Math.min(maxTokenOrderAmount, listing.availableAmount),
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

  const currencySymbol = useMemo(
    () => currencyToSymbol(listing.fiatCurrency),
    [listing.fiatCurrency],
  );

  const { orderAmountHelperText, orderCostHelperText } = useMemo(() => {
    const action = decapitalize(opposite(listing.action, [ListingAction.Buy, ListingAction.Sell]));

    return {
      // eslint-disable-next-line max-len
      orderAmountHelperText: `The amount of tokens you would like to ${action}. Enter an amount between ${minTokenOrderAmount} and ${maxTokenOrderAmount} ${listing.token}`,
      // eslint-disable-next-line max-len
      orderCostHelperText: `The total cost of your order. Rate ${priceFormat(
        listing.price,
        listing.fiatCurrency,
      )}  * Order Amount`,
    };
  }, [
    listing.action,
    listing.fiatCurrency,
    listing.price,
    listing.token,
    maxTokenOrderAmount,
    minTokenOrderAmount,
  ]);

  const orderCost = useMemo(
    () => roundTo(orderAmount * listing.price, ROUND_TO_FIAT),
    [listing.price, orderAmount],
  );

  const handleOnSubmit = useCallback(() => {
    if (orderAmountError) return;
    onSubmit({
      orderAmount,
      orderCost,
    });
  }, [onSubmit, orderAmount, orderAmountError, orderCost]);

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
      <Modal.Body className={styles.body}>
        <TokenInput
          label="Order Amount"
          value={orderAmount}
          onChange={setOrderAmount}
          helperText={orderAmountHelperText}
          endAdornment={listing.token}
          error={orderAmountError}
        />
        <FiatInput
          label="Order Cost"
          className={styles.orderCost}
          value={orderCost}
          helperText={orderCostHelperText}
          endAdornment={currencySymbol}
          disabled
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
