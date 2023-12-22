import React, { ChangeEvent, useMemo } from 'react';

import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import styles from './BaseInput.module.scss';

export interface BaseInputProps
  extends Omit<TextFieldProps<'outlined'>, 'onChange' | 'variant' | 'helperText' | 'error'> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  endAdornment?: React.ReactNode;
  helperText?: string;
  error?: string;
}

function BaseInput({
  label,
  value,
  onChange,
  className,
  endAdornment,
  helperText,
  error,
  ...rest
}: BaseInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    onChange(e.target.value);
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
      label={label}
      value={value}
      onChange={handleChange}
      className={`${styles.input} ${!!error && styles.error} ${className}`}
      InputProps={inputProps}
      helperText={helperTextProp}
      error={!!error}
      {...rest}
    />
  );
}

export default BaseInput;
