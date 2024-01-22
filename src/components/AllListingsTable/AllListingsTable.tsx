import React from 'react';

import { decapitalize, opposite, priceFormat } from 'utils/helpers';
import { ListingAction } from 'utils/enums';
import { FaRegMessage } from 'react-icons/fa6';

import styles from './AllListingsTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import BaseButton from 'components/BaseButton';
import IconButton from 'components/IconButton';
import StripedTable from 'components/StripedTable';
import { Listing } from 'utils/types';
import { useFilteredListings } from 'utils/hooks';
import UserAddressCellData from 'components/UserAddressCellData';
import CreateOrderModal from 'components/CreateOrderModal';
import ConfirmationModal from 'components/ConfirmationModal';
import { FaChevronLeft } from 'react-icons/fa6';
import { modalLoop } from 'utils/modals';
import { createOrder } from 'web3/requests/orders';

interface AllListingsTableProps {
  filter?: ListingAction;
}

function AllListingsTable({ filter }: AllListingsTableProps) {
  const [filteredListings, isFetching] = useFilteredListings(filter);

  const onListingActionClick = async (listing: Listing) => {
    const userAction = opposite(listing.action, [ListingAction.Sell, ListingAction.Buy]);
    return modalLoop(
      CreateOrderModal,
      {
        listing,
      },
      ConfirmationModal,
      ({ orderAmount, orderCost }) => ({
        title: `Create ${userAction} Order?`,
        text: `Are you sure you want to create a ${decapitalize(
          userAction,
        )} order for ${orderAmount} ${listing.token}  (${priceFormat(
          orderCost,
          listing.fiatCurrency,
        )})?`,
        confirmText: 'Create Order',
        cancelText: 'Back',
        cancelStartIcon: <FaChevronLeft />,
      }),
    ).then(createOrderData => {
      if (!createOrderData) return;
      createOrder(listing.id, createOrderData.orderAmount);
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
          render: listing => <UserAddressCellData userAddress={listing.creator} />,
        },
        {
          label: '',
          colStyle: { width: 205 },
          render: listing => {
            const action = opposite(listing.action, [ListingAction.Sell, ListingAction.Buy]);
            const buttonTitle = `${action} ${listing.token}`;

            return (
              <div className={tableStyles.actions}>
                <IconButton className={styles.contactButton} title="Contact user">
                  <FaRegMessage />
                </IconButton>
                <BaseButton
                  onClick={() => onListingActionClick(listing)}
                  color={action === ListingAction.Sell ? 'error' : 'success'}
                  title={buttonTitle}
                >
                  {buttonTitle}
                </BaseButton>
              </div>
            );
          },
        },
      ]}
    />
  );
}

export default AllListingsTable;
