import React from 'react';

import { ListingAction } from 'utils/enums';
import AllListingsTable from 'components/AllListingsTable';
import AllListings from 'pages/AllListings';
import MyListings from 'pages/MyListings';
import MyListingsTable from 'components/MyListingsTable';
import MyOrders from 'pages/MyOrders';
import MyOrdersTable from 'components/MyOrdersTable';
import OrdersInDispute from 'pages/OrdersInDispute';
import OrdersInDisputeTable from 'components/OrdersInDisputeTable';
import { JsonRpcSigner } from 'ethers';
import { Web3ContractAccountData } from 'utils/types';

type TableProps = {
  filter?: ListingAction;
};

type RouteUserData = {
  signer?: JsonRpcSigner;
  accountData?: Web3ContractAccountData;
};

type Route = {
  title: string;
  disabled?: (data: RouteUserData) => boolean;
  Component: () => JSX.Element;
  Table: (props: TableProps) => JSX.Element;
  filters: {
    all: undefined;
    buy: ListingAction;
    sell: ListingAction;
  };
};

const ROUTES: Record<string, Route> = {
  '/': {
    title: 'All Listings',
    Component: () => <AllListings />,
    Table: ({ filter }: TableProps) => <AllListingsTable filter={filter} />,
    filters: {
      all: undefined,
      buy: ListingAction.Sell,
      sell: ListingAction.Buy,
    },
  },
  '/my-listings': {
    title: 'My Listings',
    disabled: ({ signer }) => !signer,
    Component: () => <MyListings />,
    Table: ({ filter }: TableProps) => <MyListingsTable filter={filter} />,
    filters: {
      all: undefined,
      buy: ListingAction.Buy,
      sell: ListingAction.Sell,
    },
  },
  '/my-orders': {
    title: 'My Orders',
    disabled: ({ signer }) => !signer,
    Component: () => <MyOrders />,
    Table: ({ filter }: TableProps) => <MyOrdersTable filter={filter} />,
    filters: {
      all: undefined,
      buy: ListingAction.Buy,
      sell: ListingAction.Sell,
    },
  },
  '/orders-in-dispute': {
    title: 'Orders In Dispute',
    disabled: ({ signer, accountData }) => !signer || !accountData?.isOwner,
    Component: () => <OrdersInDispute />,
    Table: ({ filter }: TableProps) => <OrdersInDisputeTable filter={filter} />,
    filters: {
      all: undefined,
      buy: ListingAction.Buy,
      sell: ListingAction.Sell,
    },
  },
};

export default ROUTES;
