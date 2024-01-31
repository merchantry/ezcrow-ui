import React from 'react';

import FiltersBar from 'components/FiltersBar';
import { Outlet } from 'react-router-dom';

function OrdersInDispute() {
  return (
    <main>
      <header>
        <h1>Orders In Dispute</h1>
        <p>
          Manage orders in dispute. Accept dispute to cancel the trade and return the funds back to
          the listing creator or reject dispute to complete the order and release the funds to the
          buyer.
        </p>
      </header>
      <FiltersBar hideSortBy />
      <Outlet />
    </main>
  );
}

export default OrdersInDispute;
