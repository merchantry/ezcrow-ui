import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isFilterOption } from './helpers';
import { CURRENCY_OPTIONS, SORT_BY_OPTIONS, TOKEN_OPTIONS } from './config';
import { Listing, SortByOption } from './types';
import { ListingAction, SortOrder } from './enums';
import { getAllListings } from 'web3/requests/listings';
import dummyListings from './dummyListings';

export const useWindowEvent = (
  eventName: string,
  callback: (event: Event | CustomEvent) => void,
) => {
  useEffect(() => {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }, [eventName, callback]);
};

export const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  callback: (e: Event) => void,
) => {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback(e);
    }
  };

  useWindowEvent('click', handleClick);
};

export const useFirstLocationPathname = () => {
  const location = useLocation();

  return useMemo(() => location.pathname.split('/')[1] || undefined, [location]);
};

export const useFilterRedirects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lastPath = location.pathname.split('/').pop();
    if (!lastPath || !isFilterOption(lastPath)) {
      navigate('all', { replace: true });
    }
  }, [navigate, location]);
};

export const useTableSearchParams = () => {
  const [searchParams] = useSearchParams();

  const currency = useMemo(
    () => searchParams.get('currency') ?? CURRENCY_OPTIONS[0],
    [searchParams],
  );

  const token = useMemo(() => searchParams.get('token') ?? TOKEN_OPTIONS[0], [searchParams]);

  const sortBy = useMemo(
    () => (searchParams.get('sortBy') ?? Object.keys(SORT_BY_OPTIONS)[0]) as SortByOption,
    [searchParams],
  );

  const sortOrder = useMemo(
    () => (searchParams.get('sortOrder') ?? SortOrder.DESC) as SortOrder,
    [searchParams],
  );

  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams]);

  return { currency, token, sortBy, sortOrder, page };
};

export const useFilteredListings = (filter: ListingAction | undefined) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { currency, token, sortBy, sortOrder, page } = useTableSearchParams();

  useEffect(() => {
    setIsFetching(true);
    getAllListings(filter ?? 'all', currency, token, sortBy, sortOrder, page).then(() => {
      setIsFetching(false);
      setListings(
        dummyListings
          .filter(
            listing =>
              listing.token === token &&
              listing.fiatCurrency === currency &&
              (filter ? listing.action === filter : true),
          )
          .sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;

            return 0;
          }),
      );
    });
  }, [currency, filter, page, sortBy, sortOrder, token]);

  return [listings, isFetching] as const;
};

export const useUserWallet = () => {
  const userWallet = useMemo(
    () => ({
      address: '0x1234567890',
      balance: 1000000,
      token: 'USDT',
    }),
    [],
  );

  return userWallet;
};
