import React from 'react';

import { BrowserRouter, Route, Routes as RoutesList } from 'react-router-dom';
import Dashboard from 'components/Dashboard';
import AllListings from 'pages/AllListings';
import MyListings from 'pages/MyListings';
import MyOrders from 'pages/MyOrders';
import AllListingsTable from 'components/AllListingsTable';
import MyListingsTable from 'components/MyListingsTable';
import { ListingAction, OrderAction } from 'utils/enums';
import MyOrdersTable from 'components/MyOrdersTable';

function Routes() {
  return (
    <BrowserRouter>
      <RoutesList>
        <Route element={<Dashboard />}>
          <Route path="/" element={<AllListings />}>
            <Route path="all" element={<AllListingsTable />} />
            <Route path="buy" element={<AllListingsTable filter={ListingAction.Buy} />} />
            <Route path="sell" element={<AllListingsTable filter={ListingAction.Sell} />} />
          </Route>
          <Route path="/my-listings" element={<MyListings />}>
            <Route path="all" element={<MyListingsTable />} />
            <Route path="buy" element={<MyListingsTable filter={ListingAction.Sell} />} />
            <Route path="sell" element={<MyListingsTable filter={ListingAction.Buy} />} />
          </Route>
          <Route path="/my-orders" element={<MyOrders />}>
            <Route path="all" element={<MyOrdersTable />} />
            <Route path="buy" element={<MyOrdersTable filter={OrderAction.Buy} />} />
            <Route path="sell" element={<MyOrdersTable filter={OrderAction.Sell} />} />
          </Route>
        </Route>
      </RoutesList>
    </BrowserRouter>
  );
}

export default Routes;
