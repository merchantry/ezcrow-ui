import React from 'react';

import FiltersBar from 'components/FiltersBar';
import { Outlet } from 'react-router-dom';
import { ORDERS_SORT_BY_OPTIONS } from 'config/tables';

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
      <FiltersBar sortByOptions={ORDERS_SORT_BY_OPTIONS} />
      <Outlet />
    </main>
  );
}

export default OrdersInDispute;
