import { DependencyList, useEffect, useState } from 'react';
import { useTableSearchParams, useWindowEvent } from './hooks';
import { ListingAction, OrderStatus } from './enums';
import { getListings, getUserListings } from 'requests/listings';
import { PER_PAGE, ROUND_TO_FIAT, ROUND_TO_TOKEN } from './config';
import { listingActionToNumber, serializeListing } from './listings';
import { getOrders, getUserOrders } from 'requests/orders';
import { serializeOrder } from './orders';
import { useNetwork } from './web3Hooks';
import { useDropdownData } from 'components/ContextData/hooks';

const orderStatusToNumber = (status?: OrderStatus) => {
  if (status === undefined) return undefined;

  return Number(status);
};

const MAX_ITEMS = 200;

const REFRESH_TABLE_DATA_EVENT = 'REFRESH_TABLE_DATA_EVENT';

export const emitRefreshTableDataEvent = () => {
  window.dispatchEvent(new CustomEvent(REFRESH_TABLE_DATA_EVENT));
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
  const [refreshValue, setRefreshValue] = useState(false);

  const { token, currency, sortBy, sortOrder, page } = useTableSearchParams();
  const { tokenDecimals, currencyDecimals } = useDropdownData();
  const network = useNetwork();

  const refresh = () => {
    setRefreshValue(refreshValue => !refreshValue);
  };

  useEffect(() => {
    if (!token || !currency || !(token in tokenDecimals) || !(currency in currencyDecimals)) {
      setIsFetching(true);
      return;
    }

    const fn = async () => {
      setIsFetching(true);

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

      setItems(
        data.map(i =>
          serializeItem(i, tokenDecimalsFrom, ROUND_TO_TOKEN, currencyDecimalsFrom, ROUND_TO_FIAT),
        ),
      );

      setIsFetching(false);
    };

    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currencyDecimals,
    tokenDecimals,
    sortOrder,
    currency,
    refreshValue,
    network,
    sortBy,
    token,
    page,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);

  useWindowEvent(REFRESH_TABLE_DATA_EVENT, () => {
    refresh();
  });

  return [items, isFetching, refresh] as [R[], boolean, () => void];
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
