import React from 'react';
import styles from './MyListings.module.scss';
import FiltersBar from 'components/FiltersBar';
import { Outlet } from 'react-router-dom';
import BaseButton from 'components/BaseButton';
import { FaPlus } from 'react-icons/fa';
import triggerModal from 'utils/triggerModal';
import ChooseListingTypeModal from 'components/ChooseListingTypeModal';
import { useTableSearchParams } from 'utils/hooks';
import { confirmListingData } from 'utils/modals';
import {
  useCurrencyDecimalsStandard,
  useFormattedDropdownData,
  useTokenDecimalsStandard,
  useWeb3Signer,
} from 'components/ContextData/hooks';
import { useNetwork } from 'utils/web3Hooks';
import { listingActionToNumber } from 'utils/listings';
import { ListingAction } from 'utils/enums';
import { approveToken, createListing } from 'web3/requests/ezcrowRamp';
import { emitRefreshTableDataEvent } from 'utils/dataHooks';
import { LISTINGS_SORT_BY_OPTIONS } from 'utils/config';

function MyListings() {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { token, currency } = useTableSearchParams();
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();

  const currencyToBigInt = useCurrencyDecimalsStandard();
  const tokenToBigInt = useTokenDecimalsStandard();

  const onCreateNewListingClick = () => {
    if (!signer) return;
    triggerModal(ChooseListingTypeModal).then(action => {
      if (!action) return;

      return confirmListingData({
        action,
        tokens: tokenOptionsMap,
        currencies: currencyOptionsMap,
        tokenParam: token,
        currencyParam: currency,
      }).then(async listingEditData => {
        if (!listingEditData) return;
        const {
          token,
          currency,
          action,
          price,
          totalTokenAmount: _totalTokenAmount,
          minPricePerOrder,
          maxPricePerOrder,
        } = listingEditData;

        const totalTokenAmount = tokenToBigInt(_totalTokenAmount);

        if (action === ListingAction.Sell) {
          await approveToken(token, currency, totalTokenAmount, network, signer);
        }

        createListing(
          token,
          currency,
          listingActionToNumber(action),
          currencyToBigInt(price),
          totalTokenAmount,
          currencyToBigInt(minPricePerOrder),
          currencyToBigInt(maxPricePerOrder),
          network,
          signer,
        ).then(emitRefreshTableDataEvent);
      });
    });
  };

  return (
    <main>
      <header>
        <h1>My Listings</h1>
        <p>
          Here you can manage all your published listings that haven&apos;t been traded with yet.
          Edit or remove current listings or create new ones.
        </p>
      </header>
      <FiltersBar sortByOptions={LISTINGS_SORT_BY_OPTIONS}>
        <BaseButton
          onClick={onCreateNewListingClick}
          className={styles.createNewListing}
          endIcon={<FaPlus />}
        >
          Create New Listing
        </BaseButton>
      </FiltersBar>
      <Outlet />
    </main>
  );
}

export default MyListings;
