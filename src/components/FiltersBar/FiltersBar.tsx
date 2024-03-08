import React, { useMemo } from 'react';
import styles from './FiltersBar.module.scss';
import Dropdown from 'components/Dropdown';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useFilterRedirects, useFirstLocationPathname, useTableSearchParams } from 'utils/hooks';
import { isFilterOption } from 'utils/helpers';
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
  const { tokenOptionsMap, currencyOptionsMap } = useFormattedDropdownData();
  const {
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
  } = useTableSearchParams();

  return (
    <div className={styles.filterControls}>
      <FilterOptionsLinks />
      <Dropdown
        className={styles.tokenDropdown}
        value={token}
        label="Token"
        options={tokenOptionsMap}
        onChange={setToken}
      />
      <Dropdown
        className={styles.currencyDropdown}
        value={currency}
        label="Currency"
        options={currencyOptionsMap}
        onChange={setCurrency}
      />
      <Dropdown
        className={styles.sortByDropdown}
        value={sortBy}
        label="Sort By"
        options={sortByOptions}
        onChange={setSortBy}
      />
      <IconButton
        onClick={() => setSortOrder(SortOrder.DESC)}
        className={`${styles.sortOrder} ${sortOrder === SortOrder.DESC && styles.active}`}
        title="Sort descending"
      >
        <FaSortAmountDown />
      </IconButton>
      <IconButton
        onClick={() => setSortOrder(SortOrder.ASC)}
        className={`${styles.sortOrder} ${styles.ascending} ${
          sortOrder === SortOrder.ASC && styles.active
        }`}
        title="Sort ascending"
      >
        <FaSortAmountUp />
      </IconButton>
      <Pagination value={page} onChange={setPage} pages={5} className={styles.pagination} />
      <IconButton onClick={emitRefreshTableDataEvent} title="Refresh table">
        <FaRotateRight />
      </IconButton>
      <div className={styles.buttonsContainer}>{children}</div>
    </div>
  );
}

export default FiltersBar;
