import React from 'react';

import { capitalize, priceFormat } from 'utils/helpers';
import { ListingAction } from 'utils/enums';
import { FaRegMessage } from 'react-icons/fa6';

import styles from './AllListingsTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import listings from './listings';
import BaseButton from 'components/BaseButton';
import IconButton from 'components/IconButton';
import StripedTable from 'components/StripedTable';
import { Listing } from 'utils/types';
import { useFilteredListings } from 'utils/hooks';
import UserAddressCellData from 'components/UserAddressCellData';

interface AllListingsTableProps {
  filter?: ListingAction;
}

function AllListingsTable({ filter }: AllListingsTableProps) {
  const filteredListings = useFilteredListings(listings, filter);

  return (
    <StripedTable
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
            const actionTitle = `${capitalize(listing.action)} ${listing.token}`;

            return (
              <div className={tableStyles.actions}>
                <IconButton className={styles.contactButton} title="Contact user">
                  <FaRegMessage />
                </IconButton>
                <BaseButton
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
