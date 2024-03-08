import React from 'react';

import { decapitalize, opposite, priceFormat } from 'utils/helpers';
import { ListingAction } from 'utils/enums';

import tableStyles from 'scss/modules/Table.module.scss';
import BaseButton from 'components/BaseButton';
import StripedTable from 'components/StripedTable';
import { Listing } from 'utils/types';
import { useTableSearchParams } from 'utils/hooks';
import UserAddressCellData from 'components/UserAddressCellData';
import CreateOrderModal from 'components/CreateOrderModal';
import ConfirmationModal from 'components/ConfirmationModal';
import { FaChevronLeft } from 'react-icons/fa6';
import { modalLoop } from 'utils/modals';
import { useListings } from 'utils/dataHooks';
import { createOrder } from 'web3/requests/ezcrowRamp';
import { useTokenDecimalsStandard, useWeb3Signer } from 'components/ContextData/hooks';
import { useNetwork } from 'utils/web3Hooks';
import { ColorType } from 'mui/helpers';
import { useUserProfileModal } from 'utils/modalHooks';

interface AllListingsTableProps {
  filter?: ListingAction;
}

function AllListingsTable({ filter }: AllListingsTableProps) {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const [listings, isFetching] = useListings(filter);
  const { token, currency } = useTableSearchParams();
  const { triggerUserProfileModal } = useUserProfileModal();

  const tokenToBigInt = useTokenDecimalsStandard();

  const onListingActionClick = async (listing: Listing) => {
    if (!signer) return;
    const orderAction = opposite(listing.action, [ListingAction.Sell, ListingAction.Buy]);
    const confirmColor: ColorType = orderAction === ListingAction.Sell ? 'error' : 'success';
    return modalLoop(
      CreateOrderModal,
      {
        listing,
      },
      ConfirmationModal,
      ({ orderAmount, orderCost }) => ({
        title: `Create ${orderAction} Order?`,
        text: `Are you sure you want to create a ${decapitalize(
          orderAction,
        )} order for ${orderAmount} ${listing.token}  (${priceFormat(
          orderCost,
          listing.currency,
        )})?`,
        confirmText: `${orderAction} ${listing.token}`,
        confirmColor,
        cancelText: 'Back',
        cancelStartIcon: <FaChevronLeft />,
      }),
    ).then(createOrderData => {
      if (!createOrderData) return;

      createOrder(
        token,
        currency,
        listing.id,
        tokenToBigInt(createOrderData.orderAmount),
        network,
        signer,
      );
    });
  };

  const onAddressClick = (address: string) => {
    triggerUserProfileModal(address);
  };

  return (
    <StripedTable
      isFetching={isFetching}
      data={listings}
      getRowKey={(row: Listing) => row.id}
      columnData={[
        {
          label: 'ID',
          render: listing => listing.id,
        },
        {
          label: 'Price',
          className: tableStyles.price,
          render: listing => `${priceFormat(listing.price)} ${listing.currency}`,
        },
        {
          label: 'Available/Total Amount',
          render: ({ availableTokenAmount, totalTokenAmount, token }) =>
            `${availableTokenAmount} ${token} / ${totalTokenAmount} ${token}`,
        },
        {
          label: 'Limit Per Order',
          render: ({ minPricePerOrder, maxPricePerOrder, currency }) =>
            `${priceFormat(minPricePerOrder, currency)} - ${priceFormat(
              maxPricePerOrder,
              currency,
            )}`,
        },
        {
          label: 'Creator',
          render: listing => (
            <UserAddressCellData
              userAddress={listing.creator}
              onClick={() => onAddressClick(listing.creator)}
            />
          ),
        },
        {
          label: '',
          colStyle: { width: 145 },
          render: listing => {
            const action = opposite(listing.action, [ListingAction.Sell, ListingAction.Buy]);
            const buttonTitle = `${action} ${listing.token}`;

            return (
              <div className={tableStyles.actions}>
                <BaseButton
                  onClick={() => onListingActionClick(listing)}
                  color={action === ListingAction.Sell ? 'error' : 'success'}
                  title={buttonTitle}
                >
                  {buttonTitle}
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
