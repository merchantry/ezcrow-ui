import { DependencyList, useCallback, useEffect, useState } from 'react';
import { useTableSearchParams, useWindowEvent } from './hooks';
import { ListingAction, OrderStatus } from './enums';
import { getListings, getUserListings } from 'requests/listings';
import { ROUND_TO_FIAT, ROUND_TO_TOKEN } from '../config/number';
import { listingActionToNumber, serializeListing } from './listings';
import { getOrders, getUserOrders } from 'requests/orders';
import { serializeOrder } from './orders';
import { useNetwork } from 'components/ContextData/hooks';
import { useDropdownData } from 'components/ContextData/hooks';
import { PER_PAGE } from 'config/tables';
import { WEB3_REQUEST_COMPLETED_EVENT, WEB3_REQUEST_MINED_EVENT } from 'web3/api';
import { emitCustomEvent } from 'services/events';

const orderStatusToNumber = (status?: OrderStatus) => {
  if (status === undefined) return undefined;

  return Number(status);
};

const MAX_ITEMS = 200;

const REFRESH_TABLE_DATA_EVENT = 'REFRESH_TABLE_DATA_EVENT';
const SOFT_REFRESH_TABLE_DATA_EVENT = 'SOFT_REFRESH_TABLE_DATA_EVENT';

export const emitRefreshTableDataEvent = () => {
  emitCustomEvent(REFRESH_TABLE_DATA_EVENT);
};

export const emitSoftRefreshTableDataEvent = () => {
  emitCustomEvent(SOFT_REFRESH_TABLE_DATA_EVENT);
};

type GeneralFetchItemsParams = {
  tokenSymbol: string;
  currencySymbol: string;
  sortBy: string;
  sortOrder: string;
  offset: number;
  count: number;
  network: string;
};

const useItemsWithFetchFunction = <T, R>(
  fetchItems: (params: GeneralFetchItemsParams) => Promise<T[]>,
  serializeItem: (
    item: T,
    tokenDecimalsFrom: number,
    tokenDecimalsTo: number,
    currencyDecimalsFrom: number,
    currecyDecimalsTo: number,
  ) => R,
  deps: DependencyList,
) => {
  const [items, setItems] = useState<R[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { token, currency, sortBy, sortOrder, page } = useTableSearchParams();
  const { tokenDecimals, currencyDecimals } = useDropdownData();
  const network = useNetwork();

  const updateData = useCallback(
    async (forceUpdate: boolean) => {
      if (!token || !currency || !(token in tokenDecimals) || !(currency in currencyDecimals)) {
        return;
      }

      setIsFetching(forceUpdate);

      const tokenDecimalsFrom = tokenDecimals[token];
      const currencyDecimalsFrom = currencyDecimals[currency];

      const data = await fetchItems({
        tokenSymbol: token,
        currencySymbol: currency,
        sortBy,
        sortOrder,
        offset: (page - 1) * PER_PAGE,
        count: PER_PAGE,
        network,
      });

      const newItems = data.map(i =>
        serializeItem(i, tokenDecimalsFrom, ROUND_TO_TOKEN, currencyDecimalsFrom, ROUND_TO_FIAT),
      );

      setItems(items => {
        if (!forceUpdate && JSON.stringify(newItems) === JSON.stringify(items)) {
          return items;
        }

        return newItems;
      });
      setIsFetching(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currencyDecimals,
      tokenDecimals,
      sortOrder,
      currency,
      // We want to avoid updating the data when the netowrk changes
      // since the network is usually updated before the token and currency
      // data, so this can fetch data for the newly selected network,
      // but with the old token and currency
      // network,
      sortBy,
      token,
      page,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...deps,
    ],
  );

  useWindowEvent(WEB3_REQUEST_COMPLETED_EVENT, () => {
    updateData(false);
  });

  useWindowEvent(WEB3_REQUEST_MINED_EVENT, () => {
    updateData(false);
  });

  useWindowEvent(SOFT_REFRESH_TABLE_DATA_EVENT, () => {
    updateData(false);
  });

  useWindowEvent(REFRESH_TABLE_DATA_EVENT, () => {
    updateData(true);
  });

  useEffect(() => {
    updateData(true);
  }, [updateData]);

  return [items, isFetching] as [R[], boolean];
};

export const useListings = (filter?: ListingAction) =>
  useItemsWithFetchFunction(
    params =>
      getListings({
        ...params,
        listingActionFilter: filter ? listingActionToNumber(filter) : undefined,
        maxListings: MAX_ITEMS,
      }),
    serializeListing,
    [filter],
  );

export const useUserListings = (user?: string, filter?: ListingAction) =>
  useItemsWithFetchFunction(
    params =>
      user
        ? getUserListings({
            ...params,
            user,
            listingActionFilter: filter ? listingActionToNumber(filter) : undefined,
            maxListings: MAX_ITEMS,
            showDeleted: true,
          })
        : Promise.resolve([]),
    serializeListing,
    [user, filter],
  );

export const useOrders = (filter?: ListingAction, statusFilter?: OrderStatus) =>
  useItemsWithFetchFunction(
    params =>
      getOrders({
        ...params,
        orderActionFilter: filter ? listingActionToNumber(filter) : undefined,
        statusFilter: orderStatusToNumber(statusFilter),
        maxOrders: MAX_ITEMS,
      }),
    serializeOrder,
    [filter, statusFilter],
  );

export const useUserOrders = (user?: string, filter?: ListingAction, statusFilter?: OrderStatus) =>
  useItemsWithFetchFunction(
    params =>
      user
        ? getUserOrders({
            ...params,
            orderActionFilter: filter ? listingActionToNumber(filter) : undefined,
            statusFilter: orderStatusToNumber(statusFilter),
            maxOrders: MAX_ITEMS,
            user,
          })
        : Promise.resolve([]),
    serializeOrder,
    [user, filter, statusFilter],
  );
