import React, { useMemo } from 'react';

import styles from './MyOrdersTable.module.scss';
import { Order } from 'utils/types';
import { OrderCancelAction, OrderStatus, UserType } from 'utils/enums';
import { maybePluralize, priceFormat } from 'utils/helpers';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { ButtonWithTooltipProps } from 'components/ButtonWithTooltip/ButtonWithTooltip';
import { FaXmark, FaRegHand } from 'react-icons/fa6';
import IconButtonWithTooltip from 'components/IconButtonWithTooltip';
import { getCurrentOrderStatus, getUserType, isUserBuying } from 'utils/orders';
import { useWeb3Signer } from 'components/ContextData/hooks';

interface OrderActionButtonsProps {
  order: Order;
  onClick: (order: Order, tooltip: string, buttonText: string) => void;
}

interface ButtonsComponentsProps extends Partial<Omit<ButtonWithTooltipProps, 'onClick'>> {
  actionDisabled?: boolean;
  cancelAction?: OrderCancelAction;

  onClick?: (tooltip: string, buttonText: string) => void;
}

function ButtonsComponents({
  children,
  actionDisabled = false,
  disabled,
  tooltip = '',
  cancelAction = OrderCancelAction.Cancel,
  onClick,
  ...rest
}: ButtonsComponentsProps) {
  const cancelActionIcon = useMemo(() => {
    switch (cancelAction) {
      case OrderCancelAction.Cancel:
        return <FaXmark />;
      case OrderCancelAction.Dispute:
        return <FaRegHand />;
    }
  }, [cancelAction]);

  const handleActionClick = () => {
    if (onClick) onClick(tooltip, children as string);
  };

  const handleCancelActionClick = () => {
    if (onClick) onClick(cancelAction, cancelAction);
  };

  return (
    <>
      <ButtonWithTooltip
        disabled={actionDisabled || disabled}
        tooltip={tooltip}
        onClick={handleActionClick}
        {...rest}
      >
        {children}
      </ButtonWithTooltip>
      <IconButtonWithTooltip
        color="error"
        tooltip={cancelAction}
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
  const signer = useWeb3Signer();
  const {
    userType,
    userIsBuyer,
    color,
    assetsAmountAndSymbol,
  }: {
    userType: UserType;
    userIsBuyer: boolean;
    color: 'success' | 'error';
    assetsAmountAndSymbol: string;
  } = useMemo(() => {
    const userType = getUserType(signer?.address ?? '', order);
    const userIsBuyer = isUserBuying(userType, order);

    return {
      userType,
      userIsBuyer,
      color: userIsBuyer ? 'success' : 'error',
      assetsAmountAndSymbol: userIsBuyer
        ? priceFormat(order.fiatAmount, order.currency)
        : `${order.tokenAmount} ${order.token} ${maybePluralize(order.tokenAmount, 'token')}`,
    };
  }, [signer, order]);

  const currentStatus = useMemo(() => getCurrentOrderStatus(order), [order]);

  const handleOnClick = (tooltip: string, buttonText: string) => {
    onClick(order, tooltip, buttonText);
  };

  switch (currentStatus) {
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
          switch (userIsBuyer) {
            case true:
              switch (currentStatus) {
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
                      disabled={currentStatus !== OrderStatus.TokensDeposited}
                      className={styles.orderButton}
                      color={color}
                      onClick={handleOnClick}
                    >
                      Payment Sent
                    </ButtonsComponents>
                  );
              }
            case false:
              switch (currentStatus) {
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
                      disabled={currentStatus !== OrderStatus.PaymentSent}
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
          switch (userIsBuyer) {
            case true:
              return (
                <ButtonsComponents
                  tooltip={`Confirm you have sent the ${assetsAmountAndSymbol} payment to the seller`}
                  disabled={currentStatus !== OrderStatus.AssetsConfirmed}
                  className={styles.orderButton}
                  color={color}
                  onClick={handleOnClick}
                >
                  Payment Sent
                </ButtonsComponents>
              );
            case false:
              switch (currentStatus) {
                case OrderStatus.RequestSent:
                case OrderStatus.AssetsConfirmed:
                  return (
                    <ButtonsComponents
                      tooltip={`Deposit ${assetsAmountAndSymbol}`}
                      disabled={currentStatus !== OrderStatus.AssetsConfirmed}
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
                      disabled={currentStatus !== OrderStatus.PaymentSent}
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
