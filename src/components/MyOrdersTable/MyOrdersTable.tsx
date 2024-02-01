import React from 'react';

import { decapitalize, opposite, priceFormat, roundTo, run } from 'utils/helpers';
import { ListingAction, OrderCancelAction, OrderStatus, UserType } from 'utils/enums';

import styles from './MyOrdersTable.module.scss';
import tableStyles from 'scss/modules/Table.module.scss';
import StripedTable from 'components/StripedTable';
import { Order } from 'utils/types';
import UserAddressCellData from 'components/UserAddressCellData';
import OrderStatusCellData from './OrderStatusCellData';
import OrderActionButtons from './OrderActionButtons';
import ConfirmationModal from 'components/ConfirmationModal';
import triggerModal from 'utils/triggerModal';
import { FaRegHand } from 'react-icons/fa6';
import { useUserOrders } from 'utils/dataHooks';
import { useTokenDecimalsStandard, useWeb3Signer } from 'components/ContextData/hooks';
import { approveToken, signAndAcceptOrder, signAndRejectOrder } from 'web3/requests/ezcrowRamp';
import { useTableSearchParams } from 'utils/hooks';
import { useNetwork } from 'utils/web3Hooks';
import { getCurrentOrderStatus } from 'utils/orders';

interface MyOrdersTableProps {
  filter?: ListingAction;
}

function MyOrdersTable({ filter }: MyOrdersTableProps) {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { token, currency } = useTableSearchParams();
  const [orders, isFetching, refresh] = useUserOrders(signer?.address, filter);

  const tokenToBigInt = useTokenDecimalsStandard();

  const onActionButtonClick = (order: Order, tooltip: string, buttonText: string) => {
    if (!signer) return;
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
        order.listingAction === ListingAction.Sell || isCancellingOrDisputing ? 'error' : 'success',
      noCancelBtn: true,
      confirmIcon: tooltip === OrderCancelAction.Dispute ? <FaRegHand /> : undefined,
    }).then(async confirmed => {
      if (!confirmed) return;
      const userType =
        signer.address === order.listingCreator ? UserType.ListingCreator : UserType.OrderCreator;
      const orderStatus = getCurrentOrderStatus(order);
      const listingAction = order.listingAction;

      if (
        userType === UserType.OrderCreator &&
        orderStatus === OrderStatus.AssetsConfirmed &&
        listingAction === ListingAction.Buy
      ) {
        await approveToken(token, currency, tokenToBigInt(order.tokenAmount), network, signer);
      }

      const signatureArgs = [token, currency, order.id, network, signer] as const;
      const promise = isCancellingOrDisputing
        ? signAndRejectOrder(...signatureArgs)
        : signAndAcceptOrder(...signatureArgs);

      promise.then(refresh);
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
          render: order => {
            const orderAction =
              order.listingCreator === signer?.address
                ? order.listingAction
                : opposite(order.listingAction, [ListingAction.Buy, ListingAction.Sell]);
            return (
              <span className={`${styles.order} ${styles[orderAction]}`}>
                {`${orderAction} ${order.token}`}
              </span>
            );
          },
        },
        {
          label: 'Price',
          className: tableStyles.price,
          render: ({ tokenAmount, fiatAmount, currency }) =>
            `${roundTo(fiatAmount / tokenAmount, 2)} ${currency}`,
        },
        {
          label: 'Order Amount/Price',
          render: ({ tokenAmount, fiatAmount, token, currency }) =>
            `${tokenAmount} ${token} / ${priceFormat(fiatAmount, currency)}`,
        },
        {
          label: 'Order status',
          render: order => <OrderStatusCellData order={order} />,
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
              <OrderActionButtons order={order} onClick={onActionButtonClick} />
            </div>
          ),
        },
      ]}
    />
  );
}

export default MyOrdersTable;
