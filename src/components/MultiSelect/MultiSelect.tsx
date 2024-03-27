import React, { useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputElement from './InputElement';
import { Checkbox, FormControl, FormHelperText, InputLabel, ListItemText } from '@mui/material';
import styles from './MultiSelect.module.scss';

interface MultipleSelectProps<T extends string> {
  label: string;
  helperText?: string;
  className?: string;
  value: T[];
  onChange: (value: T[]) => void;
  options: T[];
}

export default function MultipleSelect<T extends string>({
  label,
  helperText,
  className,
  value,
  onChange,
  options,
}: MultipleSelectProps<T>) {
  const handleChange = useCallback(
    (event: SelectChangeEvent<T[]>) => {
      const {
        target: { value },
      } = event;
      onChange(typeof value === 'string' ? (value.split(',') as T[]) : value);
    },
    [onChange],
  );

  return (
    <FormControl className={`${styles.container} ${className}`}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        renderValue={selected => selected.join(', ')}
        input={<InputElement label={label} />}
      >
        {options.map(option => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.includes(option)} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
