import React, { useMemo } from 'react';

import styles from './MyOrdersTable.module.scss';
import { useUserWallet } from 'utils/hooks';
import { Order } from 'utils/types';
import { OrderAction, OrderCancelAction, OrderStatus, UserType } from 'utils/enums';
import { maybePluralize, priceFormat } from 'utils/helpers';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { ButtonWithTooltipProps } from 'components/ButtonWithTooltip/ButtonWithTooltip';
import { FaXmark, FaRegHand } from 'react-icons/fa6';
import IconButtonWithTooltip from 'components/IconButtonWithTooltip';

interface OrderActionButtonsProps {
  order: Order;
  onClick: (order: Order, tooltip: string, buttonText: string) => void;
}

interface ButtonsComponentsProps extends Partial<Omit<ButtonWithTooltipProps, 'onClick'>> {
  cancelAction?: OrderCancelAction;

  onClick?: (tooltip: string, buttonText: string) => void;
}

function ButtonsComponents({
  children,
  disabled,
  tooltip = '',
  cancelAction = OrderCancelAction.Cancel,
  onClick,
  ...rest
}: ButtonsComponentsProps) {
  const { cancelActionTooltip, cancelActionIcon } = useMemo(() => {
    switch (cancelAction) {
      case OrderCancelAction.Cancel:
        return {
          cancelActionTooltip: 'Cancel Trade',
          cancelActionIcon: <FaXmark />,
        };
      case OrderCancelAction.Dispute:
        return {
          cancelActionTooltip: 'Raise A Dispute',
          cancelActionIcon: <FaRegHand />,
        };
    }
  }, [cancelAction]);

  const handleActionClick = () => {
    if (onClick) onClick(tooltip, children as string);
  };

  const handleCancelActionClick = () => {
    if (onClick) onClick(cancelActionTooltip, cancelActionTooltip);
  };

  return (
    <>
      <ButtonWithTooltip
        disabled={disabled}
        tooltip={tooltip}
        onClick={handleActionClick}
        {...rest}
      >
        {children}
      </ButtonWithTooltip>
      <IconButtonWithTooltip
        color="error"
        tooltip={cancelActionTooltip}
        disabled={disabled}
        className={styles.cancelButton}
        onClick={handleCancelActionClick}
      >
        {cancelActionIcon}
      </IconButtonWithTooltip>
    </>
  );
}

function OrderActionButtons({ order, onClick }: OrderActionButtonsProps) {
  const { address } = useUserWallet();
  const userType =
    order.listing.userAddress === address ? UserType.ListingCreator : UserType.OrderCreator;
  const color = order.action === OrderAction.Buy ? 'success' : 'error';
  const assetsAmountAndSymbol =
    order.action === OrderAction.Buy
      ? priceFormat(order.fiatAmount, order.listing.fiatCurrency)
      : `${order.tokenAmount} ${order.listing.token} ${maybePluralize(order.tokenAmount, 'token')}`;

  const handleOnClick = (tooltip: string, buttonText: string) => {
    onClick(order, tooltip, buttonText);
  };

  switch (order.status) {
    case OrderStatus.InDispute:
      return (
        <ButtonsComponents disabled className={styles.orderButton} color={color}>
          In Dispute
        </ButtonsComponents>
      );

    case OrderStatus.Cancelled:
      return (
        <ButtonsComponents disabled className={styles.orderButton} color={color}>
          Cancelled
        </ButtonsComponents>
      );

    case OrderStatus.Completed:
      return (
        <ButtonsComponents disabled className={styles.orderButton} color={color}>
          Completed
        </ButtonsComponents>
      );
    default:
      switch (userType) {
        case UserType.ListingCreator:
          switch (order.action) {
            case OrderAction.Buy:
              switch (order.status) {
                case OrderStatus.RequestSent:
                  return (
                    <ButtonsComponents
                      tooltip={`Confirm the requested ${assetsAmountAndSymbol}`}
                      className={styles.orderButton}
                      color={color}
                      onClick={handleOnClick}
                    >
                      Confirm Funds
                    </ButtonsComponents>
                  );
                default:
                  return (
                    <ButtonsComponents
                      tooltip={`Confirm you have sent the ${assetsAmountAndSymbol} payment to the seller`}
                      disabled={order.status !== OrderStatus.TokensDeposited}
                      className={styles.orderButton}
                      color={color}
                      onClick={handleOnClick}
                    >
                      Payment Sent
                    </ButtonsComponents>
                  );
              }
            case OrderAction.Sell:
              switch (order.status) {
                case OrderStatus.RequestSent:
                  return (
                    <ButtonsComponents
                      tooltip={`Confirm the requested ${assetsAmountAndSymbol}`}
                      className={styles.orderButton}
                      color={color}
                      onClick={handleOnClick}
                    >
                      Confirm Tokens
                    </ButtonsComponents>
                  );
                default:
                  return (
                    <ButtonsComponents
                      tooltip={`Release the ${assetsAmountAndSymbol} to the buyer`}
                      disabled={order.status !== OrderStatus.PaymentSent}
                      className={styles.orderButton}
                      color={color}
                      cancelAction={OrderCancelAction.Dispute}
                      onClick={handleOnClick}
                    >
                      Release Tokens
                    </ButtonsComponents>
                  );
              }
          }
          break;
        case UserType.OrderCreator:
          switch (order.action) {
            case OrderAction.Buy:
              return (
                <ButtonsComponents
                  tooltip={`Confirm you have sent the ${assetsAmountAndSymbol} payment to the seller`}
                  disabled={order.status !== OrderStatus.AssetsConfirmed}
                  className={styles.orderButton}
                  color={color}
                  onClick={handleOnClick}
                >
                  Payment Sent
                </ButtonsComponents>
              );
            case OrderAction.Sell:
              switch (order.status) {
                case OrderStatus.RequestSent:
                case OrderStatus.AssetsConfirmed:
                  return (
                    <ButtonsComponents
                      tooltip={`Deposit ${assetsAmountAndSymbol}`}
                      disabled={order.status !== OrderStatus.AssetsConfirmed}
                      className={styles.orderButton}
                      color={color}
                      onClick={handleOnClick}
                    >
                      Deposit Tokens
                    </ButtonsComponents>
                  );
                default:
                  return (
                    <ButtonsComponents
                      tooltip={`Release the ${assetsAmountAndSymbol} to the buyer`}
                      disabled={order.status !== OrderStatus.PaymentSent}
                      className={styles.orderButton}
                      color={color}
                      cancelAction={OrderCancelAction.Dispute}
                      onClick={handleOnClick}
                    >
                      Release Tokens
                    </ButtonsComponents>
                  );
              }
          }
          break;
      }
      break;
  }
}

export default OrderActionButtons;
