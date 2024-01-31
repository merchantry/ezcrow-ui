import React from 'react';

import { priceFormat } from 'utils/helpers';

import styles from './OrdersInDisputeTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import StripedTable from 'components/StripedTable';
import { Order } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import ConfirmationModal from 'components/ConfirmationModal';
import triggerModal from 'utils/triggerModal';
import BaseButton from 'components/BaseButton';
import { ListingAction, OrderStatus } from 'utils/enums';
import { useOrders } from 'utils/dataHooks';
import { acceptDispute, rejectDispute } from 'web3/requests/ezcrowRamp';
import { useNetwork } from 'utils/web3Hooks';
import { useWeb3Signer } from 'components/ContextData/hooks';
import { useTableSearchParams } from 'utils/hooks';

interface OrdersInDisputeTableProps {
  filter?: ListingAction;
}

function OrdersInDisputeTable({ filter }: OrdersInDisputeTableProps) {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { token, currency } = useTableSearchParams();
  const [orders, isFetching, refresh] = useOrders(filter, OrderStatus.InDispute);

  const onCancelOrder = (order: Order) => {
    if (!signer) return;
    triggerModal(ConfirmationModal, {
      title: `Cancel (Order ID: ${order.id})?`,
      text: 'Are you sure you want to cancel order in dispute',
      confirmText: 'Cancel Order',
      confirmColor: 'error',
      noCancelBtn: true,
    }).then(confirmed => {
      if (!confirmed) return;

      acceptDispute(token, currency, order.id, network, signer).then(refresh);
    });
  };

  const onCompleteOrder = (order: Order) => {
    if (!signer) return;
    triggerModal(ConfirmationModal, {
      title: `Complete (Order ID: ${order.id})?`,
      text: 'Are you sure you want to complete order in dispute',
      confirmText: 'Complete Order',
      confirmColor: 'info',
      noCancelBtn: true,
    }).then(confirmed => {
      if (!confirmed) return;

      rejectDispute(token, currency, order.id, network, signer).then(refresh);
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
          render: order => `${order.id} / ${order.listingId}`,
        },
        {
          label: 'Order Type',
          render: order => (
            <span className={`${styles.order} ${styles[order.listingAction]}`}>
              {`${order.listingAction} ${order.token}`}
            </span>
          ),
        },
        {
          label: 'Order Amount/Price',
          render: ({ tokenAmount, fiatAmount, token, currency }) =>
            `${tokenAmount} ${token} / ${priceFormat(fiatAmount, currency)}`,
        },
        {
          label: 'Listing Creator',
          render: ({ listingCreator }) => <UserAddressCellData userAddress={listingCreator} />,
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
