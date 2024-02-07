import React from 'react';

import FiltersBar from 'components/FiltersBar';
import 'scss/styles/pages.scss';
import { Outlet } from 'react-router-dom';
import { LISTINGS_SORT_BY_OPTIONS } from 'utils/config';

function AllListings() {
  return (
    <main>
      <header>
        <h1>All Listings</h1>
        <p>
          Here you can see all Fiat to Crypto and Crypto to Fiat trade listings posted by users.
        </p>
      </header>
      <FiltersBar sortByOptions={LISTINGS_SORT_BY_OPTIONS} />
      <Outlet />
    </main>
  );
}

export default AllListings;
