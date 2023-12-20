import React from 'react';
import styles from './MyListings.module.scss';
import FiltersBar from 'components/FiltersBar';
import { Outlet } from 'react-router-dom';
import BaseButton from 'components/BaseButton';
import { FaPlus } from 'react-icons/fa';
import triggerModal from 'utils/triggerModal';
import ChooseListingTypeModal from 'components/ChooseListingTypeModal';
import ListingEditModal from 'components/ListingEditModal';
import { ListingModalAction } from 'utils/enums';
import { useFormattedDropdownData } from 'components/ContextData/ContextData';
import { useTableSearchParams } from 'utils/hooks';

function MyListings() {
  const { token, currency } = useTableSearchParams();
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();

  const onCreateNewListingClick = () => {
    triggerModal(ChooseListingTypeModal).then(action => {
      if (!action) return;

      return triggerModal(ListingEditModal, {
        modalAction: ListingModalAction.CreateNew,
        action,
        tokens: tokenOptionsMap,
        currencies: currencyOptionsMap,
        tokenParam: token,
        currencyParam: currency,
      }).then(result => {
        console.log('result', result);
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
      <FiltersBar>
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
