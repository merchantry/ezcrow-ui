import { FILTER_OPTIONS } from './config';
import { Round } from './enums';
import { FilterOption, Listing } from './types';

export const isFilterOption = (value: string) => FILTER_OPTIONS.includes(value as FilterOption);

export const mergeSearchParams = (
  searchParams: URLSearchParams,
  newParams: Record<string, string>,
) => {
  const params = new URLSearchParams(searchParams);

  Object.entries(newParams).forEach(([key, value]) => {
    params.set(key, value);
  });

  return params;
};

export const decapitalize = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);

export const priceFormat = (amount: number, currency?: string, decimals = 2) =>
  new Intl.NumberFormat('de-DE', {
    style: currency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

const roundFunctions = {
  [Round.Up]: Math.ceil,
  [Round.Down]: Math.floor,
  [Round.Nearest]: Math.round,
};

export const roundTo = (value: number, decimals: number, mode = Round.Nearest) => {
  const factor = 10 ** decimals;
  const roundFn = roundFunctions[mode];

  return roundFn(value * factor) / factor;
};

export const multiplyByTenPow = (n: number, exp: number) => {
  const absExp = Math.abs(exp);
  if (exp < 0) {
    return n / 10 ** absExp;
  }

  return n * 10 ** absExp;
};

export const convertDecimals = (value: string, decimalsFrom: number, decimalsTo: number) =>
  roundTo(multiplyByTenPow(Number(value), -decimalsFrom), decimalsTo);

export const fiatToToken = (fiatAmount: number, listing: Listing) =>
  Math.floor(fiatAmount / listing.price);

export const opposite = <T>(value: T, options: [T, T]) =>
  value === options[0] ? options[1] : options[0];

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: '$',
  INR: '₹',
};

export const currencyToSymbol = (currency: string) => {
  if (!(currency in CURRENCY_SYMBOLS)) {
    return undefined;
  }

  return CURRENCY_SYMBOLS[currency];
};

export const maybePluralize = (value: number, singular: string, plural?: string) =>
  value === 1 ? singular : plural ?? `${singular}s`;

export const run = <T>(fn: () => T) => fn();

export const shortenAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
