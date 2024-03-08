import React from 'react';

import { mergeSearchParams, priceFormat } from 'utils/helpers';
import { ListingAction } from 'utils/enums';

import styles from './MyListingsTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import BaseButton from 'components/BaseButton';
import StripedTable from 'components/StripedTable';
import { Listing } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import triggerModal from 'utils/triggerModal';
import ConfirmationModal from 'components/ConfirmationModal';
import { confirmListingData } from 'utils/modals';
import { FaTrash } from 'react-icons/fa6';
import { useUserListings } from 'utils/dataHooks';
import {
  useCurrencyDecimalsStandard,
  useFormattedDropdownData,
  useTokenDecimalsStandard,
  useWeb3Signer,
} from 'components/ContextData/hooks';
import { approveToken, deleteListing, updateListing } from 'web3/requests/ezcrowRamp';
import { useNetwork } from 'utils/web3Hooks';
import { listingActionToNumber } from 'utils/listings';
import { useUserProfileModal } from 'utils/modalHooks';
import { useSearchParams } from 'react-router-dom';

interface MyListingsTableProps {
  filter?: ListingAction;
}

function MyListingsTable({ filter }: MyListingsTableProps) {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const [, setSearchParams] = useSearchParams();
  const [filteredListings, isFetching] = useUserListings(signer?.address, filter);
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();
  const { triggerUserProfileModal } = useUserProfileModal();

  const currencyToBigInt = useCurrencyDecimalsStandard();
  const tokenToBigInt = useTokenDecimalsStandard();

  const onEditListingClick = async (listing: Listing) => {
    if (!signer) return;
    confirmListingData({
      listingToEdit: listing,
      action: listing.action,
      tokens: tokenOptionsMap,
      currencies: currencyOptionsMap,
    }).then(async listingEditData => {
      if (!listingEditData) return;
      const {
        token,
        currency,
        action,
        price,
        totalTokenAmount: _totalTokenAmount,
        minPricePerOrder,
        maxPricePerOrder,
      } = listingEditData;

      const previousTokenAmount = tokenToBigInt(listing.totalTokenAmount);
      const totalTokenAmount = tokenToBigInt(_totalTokenAmount);

      if (action === ListingAction.Sell) {
        if (token !== listing.token || currency !== listing.currency)
          await approveToken(token, currency, totalTokenAmount, network, signer);
        else if (totalTokenAmount > previousTokenAmount)
          await approveToken(
            token,
            currency,
            totalTokenAmount - previousTokenAmount,
            network,
            signer,
          );
      }

      await updateListing(
        listing.token,
        listing.currency,
        listing.id,
        token,
        currency,
        listingActionToNumber(action),
        currencyToBigInt(price),
        totalTokenAmount,
        currencyToBigInt(minPricePerOrder),
        currencyToBigInt(maxPricePerOrder),
        network,
        signer,
      );

      setSearchParams(params => mergeSearchParams(params, { currency, token }));
    });
  };

  const onRemoveListingClick = (listing: Listing) => {
    if (!signer) return;
    triggerModal(ConfirmationModal, {
      title: `Remove Listing (ID: ${listing.id})?`,
      text: 'Are you sure you want to remove this listing?',
      confirmText: 'Remove',
      confirmIcon: <FaTrash />,
      confirmColor: 'error',
    }).then(confirmed => {
      if (!confirmed) return;

      deleteListing(listing.token, listing.currency, listing.id, network, signer);
    });
  };

  const onAddressClick = async (address: string) => {
    triggerUserProfileModal(address);
  };

  return (
    <StripedTable
      isFetching={isFetching}
      data={filteredListings}
      getRowKey={(row: Listing) => row.id}
      columnData={[
        {
          label: 'ID',
          render: listing => listing.id,
        },
        {
          label: 'Listing Type',
          render: listing => (
            <span className={`${styles.order} ${styles[listing.action]}`}>
              {`${listing.action} ${listing.token}`}
            </span>
          ),
        },
        {
          label: 'Price',
          className: tableStyles.price,
          render: listing => `${priceFormat(listing.price)} ${listing.currency}`,
        },
        {
          label: 'Available/Total Amount',
          render: ({ availableTokenAmount, totalTokenAmount, token }) =>
            `${availableTokenAmount} ${token} / ${totalTokenAmount} ${token}`,
        },
        {
          label: 'Limit Per Order',
          render: ({ minPricePerOrder, currency, maxPricePerOrder }) =>
            `${priceFormat(minPricePerOrder, currency)} - ${priceFormat(
              maxPricePerOrder,
              currency,
            )}`,
        },
        {
          label: 'Creator',
          render: listing => (
            <UserAddressCellData
              userAddress={listing.creator}
              onClick={() => onAddressClick(listing.creator)}
            />
          ),
        },
        {
          label: '',
          colStyle: { width: 230 },
          render: listing => (
            <div className={tableStyles.actions}>
              <BaseButton
                color="info"
                className={styles.edit}
                disabled={!listing.canBeEdited}
                onClick={() => onEditListingClick(listing)}
              >
                Edit
              </BaseButton>
              <BaseButton
                color="error"
                className={styles.remove}
                disabled={!listing.canBeRemoved}
                onClick={() => onRemoveListingClick(listing)}
              >
                Remove
              </BaseButton>
            </div>
          ),
        },
      ]}
    />
  );
}

export default MyListingsTable;
