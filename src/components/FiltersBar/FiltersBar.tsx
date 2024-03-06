import React, { useMemo } from 'react';
import styles from './FiltersBar.module.scss';
import Dropdown from 'components/Dropdown';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useFilterRedirects, useFirstLocationPathname, useTableSearchParams } from 'utils/hooks';
import { isFilterOption, mergeSearchParams } from 'utils/helpers';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { FaRotateRight } from 'react-icons/fa6';
import IconButton from 'components/IconButton';
import { SortOrder } from 'utils/enums';
import Pagination from 'components/Pagination';
import { useFormattedDropdownData } from 'components/ContextData/hooks';
import { FILTER_OPTIONS } from 'config/tables';
import { emitRefreshTableDataEvent } from 'utils/dataHooks';

function FilterOptionsLinks() {
  const firstPathname = useFirstLocationPathname();
  const [searchParams] = useSearchParams();

  const onIndexPage = useMemo(
    () => !firstPathname || isFilterOption(firstPathname),
    [firstPathname],
  );

  const searchParamsToString = useMemo(() => {
    if (searchParams.size === 0) return '';

    return `?${searchParams.toString()}`;
  }, [searchParams]);

  return (
    <div className={styles.filters}>
      {FILTER_OPTIONS.map(filterOption => {
        const path = onIndexPage ? `/${filterOption}` : `/${firstPathname}/${filterOption}`;

        return (
          <NavLink
            className={({ isActive }) =>
              [isActive ? styles.active : '', styles[filterOption]].join(' ')
            }
            key={filterOption}
            to={`${path}${searchParamsToString}`}
          >
            {filterOption}
          </NavLink>
        );
      })}
    </div>
  );
}

interface FiltersBarProps {
  children?: React.ReactNode;
  sortByOptions: Record<string, string>;
}

function FiltersBar({ children, sortByOptions }: FiltersBarProps) {
  useFilterRedirects();
  const [, setSearchParams] = useSearchParams();
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();
  const { currency, token, sortBy, sortOrder, page } = useTableSearchParams();

  const handleCurrencyChange = (currency: string) => {
    setSearchParams(params => mergeSearchParams(params, { currency }));
  };

  const handleTokenChange = (token: string) => {
    setSearchParams(params => mergeSearchParams(params, { token }));
  };

  const handleSortByChange = (sortBy: string) => {
    setSearchParams(params => mergeSearchParams(params, { sortBy }));
  };

  const handleSortOrderChange = (sortOrder: SortOrder) => {
    setSearchParams(params => mergeSearchParams(params, { sortOrder }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(params => mergeSearchParams(params, { page: page.toString() }));
  };

  return (
    <div className={styles.filterControls}>
      <FilterOptionsLinks />
      <Dropdown
        className={styles.tokenDropdown}
        value={token}
        label="Token"
        options={tokenOptionsMap}
        onChange={handleTokenChange}
      />
      <Dropdown
        className={styles.currencyDropdown}
        value={currency}
        label="Currency"
        options={currencyOptionsMap}
        onChange={handleCurrencyChange}
      />
      <Dropdown
        className={styles.sortByDropdown}
        value={sortBy}
        label="Sort By"
        options={sortByOptions}
        onChange={handleSortByChange}
      />
      <IconButton
        onClick={() => handleSortOrderChange(SortOrder.DESC)}
        className={`${styles.sortOrder} ${sortOrder === SortOrder.DESC && styles.active}`}
      >
        <FaSortAmountDown />
      </IconButton>
      <IconButton
        onClick={() => handleSortOrderChange(SortOrder.ASC)}
        className={`${styles.sortOrder} ${styles.ascending} ${
          sortOrder === SortOrder.ASC && styles.active
        }`}
      >
        <FaSortAmountUp />
      </IconButton>
      <Pagination
        value={page}
        onChange={handlePageChange}
        pages={5}
        className={styles.pagination}
      />
      <IconButton onClick={emitRefreshTableDataEvent}>
        <FaRotateRight />
      </IconButton>
      <div className={styles.buttonsContainer}>{children}</div>
    </div>
  );
}

export default FiltersBar;
