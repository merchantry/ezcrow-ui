import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './ListingEditModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing, ListingEditData } from 'utils/types';
import { ListingAction, ListingModalAction } from 'utils/enums';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { currencyToSymbol, maybePluralize, opposite, roundTo } from 'utils/helpers';
import BaseSelect from 'components/BaseSelect';
import { NumberInputProps } from 'components/NumberInput/NumberInput';
import { ROUND_TO_FIAT } from 'utils/config';
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
  const [totalAmount, setTotalAmount] = useState<number>(
    data?.totalAmount ?? listing?.totalAmount ?? 10,
  );
  const [price, setPrice] = useState<number>(data?.price ?? listing?.price ?? 1);
  const [minPerOrder, setMinPerOrder] = useState<number>(
    data?.minPerOrder ?? listing?.minPerOrder ?? 10,
  );
  const [maxPerOrder, setMaxPerOrder] = useState<number>(
    data?.maxPerOrder ?? listing?.maxPerOrder ?? 10,
  );
  const [fiatCurrency, setFiatCurrency] = useState<string>(
    data?.fiatCurrency ?? listing?.fiatCurrency ?? currencyParam,
  );

  const [minPerOrderError, setMinPerOrderError] = useState<string | undefined>(undefined);
  const [maxPerOrderError, setMaxPerOrderError] = useState<string | undefined>(undefined);

  const listingTitle = useMemo(() => {
    const creatorAction = opposite(action, [ListingAction.Buy, ListingAction.Sell]);

    switch (modalAction) {
      case ListingModalAction.Edit:
        return `Edit ${creatorAction} Listing (ID: ${listing?.id})`;
      case ListingModalAction.CreateNew:
        return `Create New ${creatorAction} Listing`;
    }
  }, [action, listing, modalAction]);

  const buttonTooltip = useMemo(() => {
    if (action === ListingAction.Sell) {
      return undefined;
    }

    return `You will need to deposit ${totalAmount} ${token} ${maybePluralize(
      totalAmount,
      'token',
    )}`;
  }, [action, totalAmount, token]);

  const fiatCurrencySymbol = useMemo(() => currencyToSymbol(fiatCurrency), [fiatCurrency]);

  const maxPotentialOrderAmount = useMemo(() => {
    if (!price || !totalAmount) return 0;

    return roundTo(price * totalAmount, ROUND_TO_FIAT);
  }, [price, totalAmount]);

  const isReadyToSubmit = useMemo(
    () =>
      !!totalAmount &&
      !!price &&
      !!minPerOrder &&
      !!maxPerOrder &&
      !minPerOrderError &&
      !maxPerOrderError,
    [totalAmount, price, minPerOrder, maxPerOrder, minPerOrderError, maxPerOrderError],
  );

  const {
    tokenHelperText,
    currencyHelperText,
    priceHelperText,
    amountHelperText,
    maxPotentialOrderAmountHelperText,
    minPerOrderHelperText,
    maxPerOrderHelperText,
  } = useMemo(() => {
    switch (action) {
      case ListingAction.Buy:
        return {
          tokenHelperText: `The token you want to sell`,
          currencyHelperText: `Currency you want to sell it for`,
          priceHelperText: `The price you want to sell the token for`,
          amountHelperText: `The amount of ${token} you want to sell`,
          // eslint-disable-next-line max-len
          maxPotentialOrderAmountHelperText: `The maximum amount of ${fiatCurrency} you can earn on this listing (Rate * Amount)`,
          minPerOrderHelperText: `The minimum amount of ${fiatCurrency} a user can spend per order`,
          maxPerOrderHelperText: `The maximum amount of ${fiatCurrency} a user can spend per order`,
        };
      case ListingAction.Sell:
        return {
          tokenHelperText: `Token you want to buy`,
          currencyHelperText: `Currency you want to buy it with`,
          priceHelperText: `The price you want to buy the token for`,
          amountHelperText: `The amount of ${token} you want to buy`,
          // eslint-disable-next-line max-len
          maxPotentialOrderAmountHelperText: `The maximum amount of ${fiatCurrency} you can spend on this listing (Rate * Amount)`,
          minPerOrderHelperText: `The minimum amount of ${fiatCurrency} you want to spend per order`,
          maxPerOrderHelperText: `The maximum amount of ${fiatCurrency} you want to spend per order`,
        };
    }
  }, [action, fiatCurrency, token]);

  const FiatInputWithCurrency = useCallback(
    (props: Omit<ModifiedNumberInputProps, 'endAdornment'>) => (
      <FiatInput endAdornment={fiatCurrencySymbol} {...props} />
    ),
    [fiatCurrencySymbol],
  );

  const TokenInputWithCurrency = useCallback(
    (props: Omit<ModifiedNumberInputProps, 'endAdornment'>) => (
      <TokenInput endAdornment={token} {...props} />
    ),
    [token],
  );

  useEffect(() => {
    setMinPerOrderError(undefined);
    setMaxPerOrderError(undefined);

    if (minPerOrder > maxPerOrder) {
      setMinPerOrderError('Min per order cannot be greater than max per order');
      setMaxPerOrderError('Max per order cannot be less than min per order');
    } else if (maxPerOrder > maxPotentialOrderAmount) {
      setMaxPerOrderError(`Max per order cannot be greater than max potential order amount`);
    }
  }, [minPerOrder, maxPerOrder, maxPotentialOrderAmount]);

  const setMaxPerOrderToMaxPotentialOrderAmount = useCallback(() => {
    setMaxPerOrder(maxPotentialOrderAmount);
  }, [maxPotentialOrderAmount]);

  const setBothLimitsToMaxPotentialOrderAmount = useCallback(() => {
    setMinPerOrder(maxPotentialOrderAmount);
    setMaxPerOrder(maxPotentialOrderAmount);
  }, [maxPotentialOrderAmount]);

  const handleOnSubmit = () => {
    if (!isReadyToSubmit) return;

    const editedData: ListingEditData = {
      totalAmount,
      token,
      fiatCurrency,
      price,
      minPerOrder,
      maxPerOrder,
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
            value={fiatCurrency}
            onChange={setFiatCurrency}
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
          value={totalAmount}
          onChange={setTotalAmount}
          helperText={amountHelperText}
        />
        <div className={styles.maxAmountContainer}>
          <ReadOnlyInput
            label="Max Potential Order Amount"
            value={maxPotentialOrderAmount}
            helperText={maxPotentialOrderAmountHelperText}
            endAdornment={fiatCurrencySymbol}
          />
          <div className={styles.buttonsContainer}>
            <IconButtonWithTooltip
              tooltip="Set Max"
              onClick={setMaxPerOrderToMaxPotentialOrderAmount}
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
            value={minPerOrder}
            onChange={setMinPerOrder}
            helperText={minPerOrderHelperText}
            error={minPerOrderError}
          />
          <FiatInputWithCurrency
            label="Max Per Order"
            value={maxPerOrder}
            onChange={setMaxPerOrder}
            helperText={maxPerOrderHelperText}
            error={maxPerOrderError}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <ButtonWithTooltip
          disabled={!isReadyToSubmit}
          tooltip={buttonTooltip}
          placement="top"
          color="success"
          onClick={handleOnSubmit}
        >
          Save Changes
        </ButtonWithTooltip>
      </Modal.Footer>
    </Modal>
  );
}

export default ListingEditModal;
