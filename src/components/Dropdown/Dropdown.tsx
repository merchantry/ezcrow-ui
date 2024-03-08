import React, { useRef, useState, useMemo, CSSProperties } from 'react';
import styles from './Dropdown.module.scss';

import { useClickOutside } from 'utils/hooks';
import { FaCaretDown } from 'react-icons/fa6';

interface DropwdownProps<T extends string> {
  value?: T;
  onChange: (value: T) => void;
  options: Record<T, string>;
  label: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const OPTION_HEIGHT = 35;

function Dropwdown<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  style,
  title,
}: DropwdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const optionsArray = useMemo(() => Object.entries(options), [options]) as [T, string][];

  const valueLabel = useMemo(() => (value ? options[value] : undefined), [options, value]);

  const openStyles = useMemo(
    () => ({
      maxHeight: `${optionsArray.length * OPTION_HEIGHT}px`,
      visibility: 'visible',
    }),
    [optionsArray.length],
  ) as CSSProperties;

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleClickOption = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div
      ref={ref}
      className={`${styles.dropdownContainer} ${isOpen && styles.open} ${className}`}
      style={style}
      onClick={toggleOpen}
      title={title}
    >
      <div className={styles.label}>
        <span>{label}</span>
        <span>{valueLabel}</span>
      </div>
      <div className={styles.dropdownArrowContainer}>
        <FaCaretDown />
      </div>
      <ul className={styles.dropdown} style={isOpen ? openStyles : undefined}>
        {optionsArray.map(([option, label]) => (
          <li
            className={styles.dropdownItem}
            key={option}
            onClick={() => handleClickOption(option)}
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropwdown;
