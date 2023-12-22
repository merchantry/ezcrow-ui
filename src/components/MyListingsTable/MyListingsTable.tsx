import React from 'react';

import { opposite, priceFormat } from 'utils/helpers';
import { ListingAction } from 'utils/enums';

import styles from './MyListingsTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import BaseButton from 'components/BaseButton';
import StripedTable from 'components/StripedTable';
import { Listing } from 'utils/types';
import { useFilteredListings } from 'utils/hooks';
import UserAddressCellData from 'components/UserAddressCellData';
import triggerModal from 'utils/triggerModal';
import ConfirmationModal from 'components/ConfirmationModal';
import { useFormattedDropdownData } from 'components/ContextData/ContextData';
import { confirmListingData } from 'utils/modals';
import { FaTrash } from 'react-icons/fa6';
import { editListing, removeListing } from 'web3/requests/listings';

interface MyListingsTableProps {
  filter?: ListingAction;
}

function MyListingsTable({ filter }: MyListingsTableProps) {
  const [filteredListings, isFetching] = useFilteredListings(filter);
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();

  const onEditListingClick = async (listing: Listing) => {
    confirmListingData({
      listingToEdit: listing,
      action: listing.action,
      tokens: tokenOptionsMap,
      currencies: currencyOptionsMap,
    }).then(listingEditData => {
      if (!listingEditData) return;
      editListing(listing.id, listingEditData);
    });
  };

  const onRemoveListingClick = (listing: Listing) => {
    if (listing.hasOrders) return;

    triggerModal(ConfirmationModal, {
      title: `Remove Listing (ID: ${listing.id})?`,
      text: 'Are you sure you want to remove this listing?',
      confirmText: 'Remove',
      confirmIcon: <FaTrash />,
      confirmColor: 'error',
      cancelColor: 'primary',
    }).then(confirmed => {
      if (!confirmed) return;
      removeListing(listing.id);
    });
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
          render: listing => {
            // When you create a buy listing, the listing.action for the user is ListingAction.Sell
            // When you create a sell listing, the listing.action for the user is ListingAction.Buy
            const creatorAction = opposite(listing.action, [ListingAction.Buy, ListingAction.Sell]);

            return (
              <span className={`${styles.order} ${styles[creatorAction]}`}>
                {`${creatorAction} ${listing.token}`}
              </span>
            );
          },
        },
        {
          label: 'Price',
          className: tableStyles.price,
          render: listing => `${listing.price} ${listing.fiatCurrency}`,
        },
        {
          label: 'Available/Total Amount',
          render: ({ availableAmount, totalAmount, token }) =>
            `${availableAmount} ${token} / ${totalAmount} ${token}`,
        },
        {
          label: 'Limit Per Order',
          render: ({ minPerOrder, fiatCurrency, maxPerOrder }) =>
            `${priceFormat(minPerOrder, fiatCurrency)} - ${priceFormat(maxPerOrder, fiatCurrency)}`,
        },
        {
          label: 'Creator',
          render: listing => <UserAddressCellData userAddress={listing.userAddress} />,
        },
        {
          label: '',
          colStyle: { width: 225 },
          render: listing => (
            <div className={tableStyles.actions}>
              <BaseButton
                color="info"
                disabled={listing.hasOrders}
                className={styles.edit}
                onClick={() => onEditListingClick(listing)}
              >
                Edit
              </BaseButton>
              <BaseButton
                color="error"
                disabled={listing.hasOrders}
                className={styles.remove}
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
