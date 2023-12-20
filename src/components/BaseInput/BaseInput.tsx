import React, { ChangeEvent, useMemo } from 'react';

import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import styles from './BaseInput.module.scss';

export interface BaseInputProps<T extends string | number>
  extends Omit<TextFieldProps<'outlined'>, 'onChange' | 'variant'> {
  label: string;
  value?: T;
  onChange?: (value: T) => void;
  type?: 'text' | 'number';
  className?: string;
  endAdornment?: React.ReactNode;
}

function BaseInput<T extends string | number = string>({
  label,
  value,
  onChange,
  type = 'text',
  className,
  endAdornment,
  ...rest
}: BaseInputProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const newValue = e.target.value as T;
    onChange(newValue);
  };

  const inputProps = useMemo(() => {
    if (!endAdornment) return undefined;

    return { endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment> };
  }, [endAdornment]);

  return (
    <TextField
      variant="outlined"
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      className={`${styles.input} ${className}`}
      InputProps={inputProps}
      {...rest}
    />
  );
}

export default BaseInput;
