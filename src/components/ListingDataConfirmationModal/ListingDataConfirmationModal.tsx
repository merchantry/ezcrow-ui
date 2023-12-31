import React, { useMemo } from 'react';

import styles from './ListingDataConfirmationModal.module.scss';
import { ModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import { Listing, ListingEditData } from 'utils/types';
import BaseButton from 'components/BaseButton';
import { FaChevronLeft, FaCheck } from 'react-icons/fa6';
import DataComparisonRow from './DataComparisonRow';
import { currencyToSymbol } from 'utils/helpers';
import { ListingAction } from 'utils/enums';

interface ListingDataConfirmationModalProps extends ModalProps<boolean> {
  listing?: Listing;
  listingEditData: ListingEditData;
}

function ListingDataConfirmationModal({
  onSubmit,
  listing,
  listingEditData,
  ...modalProps
}: ListingDataConfirmationModalProps) {
  const confirm = () => {
    onSubmit(true);
  };

  const back = () => {
    onSubmit(false);
  };

  const previousFiatCurrencySymbol = useMemo(() => {
    if (!listing) return undefined;
    return currencyToSymbol(listing.fiatCurrency);
  }, [listing]);

  const currentFiatCurrencySymbol = useMemo(
    () => currencyToSymbol(listingEditData.fiatCurrency),
    [listingEditData],
  );

  const title = useMemo(() => {
    switch (listingEditData.action) {
      case ListingAction.Buy:
        return 'Confirm Sell Listing Data';
      case ListingAction.Sell:
        return 'Confirm Buy Listing Data';
    }
  }, [listingEditData]);

  return (
    <Modal title={title} {...modalProps}>
      <Modal.Body>
        <div className={styles.listingData}>
          <DataComparisonRow
            label="Token"
            previous={listing?.token}
            current={listingEditData.token}
          />
          <DataComparisonRow
            label="Fiat Currency"
            previous={listing?.fiatCurrency}
            current={listingEditData.fiatCurrency}
            prevUnit={previousFiatCurrencySymbol}
            currentUnit={currentFiatCurrencySymbol}
          />
          <DataComparisonRow
            label="Total Amount"
            previous={listing?.totalAmount}
            current={listingEditData.totalAmount}
            prevUnit={listing?.token}
            currentUnit={listingEditData.token}
          />
          <DataComparisonRow
            label="Rate"
            previous={listing?.price}
            current={listingEditData.price}
            prevUnit={listing?.fiatCurrency}
            currentUnit={listingEditData.fiatCurrency}
            formatAsPrice
          />
          <DataComparisonRow
            label="Min Per Order"
            previous={listing?.minPerOrder}
            current={listingEditData.minPerOrder}
            prevUnit={listing?.fiatCurrency}
            currentUnit={listingEditData.fiatCurrency}
            formatAsPrice
          />
          <DataComparisonRow
            label="Max Per Order"
            previous={listing?.maxPerOrder}
            current={listingEditData.maxPerOrder}
            prevUnit={listing?.fiatCurrency}
            currentUnit={listingEditData.fiatCurrency}
            formatAsPrice
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <BaseButton startIcon={<FaChevronLeft />} color="error" onClick={back}>
          Back
        </BaseButton>
        <BaseButton endIcon={<FaCheck />} color="success" onClick={confirm}>
          Confirm
        </BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ListingDataConfirmationModal;
