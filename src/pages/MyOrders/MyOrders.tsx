import React from 'react';

import FiltersBar from 'components/FiltersBar';
import { Outlet } from 'react-router-dom';

function MyOrders() {
  return (
    <main>
      <header>
        <h1>My Orders</h1>
        <p>
          Keep track of all your completed, rejected and in progress orders. Check their status and
          interact with the user you&apos;re trading with.
        </p>
      </header>
      <FiltersBar />
      <Outlet />
    </main>
  );
}

export default MyOrders;
