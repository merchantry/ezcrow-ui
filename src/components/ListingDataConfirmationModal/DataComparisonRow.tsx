import React, { useMemo } from 'react';

import styles from './ListingDataConfirmationModal.module.scss';
import { FaArrowRightLong, FaCaretUp, FaCaretDown, FaStarOfLife } from 'react-icons/fa6';
import { priceFormat } from 'utils/helpers';

interface DataComparisonRowProps<T extends number | string> {
  label: string;
  previous?: T;
  current: T;
  prevUnit?: string;
  currentUnit?: string;
  formatAsPrice?: boolean;
}

function DataComparisonRow<T extends number | string>({
  label,
  previous,
  current,
  prevUnit,
  currentUnit,
  formatAsPrice = false,
}: DataComparisonRowProps<T>) {
  const previousPrice = useMemo(() => {
    if (previous === undefined) return undefined;

    if (typeof previous === 'number' && prevUnit && formatAsPrice)
      return priceFormat(previous, prevUnit);

    if (prevUnit) return `${previous} ${prevUnit}`;

    return previous;
  }, [previous, prevUnit, formatAsPrice]);

  const currentPrice = useMemo(() => {
    if (typeof current === 'number' && currentUnit && formatAsPrice)
      return priceFormat(current, currentUnit);

    if (currentUnit) return `${current} ${currentUnit}`;

    return current;
  }, [current, currentUnit, formatAsPrice]);

  const { newValueClass, newValueIcon } = useMemo(() => {
    if (previous !== undefined) {
      const stringIsChanged =
        typeof current === 'string' && typeof previous === 'string' && current !== previous;
      const unitIsChanged = prevUnit !== currentUnit;

      if (stringIsChanged || unitIsChanged)
        return { newValueClass: styles.changed, newValueIcon: <FaStarOfLife /> };

      if (current > previous) return { newValueClass: styles.inc, newValueIcon: <FaCaretUp /> };
      if (current < previous) return { newValueClass: styles.dec, newValueIcon: <FaCaretDown /> };
    }

    return { newValueClass: undefined, newValueIcon: undefined };
  }, [current, currentUnit, prevUnit, previous]);

  return (
    <div className={styles.dataComparisonRow}>
      <span>{label}</span>
      <span>
        {!!previousPrice && (
          <>
            <span>{previousPrice}</span>
            <span>
              <FaArrowRightLong />
            </span>
          </>
        )}
        <span className={newValueClass}>{currentPrice}</span>
        <span className={newValueClass}>{newValueIcon}</span>
      </span>
    </div>
  );
}

export default DataComparisonRow;
