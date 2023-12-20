import React, { useMemo, useState } from 'react';

import styles from './ListingEditModal.module.scss';
import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing } from 'utils/types';
import { ListingAction, ListingModalAction } from 'utils/enums';
import BaseInput from 'components/BaseInput';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { currencyToSymbol, maybePluralize } from 'utils/helpers';
import BaseSelect from 'components/BaseSelect';
import { useTableSearchParams } from 'utils/hooks';

type ListingEditData = Omit<Listing, 'id' | 'hasOrders' | 'userAddress' | 'availableAmount'>;

interface ListingEditModalProps extends ModalProps<ListingEditData> {
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
  onClose,
  action,
  modalAction,
  currencies,
  tokens,
  listing,
  tokenParam = 'USDT',
  currencyParam = 'USD',
}: ListingEditModalProps) {
  const [token, setToken] = useState<string>(listing?.token ?? tokenParam);
  const [totalAmount, setTotalAmount] = useState<number>(listing?.totalAmount ?? 10);
  const [price, setPrice] = useState<number>(listing?.price ?? 1);
  const [minPerOrder, setMinPerOrder] = useState<number>(listing?.minPerOrder ?? 10);
  const [maxPerOrder, setMaxPerOrder] = useState<number>(listing?.maxPerOrder ?? 100);
  const [fiatCurrency, setFiatCurrency] = useState<string>(listing?.fiatCurrency ?? currencyParam);

  const [priceError, setPriceError] = useState<string | undefined>();

  const { listingTitle, buttonText, buttonColor, buttonTooltip } = useMemo(() => {
    const buttonAction = modalAction === ListingModalAction.CreateNew ? 'Create New' : 'Edit';

    switch (action) {
      case ListingAction.Buy:
        return {
          listingTitle: 'Sell Listing',
          buttonText: `${buttonAction} Sell Listing`,
          buttonColor: 'error' as const,
          buttonTooltip: totalAmount
            ? `You will need to deposit ${totalAmount} ${token} ${maybePluralize(
                totalAmount,
                'token',
              )}`
            : undefined,
        };
      case ListingAction.Sell:
        return {
          listingTitle: 'Buy Listing',
          buttonText: `${buttonAction} Buy Listing`,
          buttonColor: 'success' as const,
          buttonTooltip: undefined,
        };
    }
  }, [action, modalAction, token, totalAmount]);

  const fiatCurrencySymbol = useMemo(() => currencyToSymbol(fiatCurrency), [fiatCurrency]);

  const isReadyToSubmit = useMemo(
    () => !!totalAmount && !!price && !!minPerOrder && !!maxPerOrder,
    [totalAmount, price, minPerOrder, maxPerOrder],
  );

  const rateOnBlur = () => {
    setPriceError('ah shit');
  };

  const {
    tokenHelperText,
    currencyHelperText,
    priceHelperText,
    amountHelperText,
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
          minPerOrderHelperText: `The minimum amount of ${fiatCurrency} per order`,
          maxPerOrderHelperText: `The maximum amount of ${fiatCurrency} per order`,
        };
      case ListingAction.Sell:
        return {
          tokenHelperText: `Token you want to buy`,
          currencyHelperText: `Currency you want to buy it with`,
          priceHelperText: `The rate at which you want to buy the token`,
          amountHelperText: `The amount of ${token} you want to buy`,
          minPerOrderHelperText: `The minimum amount of ${fiatCurrency} per order`,
          maxPerOrderHelperText: `The maximum amount of ${fiatCurrency} per order`,
        };
    }
  }, [action, fiatCurrency, token]);

  const handleOnSubmit = () => {
    if (!totalAmount || !price || !minPerOrder || !maxPerOrder) return;

    onSubmit({
      totalAmount,
      token,
      fiatCurrency,
      price,
      minPerOrder,
      maxPerOrder,
      action,
    });
  };

  return (
    <Modal title={listingTitle} onClose={onClose}>
      <Modal.Body>
        <div className={styles.inputsContainer}>
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
          <BaseInput<number>
            type="number"
            label="Rate"
            value={price}
            onChange={setPrice}
            endAdornment={fiatCurrencySymbol}
            helperText={priceHelperText}
            onBlur={rateOnBlur}
            error={priceError}
          />
          <BaseInput<number>
            type="number"
            label="Amount"
            value={totalAmount}
            onChange={setTotalAmount}
            endAdornment={token}
            helperText={amountHelperText}
          />
          <div className={styles.flexContainer}>
            <BaseInput<number>
              type="number"
              label="Min Per Order"
              value={minPerOrder}
              onChange={setMinPerOrder}
              endAdornment={fiatCurrencySymbol}
              helperText={minPerOrderHelperText}
            />
            <BaseInput<number>
              type="number"
              label="Max Per Order"
              value={maxPerOrder}
              onChange={setMaxPerOrder}
              endAdornment={fiatCurrencySymbol}
              helperText={maxPerOrderHelperText}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <ButtonWithTooltip
          disabled={!isReadyToSubmit}
          tooltip={buttonTooltip}
          placement="top"
          color={buttonColor}
          onClick={handleOnSubmit}
        >
          {buttonText}
        </ButtonWithTooltip>
      </Modal.Footer>
    </Modal>
  );
}

export default ListingEditModal;
