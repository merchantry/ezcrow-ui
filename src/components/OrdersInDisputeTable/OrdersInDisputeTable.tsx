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
import { useNetwork, useWeb3Signer } from 'components/ContextData/hooks';
import { useUserProfileModal } from 'utils/modalHooks';

interface OrdersInDisputeTableProps {
  filter?: ListingAction;
}

function OrdersInDisputeTable({ filter }: OrdersInDisputeTableProps) {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { triggerUserProfileModal } = useUserProfileModal();
  const [orders, isFetching] = useOrders(filter, OrderStatus.InDispute);

  const onCancelOrder = async (order: Order) => {
    if (!signer) return;

    const confirmed = await triggerModal(ConfirmationModal, {
      title: `Cancel (Order ID: ${order.id})?`,
      text: 'Are you sure you want to cancel order in dispute',
      confirmText: 'Cancel Order',
      noCancelBtn: true,
    });
    if (!confirmed) return;

    acceptDispute(order.token, order.currency, order.id, network, signer);
  };

  const onCompleteOrder = async (order: Order) => {
    if (!signer) return;

    const confirmed = await triggerModal(ConfirmationModal, {
      title: `Complete (Order ID: ${order.id})?`,
      text: 'Are you sure you want to complete order in dispute',
      confirmText: 'Complete Order',
      noCancelBtn: true,
    });
    if (!confirmed) return;

    rejectDispute(order.token, order.currency, order.id, network, signer);
  };

  const onAddressClick = async (address: string) => {
    triggerUserProfileModal(address);
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
          render: ({ listingCreator }) => (
            <UserAddressCellData
              userAddress={listingCreator}
              onClick={() => onAddressClick(listingCreator)}
            />
          ),
        },
        {
          label: 'Order Creator',
          render: ({ creator }) => (
            <UserAddressCellData userAddress={creator} onClick={() => onAddressClick(creator)} />
          ),
        },
        {
          label: '',
          colStyle: { width: 260 },
          render: order => (
            <div className={tableStyles.actions}>
              <BaseButton onClick={() => onCancelOrder(order)}>Cancel</BaseButton>
              <BaseButton onClick={() => onCompleteOrder(order)}>Complete</BaseButton>
            </div>
          ),
        },
      ]}
    />
  );
}

export default OrdersInDisputeTable;
