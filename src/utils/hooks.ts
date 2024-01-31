import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { isFilterOption } from './helpers';
import { SORT_BY_OPTIONS } from './config';
import { SortByOption } from './types';
import { SortOrder } from './enums';

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
  // const { tokenDecimals, currencyDecimals } = useDropdownData();

  const currency = useMemo(() => searchParams.get('currency') ?? 'USD', [searchParams]);

  const token = useMemo(() => searchParams.get('token') ?? 'TEST', [searchParams]);

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
