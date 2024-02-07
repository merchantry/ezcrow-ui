import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './CreateOrderModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing } from 'utils/types';
import { ListingAction, Round } from 'utils/enums';
import { currencyToSymbol, decapitalize, opposite, priceFormat, roundTo } from 'utils/helpers';
import BaseButton from 'components/BaseButton';
import { ROUND_TO_FIAT, ROUND_TO_TOKEN } from 'utils/config';
import { TokenInput } from 'components/NumberInput/ModifiedNumberInputs';
import ReadOnlyInput from 'components/ReadOnlyInput';

type CreateOrderData = {
  orderAmount: number;
  orderCost: number;
};

export interface CreateOrderModalProps extends EditableModalProps<CreateOrderData> {
  listing: Listing;
}

function CreateOrderModal({ onSubmit, listing, data, ...modalProps }: CreateOrderModalProps) {
  const minTokenOrderAmount = useMemo(
    () =>
      Math.min(
        listing.availableTokenAmount,
        roundTo(listing.minPricePerOrder / listing.price, ROUND_TO_TOKEN, Round.Up),
      ),
    [listing.availableTokenAmount, listing.minPricePerOrder, listing.price],
  );

  const maxTokenOrderAmount = useMemo(
    () =>
      Math.min(
        listing.availableTokenAmount,
        roundTo(listing.maxPricePerOrder / listing.price, ROUND_TO_TOKEN, Round.Down),
      ),
    [listing.availableTokenAmount, listing.maxPricePerOrder, listing.price],
  );

  const [orderAmount, setOrderAmount] = useState<number>(
    data?.orderAmount ?? Math.min(maxTokenOrderAmount, listing.availableTokenAmount),
  );
  const [orderAmountError, setOrderAmountError] = useState<string | undefined>(undefined);

  const modalTitle = useMemo(() => {
    switch (listing.action) {
      case ListingAction.Buy:
        return 'Create Sell Order';
      case ListingAction.Sell:
        return 'Create Buy Order';
    }
  }, [listing.action]);

  const currencySymbol = useMemo(() => currencyToSymbol(listing.currency), [listing.currency]);

  const orderAction = useMemo(
    () => opposite(listing.action, [ListingAction.Sell, ListingAction.Buy]),
    [listing.action],
  );

  const buttonTitle = useMemo(
    () => `${orderAction} ${listing.token}`,
    [listing.token, orderAction],
  );

  const buttonColor = useMemo(
    () => (orderAction === ListingAction.Buy ? 'success' : 'error'),
    [orderAction],
  );

  const { orderAmountHelperText, orderCostHelperText } = useMemo(
    () => ({
      orderAmountHelperText: `The amount of tokens you would like to ${decapitalize(
        orderAction,
      )}. Enter an amount between ${minTokenOrderAmount} and ${maxTokenOrderAmount} ${
        listing.token
      }`,
      orderCostHelperText: `The total cost of your order. Rate ${priceFormat(
        listing.price,
        listing.currency,
      )} * Order Amount`,
    }),
    [
      orderAction,
      listing.currency,
      listing.price,
      listing.token,
      maxTokenOrderAmount,
      minTokenOrderAmount,
    ],
  );

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
        <ReadOnlyInput
          label="Order Cost"
          className={styles.orderCost}
          value={orderCost}
          helperText={orderCostHelperText}
          endAdornment={currencySymbol}
        />
      </Modal.Body>

      <Modal.Footer className={styles.footer}>
        <BaseButton disabled={!!orderAmountError} color={buttonColor} onClick={handleOnSubmit}>
          {buttonTitle}
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateOrderModal;
