import React, { ChangeEvent, useMemo } from 'react';

import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import styles from './BaseInput.module.scss';

export interface BaseInputProps<T extends string | number>
  extends Omit<TextFieldProps<'outlined'>, 'onChange' | 'variant' | 'helperText' | 'error'> {
  label: string;
  value?: T;
  onChange?: (value: T) => void;
  type?: 'text' | 'number';
  className?: string;
  endAdornment?: React.ReactNode;
  helperText?: string;
  error?: string;
}

function BaseInput<T extends string | number = string>({
  label,
  value,
  onChange,
  type = 'text',
  className,
  endAdornment,
  helperText,
  error,
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

  const helperTextProp = useMemo(() => {
    if (error) return error;
    return helperText;
  }, [error, helperText]);

  return (
    <TextField
      variant="outlined"
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      className={`${styles.input} ${className}`}
      InputProps={inputProps}
      helperText={helperTextProp}
      error={!!error}
      {...rest}
    />
  );
}

export default BaseInput;
