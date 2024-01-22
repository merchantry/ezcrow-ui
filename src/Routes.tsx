import React from 'react';

import { BrowserRouter, Route, Routes as RoutesList } from 'react-router-dom';
import Dashboard from 'layouts/Dashboard';
import AllListings from 'pages/AllListings';
import MyListings from 'pages/MyListings';
import MyOrders from 'pages/MyOrders';
import AllListingsTable from 'components/AllListingsTable';
import MyListingsTable from 'components/MyListingsTable';
import { ListingAction, OrderAction } from 'utils/enums';
import MyOrdersTable from 'components/MyOrdersTable';
import Page from 'layouts/Page';
import OrdersInDispute from 'pages/OrdersInDispute';
import OrdersInDisputeTable from 'components/OrdersInDisputeTable';

function Routes() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <RoutesList>
        <Route element={<Dashboard />}>
          <Route
            path="/"
            element={
              <Page title="All Listings">
                <AllListings />
              </Page>
            }
          >
            <Route path="all" element={<AllListingsTable />} />
            <Route path="buy" element={<AllListingsTable filter={ListingAction.Sell} />} />
            <Route path="sell" element={<AllListingsTable filter={ListingAction.Buy} />} />
          </Route>
          <Route
            path="/my-listings"
            element={
              <Page title="My Listings">
                <MyListings />
              </Page>
            }
          >
            <Route path="all" element={<MyListingsTable />} />
            <Route path="buy" element={<MyListingsTable filter={ListingAction.Buy} />} />
            <Route path="sell" element={<MyListingsTable filter={ListingAction.Sell} />} />
          </Route>
          <Route
            path="/my-orders"
            element={
              <Page title="My Orders">
                <MyOrders />
              </Page>
            }
          >
            <Route path="all" element={<MyOrdersTable />} />
            <Route path="buy" element={<MyOrdersTable filter={OrderAction.Buy} />} />
            <Route path="sell" element={<MyOrdersTable filter={OrderAction.Sell} />} />
          </Route>
          <Route
            path="/orders-in-dispute"
            element={
              <Page title="Orders In Dispute">
                <OrdersInDispute />
              </Page>
            }
          >
            <Route path="all" element={<OrdersInDisputeTable />} />
            <Route path="buy" element={<OrdersInDisputeTable filter={OrderAction.Buy} />} />
            <Route path="sell" element={<OrdersInDisputeTable filter={OrderAction.Sell} />} />
          </Route>
        </Route>
      </RoutesList>
    </BrowserRouter>
  );
}

export default Routes;
