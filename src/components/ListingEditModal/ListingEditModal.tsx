import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './ListingEditModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing, ListingEditData } from 'utils/types';
import { ListingAction, ListingModalAction } from 'utils/enums';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { currencyToSymbol, maybePluralize, roundTo } from 'utils/helpers';
import BaseSelect from 'components/BaseSelect';
import { NumberInputProps } from 'components/NumberInput/NumberInput';
import { ROUND_TO_FIAT } from 'config/number';
import { FiatInput, TokenInput } from 'components/NumberInput/ModifiedNumberInputs';
import ReadOnlyInput from 'components/ReadOnlyInput';
import IconButtonWithTooltip from 'components/IconButtonWithTooltip';
import { FaLessThanEqual, FaEquals } from 'react-icons/fa6';

type ModifiedNumberInputProps = Omit<NumberInputProps, 'roundTo' | 'min' | 'step' | 'endAdornment'>;

export interface ListingEditModalProps extends EditableModalProps<ListingEditData> {
  action: ListingAction;
  modalAction: ListingModalAction;
  currencies: Record<string, string>;
  tokens: Record<string, string>;
  listing?: Listing;
  tokenParam?: string;
  currencyParam?: string;
}

function ListingEditModal({
  onSubmit,
  action,
  modalAction,
  currencies,
  tokens,
  listing,
  data,
  tokenParam = 'USDT',
  currencyParam = 'USD',
  ...modalProps
}: ListingEditModalProps) {
  const [token, setToken] = useState<string>(data?.token ?? listing?.token ?? tokenParam);
  const [totalTokenAmount, setTotalTokenAmount] = useState<number>(
    data?.totalTokenAmount ?? listing?.totalTokenAmount ?? 10,
  );
  const [price, setPrice] = useState<number>(data?.price ?? listing?.price ?? 1);
  const [minPricePerOrder, setMinPricePerOrder] = useState<number>(
    data?.minPricePerOrder ?? listing?.minPricePerOrder ?? 10,
  );
  const [maxPricePerOrder, setMaxPricePerOrder] = useState<number>(
    data?.maxPricePerOrder ?? listing?.maxPricePerOrder ?? 10,
  );
  const [currency, setCurrency] = useState<string>(
    data?.currency ?? listing?.currency ?? currencyParam,
  );

  const [minPricePerOrderError, setMinPricePerOrderError] = useState<string | undefined>(undefined);
  const [maxPricePerOrderError, setMaxPricePerOrderError] = useState<string | undefined>(undefined);

  const listingTitle = useMemo(() => {
    switch (modalAction) {
      case ListingModalAction.Edit:
        return `Edit ${action} Listing (ID: ${listing?.id})`;
      case ListingModalAction.CreateNew:
        return `Create New ${action} Listing`;
    }
  }, [action, listing, modalAction]);

  const buttonTooltip = useMemo(() => {
    if (action === ListingAction.Buy) {
      return undefined;
    }

    return `You will need to deposit ${totalTokenAmount} ${token} ${maybePluralize(
      totalTokenAmount,
      'token',
    )}`;
  }, [action, totalTokenAmount, token]);

  const currencySymbol = useMemo(() => currencyToSymbol(currency), [currency]);

  const maxPotentialOrderAmount = useMemo(() => {
    if (!price || !totalTokenAmount) return 0;

    return roundTo(price * totalTokenAmount, ROUND_TO_FIAT);
  }, [price, totalTokenAmount]);

  const isReadyToSubmit = useMemo(
    () =>
      !!totalTokenAmount &&
      !!price &&
      !!minPricePerOrder &&
      !!maxPricePerOrder &&
      !minPricePerOrderError &&
      !maxPricePerOrderError,
    [
      totalTokenAmount,
      price,
      minPricePerOrder,
      maxPricePerOrder,
      minPricePerOrderError,
      maxPricePerOrderError,
    ],
  );

  const {
    tokenHelperText,
    currencyHelperText,
    priceHelperText,
    amountHelperText,
    maxPotentialOrderAmountHelperText,
    minPricePerOrderHelperText,
    maxPricePerOrderHelperText,
  } = useMemo(() => {
    switch (action) {
      case ListingAction.Sell:
        return {
          tokenHelperText: `The token you want to sell`,
          currencyHelperText: `Currency you want to sell it for`,
          priceHelperText: `The price you want to sell the token for`,
          amountHelperText: `The amount of ${token} you want to sell`,
          // eslint-disable-next-line max-len
          maxPotentialOrderAmountHelperText: `The maximum amount of ${currency} you can earn on this listing (Rate * Amount)`,
          minPricePerOrderHelperText: `The minimum amount of ${currency} a user can spend per order`,
          maxPricePerOrderHelperText: `The maximum amount of ${currency} a user can spend per order`,
        };
      case ListingAction.Buy:
        return {
          tokenHelperText: `Token you want to buy`,
          currencyHelperText: `Currency you want to buy it with`,
          priceHelperText: `The price you want to buy the token for`,
          amountHelperText: `The amount of ${token} you want to buy`,
          // eslint-disable-next-line max-len
          maxPotentialOrderAmountHelperText: `The maximum amount of ${currency} you can spend on this listing (Rate * Amount)`,
          minPricePerOrderHelperText: `The minimum amount of ${currency} you want to spend per order`,
          maxPricePerOrderHelperText: `The maximum amount of ${currency} you want to spend per order`,
        };
    }
  }, [action, currency, token]);

  const FiatInputWithCurrency = useCallback(
    (props: Omit<ModifiedNumberInputProps, 'endAdornment'>) => (
      <FiatInput endAdornment={currencySymbol} {...props} />
    ),
    [currencySymbol],
  );

  const TokenInputWithCurrency = useCallback(
    (props: Omit<ModifiedNumberInputProps, 'endAdornment'>) => (
      <TokenInput endAdornment={token} {...props} />
    ),
    [token],
  );

  useEffect(() => {
    setMinPricePerOrderError(undefined);
    setMaxPricePerOrderError(undefined);

    if (minPricePerOrder > maxPricePerOrder) {
      setMinPricePerOrderError('Min per order cannot be greater than max per order');
      setMaxPricePerOrderError('Max per order cannot be less than min per order');
    } else if (maxPricePerOrder > maxPotentialOrderAmount) {
      setMaxPricePerOrderError(`Max per order cannot be greater than max potential order amount`);
    }
  }, [minPricePerOrder, maxPricePerOrder, maxPotentialOrderAmount]);

  const setMaxPricePerOrderToMaxPotentialOrderAmount = useCallback(() => {
    setMaxPricePerOrder(maxPotentialOrderAmount);
  }, [maxPotentialOrderAmount]);

  const setBothLimitsToMaxPotentialOrderAmount = useCallback(() => {
    setMinPricePerOrder(maxPotentialOrderAmount);
    setMaxPricePerOrder(maxPotentialOrderAmount);
  }, [maxPotentialOrderAmount]);

  const handleOnSubmit = () => {
    if (!isReadyToSubmit) return;

    const editedData: ListingEditData = {
      totalTokenAmount,
      token,
      currency,
      price,
      minPricePerOrder,
      maxPricePerOrder,
      action,
    };

    if (listing && modalAction === ListingModalAction.Edit) {
      const someDataChanged = Object.entries(editedData).some(
        ([key, value]) => value !== listing[key as keyof Listing],
      );

      // If no data changed, we simply close the modal
      if (!someDataChanged) modalProps.onClose();
    }

    onSubmit(editedData);
  };

  return (
    <Modal title={listingTitle} {...modalProps}>
      <Modal.Body>
        <div className={styles.flexContainer}>
          <BaseSelect
            label="Token"
            value={token}
            onChange={setToken}
            options={tokens}
            helperText={tokenHelperText}
          />
          <BaseSelect
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={currencies}
            helperText={currencyHelperText}
          />
        </div>
        <FiatInputWithCurrency
          label="Price Per Token / Rate"
          value={price}
          onChange={setPrice}
          helperText={priceHelperText}
        />
        <TokenInputWithCurrency
          label="Amount"
          value={totalTokenAmount}
          onChange={setTotalTokenAmount}
          helperText={amountHelperText}
        />
        <div className={styles.maxAmountContainer}>
          <ReadOnlyInput
            label="Max Potential Order Amount"
            value={maxPotentialOrderAmount}
            helperText={maxPotentialOrderAmountHelperText}
            endAdornment={currencySymbol}
          />
          <div className={styles.buttonsContainer}>
            <IconButtonWithTooltip
              tooltip="Set Max"
              onClick={setMaxPricePerOrderToMaxPotentialOrderAmount}
            >
              <FaLessThanEqual />
            </IconButtonWithTooltip>
            <IconButtonWithTooltip
              tooltip="Set Exact"
              onClick={setBothLimitsToMaxPotentialOrderAmount}
            >
              <FaEquals />
            </IconButtonWithTooltip>
          </div>
        </div>
        <div className={styles.flexContainer}>
          <FiatInputWithCurrency
            label="Min Per Order"
            value={minPricePerOrder}
            onChange={setMinPricePerOrder}
            helperText={minPricePerOrderHelperText}
            error={minPricePerOrderError}
          />
          <FiatInputWithCurrency
            label="Max Per Order"
            value={maxPricePerOrder}
            onChange={setMaxPricePerOrder}
            helperText={maxPricePerOrderHelperText}
            error={maxPricePerOrderError}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <ButtonWithTooltip
          disabled={!isReadyToSubmit}
          tooltip={buttonTooltip}
          placement="top"
          onClick={handleOnSubmit}
        >
          Save Changes
        </ButtonWithTooltip>
      </Modal.Footer>
    </Modal>
  );
}

export default ListingEditModal;
