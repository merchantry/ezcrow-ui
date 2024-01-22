import React, { useEffect, useState } from 'react';

import { priceFormat } from 'utils/helpers';
import { OrderAction } from 'utils/enums';

import styles from './OrdersInDisputeTable.module.scss';
import dummyOrders from './orders';
import tableStyles from 'scss/modules/Table.module.scss';
import StripedTable from 'components/StripedTable';
import { Order } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import { useTableSearchParams } from 'utils/hooks';
import ConfirmationModal from 'components/ConfirmationModal';
import triggerModal from 'utils/triggerModal';
import { getAllOrders, acceptDispute, rejectDispute } from 'web3/requests/orders';
import BaseButton from 'components/BaseButton';

interface OrdersInDisputeTableProps {
  filter?: OrderAction;
}

function OrdersInDisputeTable({ filter }: OrdersInDisputeTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { currency, token, sortBy, sortOrder, page } = useTableSearchParams();

  useEffect(() => {
    setIsFetching(true);
    getAllOrders(currency, token, sortBy, sortOrder, page).then(() => {
      setIsFetching(false);
      setOrders(
        dummyOrders
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
      );
    });
  }, [currency, filter, page, sortBy, sortOrder, token]);

  const onCancelOrder = (order: Order) => {
    triggerModal(ConfirmationModal, {
      title: `Cancel (Order ID: ${order.id})?`,
      text: 'Are you sure you want to cancel order in dispute',
      confirmText: 'Cancel Order',
      confirmColor: 'error',
      noCancelBtn: true,
    }).then(confirmed => {
      if (!confirmed) return;

      acceptDispute(order.id);
    });
  };

  const onCompleteOrder = (order: Order) => {
    triggerModal(ConfirmationModal, {
      title: `Complete (Order ID: ${order.id})?`,
      text: 'Are you sure you want to complete order in dispute',
      confirmText: 'Complete Order',
      confirmColor: 'info',
      noCancelBtn: true,
    }).then(confirmed => {
      if (!confirmed) return;

      rejectDispute(order.id);
    });
  };

  return (
    <StripedTable
      isFetching={isFetching}
      data={orders}
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
              {`${order.action} ${order.listing.token}`}
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
          label: 'Listing Creator',
          render: ({ listing: { creator } }) => <UserAddressCellData userAddress={creator} />,
        },
        {
          label: 'Order Creator',
          render: ({ creator }) => <UserAddressCellData userAddress={creator} />,
        },
        {
          label: '',
          colStyle: { width: 260 },
          render: order => (
            <div className={tableStyles.actions}>
              <BaseButton onClick={() => onCancelOrder(order)} color="error">
                Cancel
              </BaseButton>
              <BaseButton onClick={() => onCompleteOrder(order)} color="info">
                Complete
              </BaseButton>
            </div>
          ),
        },
      ]}
    />
  );
}

export default OrdersInDisputeTable;
