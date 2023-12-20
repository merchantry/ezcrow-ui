import React, { useCallback } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';

import styles from './Pagination.module.scss';
import IconButton from 'components/IconButton';

interface PaginationProps {
  value: number;
  onChange: (value: number) => void;
  pages: number;
  className?: string;
}

function Pagination({ value, onChange, pages, className }: PaginationProps) {
  const handlePreviousClick = useCallback(() => {
    if (value === 1) return;
    onChange(value - 1);
  }, [value, onChange]);

  const handleNextClick = useCallback(() => {
    if (value === pages) return;
    onChange(value + 1);
  }, [value, onChange, pages]);

  return (
    <div className={`${styles.pagination} ${className}`}>
      <IconButton disabled={value === 1} onClick={handlePreviousClick}>
        <FaCaretLeft />
      </IconButton>
      <div className={styles.pageNumber}>{value}</div>
      <IconButton disabled={value === pages} onClick={handleNextClick}>
        <FaCaretRight />
      </IconButton>
    </div>
  );
}

export default Pagination;
