import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isFilterOption, mergeSearchParams } from './helpers';
import { LISTINGS_SORT_BY_OPTIONS } from '../config/tables';
import { SortOrder } from './enums';
import { useDropdownData } from 'components/ContextData/hooks';
import { FilterOption } from './types';

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

export const useFilterOption = () => {
  const location = useLocation();

  return useMemo(() => {
    const lastPath = location.pathname.split('/').pop();
    if (!lastPath || !isFilterOption(lastPath)) {
      return undefined;
    }

    return lastPath as FilterOption;
  }, [location]);
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { tokenDecimals, currencyDecimals } = useDropdownData();

  const defaultToken = useMemo(() => Object.keys(tokenDecimals)[0], [tokenDecimals]);
  const defaultCurrency = useMemo(() => Object.keys(currencyDecimals)[0], [currencyDecimals]);
  const defaultSortBy = Object.keys(LISTINGS_SORT_BY_OPTIONS)[0];

  const token = useMemo(
    () => searchParams.get('token') ?? defaultToken,
    [defaultToken, searchParams],
  );

  const currency = useMemo(
    () => searchParams.get('currency') ?? defaultCurrency,
    [defaultCurrency, searchParams],
  );

  const sortBy = useMemo(
    () => searchParams.get('sortBy') ?? defaultSortBy,
    [defaultSortBy, searchParams],
  );

  const sortOrder = useMemo(
    () => (searchParams.get('sortOrder') ?? SortOrder.DESC) as SortOrder,
    [searchParams],
  );

  const page = useMemo(() => Number(searchParams.get('page')) || 1, [searchParams]);

  const setCurrency = (currency: string) => {
    setSearchParams(params => mergeSearchParams(params, { currency }));
  };

  const setToken = (token: string) => {
    setSearchParams(params => mergeSearchParams(params, { token }));
  };

  const setSortBy = (sortBy: string) => {
    setSearchParams(params => mergeSearchParams(params, { sortBy }));
  };

  const setSortOrder = (sortOrder: SortOrder) => {
    setSearchParams(params => mergeSearchParams(params, { sortOrder }));
  };

  const setPage = (page: number) => {
    setSearchParams(params => mergeSearchParams(params, { page: page.toString() }));
  };

  return {
    currency,
    token,
    sortBy,
    sortOrder,
    page,
    setCurrency,
    setToken,
    setSortBy,
    setSortOrder,
    setPage,
  };
};
