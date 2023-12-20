import React, { useMemo } from 'react';

import { capitalize, decapitalize, priceFormat } from 'utils/helpers';
import { OrderAction } from 'utils/enums';

import styles from './MyOrdersTable.module.scss';
import orders from './orders';
import tableStyles from 'scss/modules/Table.module.scss';
import StripedTable from 'components/StripedTable';
import { Order } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import OrderStatusCellData from './OrderStatusCellData';
import OrderActionButtons from './OrderActionButtons';
import { useTableSearchParams } from 'utils/hooks';
import ConfirmationModal from 'components/ConfirmationModal';
import triggerModal from 'utils/triggerModal';

interface MyOrdersTableProps {
  filter?: OrderAction;
}

function MyOrdersTable({ filter }: MyOrdersTableProps) {
  const { currency, token, sortBy, sortOrder } = useTableSearchParams();

  const filteredItems = useMemo(
    () =>
      orders
        .filter(
          order =>
            order.listing.token === token &&
            order.listing.fiatCurrency === currency &&
            (filter ? order.action === filter : true),
        )
        .sort((a, b) => {
          const aValue = a.listing[sortBy];
          const bValue = b.listing[sortBy];

          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;

          return 0;
        }),
    [currency, filter, sortBy, sortOrder, token],
  );

  const onActionButtonClick = (order: Order, tooltip: string, buttonText: string) => {
    triggerModal(ConfirmationModal, {
      title: `${buttonText} ?`,
      text: `Are you sure you want to ${decapitalize(tooltip)}?`,
      confirmText: buttonText,
    }).then(result => {
      if (result) {
        console.log('confirmed', order);
      }
    });
  };

  return (
    <StripedTable
      data={filteredItems}
      getRowKey={(row: Order) => row.id}
      columnData={[
        {
          label: 'Order/Listing ID',
          render: order => `${order.id} / ${order.listing.id}`,
        },
        {
          label: 'Order Type',
          render: order => (
            <span className={`${styles.order} ${styles[order.action]}`}>
              {`${capitalize(order.action)} ${order.listing.token}`}
            </span>
          ),
        },
        {
          label: 'Order Amount/Price',
          render: ({ tokenAmount, fiatAmount, listing: { token, fiatCurrency } }) =>
            `${tokenAmount} ${token} / ${priceFormat(fiatAmount, fiatCurrency)}`,
        },
        {
          label: 'Price',
          className: tableStyles.price,
          render: ({ listing: { price, fiatCurrency } }) => `${price} ${fiatCurrency}`,
        },
        {
          label: 'Order status',
          render: order => <OrderStatusCellData order={order} />,
        },
        {
          label: 'Listing Creator',
          render: ({ listing: { userAddress } }) => (
            <UserAddressCellData userAddress={userAddress} />
          ),
        },
        {
          label: '',
          colStyle: { width: 260 },
          render: order => (
            <div className={tableStyles.actions}>
              <OrderActionButtons order={order} onClick={onActionButtonClick} />
            </div>
          ),
        },
      ]}
    />
  );
}

export default MyOrdersTable;
