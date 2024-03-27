import React from 'react';

import Chip from 'components/Chip';
import styles from './MyOrdersTable.module.scss';
import { ListingAction, OrderStatus, UserType } from 'utils/enums';
import { Order, PerOrderData } from 'utils/types';
import { getOrderData } from 'utils/orders';
import { FaInfo } from 'react-icons/fa6';
import { ColorType } from 'mui/helpers';
import { useWeb3Signer } from 'components/ContextData/hooks';

interface OrderStatusProps {
  order: Order;
}

type ChipData = {
  color: ColorType;
  label: string;
  tooltip: string;
};

const CHIP_DATA: PerOrderData<ChipData> = {
  [OrderStatus.RequestSent]: {
    color: 'warning',
    label: {
      [UserType.ListingCreator]: 'Request Received',
      [UserType.OrderCreator]: 'Request Sent',
    },
    tooltip: {
      [ListingAction.Sell]: {
        [UserType.ListingCreator]:
          'You received a request to sell tokens. To proceed, confirm the requested tokens.',
        [UserType.OrderCreator]:
          // eslint-disable-next-line max-len
          'You sent a request to buy tokens. The order is currently waiting on the seller to confirm the requested tokens.',
      },
      [ListingAction.Buy]: {
        [UserType.ListingCreator]:
          'You received a request to buy tokens. To proceed, confirm the requested funds.',
        [UserType.OrderCreator]:
          // eslint-disable-next-line max-len
          'You sent a request to sell tokens. The order is currently waiting on the buyer to confirm the requested funds.',
      },
    },
  },
  [OrderStatus.AssetsConfirmed]: {
    color: 'warning',
    label: 'Confirmed',
    tooltip: {
      [ListingAction.Sell]: {
        [UserType.ListingCreator]:
          // eslint-disable-next-line max-len
          'You confirmed the requested tokens. The order is currently waiting on the buyer to send and confirm the payment.',
        [UserType.OrderCreator]:
          'The seller confirmed the requested tokens. Send the payment and click on "Payment Sent" to proceed.',
      },
      [ListingAction.Buy]: {
        [UserType.ListingCreator]:
          'You confirmed the requested funds. The order is currently waiting on the seller to deposit the tokens.',
        [UserType.OrderCreator]:
          'The buyer confirmed the requested funds. Deposit the tokens to proceed.',
      },
    },
  },
  [OrderStatus.TokensDeposited]: {
    color: 'warning',
    label: 'Tokens Deposited',
    tooltip: {
      [ListingAction.Sell]: {
        [UserType.ListingCreator]: '', // Empty
        [UserType.OrderCreator]: '', // Empty
      },
      [ListingAction.Buy]: {
        [UserType.ListingCreator]:
          'The seller deposited the tokens. Send the payment and click on "Payment Sent" to proceed.',
        [UserType.OrderCreator]:
          'You deposited the tokens. The order is currently waiting on the buyer to send and confirm the payment.',
      },
    },
  },
  [OrderStatus.PaymentSent]: {
    color: 'warning',
    label: {
      [ListingAction.Sell]: {
        [UserType.ListingCreator]: 'Payment Received',
        [UserType.OrderCreator]: 'Payment Sent',
      },
      [ListingAction.Buy]: {
        [UserType.ListingCreator]: 'Payment Sent',
        [UserType.OrderCreator]: 'Payment Received',
      },
    },
    tooltip: {
      [ListingAction.Sell]: {
        [UserType.ListingCreator]:
          'The buyer sent the payment. Release the tokens only once you have confirmed the payment.',
        [UserType.OrderCreator]:
          'You sent the payment. When the seller confirms the payment, the order will be completed.',
      },
      [ListingAction.Buy]: {
        [UserType.ListingCreator]:
          'You sent the payment. When the seller confirms the payment, the order will be completed.',
        [UserType.OrderCreator]:
          'The buyer sent the payment. Release the tokens only once you have confirmed the payment.',
      },
    },
  },
  [OrderStatus.Completed]: {
    color: 'success',
    label: 'Completed',
    tooltip: 'The order has been completed. All assets have been transferred to their new owners',
  },
  [OrderStatus.InDispute]: {
    color: 'error',
    label: 'In Dispute',
    tooltip:
      // eslint-disable-next-line max-len
      'A dispute was raised on this order. One of our admins will review it and either cancel the trade or release the funds.',
  },
  [OrderStatus.Cancelled]: {
    color: 'error',
    label: 'Cancelled',
    tooltip:
      'The order has been cancelled and all assets involved have been returned to their original owners',
  },
};

function OrderStatusCellData({ order }: OrderStatusProps) {
  const signer = useWeb3Signer();
  const { color, label, tooltip } = getOrderData(
    order,
    order.creator === signer?.address ? UserType.OrderCreator : UserType.ListingCreator,
    CHIP_DATA,
  );

  return (
    <div className={styles.chipContainer}>
      <Chip
        icon={<FaInfo />}
        color={color}
        label={label}
        tooltip={tooltip}
        tooltipPlacement="right"
      />
    </div>
  );
}

export default OrderStatusCellData;
