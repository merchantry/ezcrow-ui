import React from 'react';

import { maybePluralize, priceFormat } from 'utils/helpers';
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
    modalLoop(
      CreateOrderModal,
      {
        listing,
      },
      ConfirmationModal,
      orderAmount => ({
        title: `Create ${listing.action} Order?`,
        text: `Are you sure you want to create a ${listing.action} order for ${orderAmount} ${
          listing.token
        } ${maybePluralize(orderAmount, 'token')}?`,
        confirmText: 'Create Order',
        cancelText: 'Back',
        cancelStartIcon: <FaChevronLeft />,
      }),
    ).then(orderAmount => {
      if (!orderAmount) return;
      createOrder(listing.id, orderAmount);
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
          render: listing => <UserAddressCellData userAddress={listing.userAddress} />,
        },
        {
          label: '',
          colStyle: { width: 205 },
          render: listing => {
            const actionTitle = `${listing.action} ${listing.token}`;

            return (
              <div className={tableStyles.actions}>
                <IconButton className={styles.contactButton} title="Contact user">
                  <FaRegMessage />
                </IconButton>
                <BaseButton
                  onClick={() => onListingActionClick(listing)}
                  color={listing.action === ListingAction.Buy ? 'success' : 'error'}
                  title={actionTitle}
                >
                  {actionTitle}
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
