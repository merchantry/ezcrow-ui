import React, { useEffect, useState } from 'react';

import { decapitalize, priceFormat, run } from 'utils/helpers';
import { OrderAction, OrderCancelAction } from 'utils/enums';

import styles from './MyOrdersTable.module.scss';
import dummyOrders from './orders';
import tableStyles from 'scss/modules/Table.module.scss';
import StripedTable from 'components/StripedTable';
import { Order } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import OrderStatusCellData from './OrderStatusCellData';
import OrderActionButtons from './OrderActionButtons';
import { useTableSearchParams } from 'utils/hooks';
import ConfirmationModal from 'components/ConfirmationModal';
import triggerModal from 'utils/triggerModal';
import { FaRegHand } from 'react-icons/fa6';
import { rejectOrder, acceptOrder, getAllOrders } from 'web3/requests/orders';

interface MyOrdersTableProps {
  filter?: OrderAction;
}

function MyOrdersTable({ filter }: MyOrdersTableProps) {
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

  const onActionButtonClick = (order: Order, tooltip: string, buttonText: string) => {
    const isCancellingOrDisputing =
      tooltip === OrderCancelAction.Cancel || tooltip === OrderCancelAction.Dispute;

    const text = run(() => {
      switch (tooltip) {
        case OrderCancelAction.Cancel:
          return `Are you sure you want to cancel the trade?`;
        case OrderCancelAction.Dispute:
          return `Are you sure you want to raise a dispute?`;
        default:
          return `Are you sure you want to ${decapitalize(tooltip)}?`;
      }
    });

    triggerModal(ConfirmationModal, {
      title: `${buttonText} (Order ID: ${order.id})?`,
      text,
      confirmText: buttonText,
      confirmColor:
        order.action === OrderAction.Sell || isCancellingOrDisputing ? 'error' : 'success',
      noCancelBtn: true,
      confirmIcon: tooltip === OrderCancelAction.Dispute ? <FaRegHand /> : undefined,
    }).then(confirmed => {
      if (!confirmed) return;
      if (isCancellingOrDisputing) rejectOrder(order.id);
      else acceptOrder(order.id);
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
          label: 'Available/Total Amount',
          render: ({ listing: { availableAmount, totalAmount, token } }) =>
            `${availableAmount} ${token} / ${totalAmount} ${token}`,
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
          render: ({ listing: { creator } }) => <UserAddressCellData userAddress={creator} />,
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
