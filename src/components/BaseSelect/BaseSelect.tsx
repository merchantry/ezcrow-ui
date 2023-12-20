import React, { useMemo } from 'react';

import { MenuItem } from '@mui/material';
import BaseInput from 'components/BaseInput';
import { BaseInputProps } from 'components/BaseInput/BaseInput';

export interface BaseSelectProps<T extends string | number> extends BaseInputProps<T> {
  options: Record<T, string>;
}

function BaseSelect<T extends string | number = string>({ options, ...rest }: BaseSelectProps<T>) {
  const entries = useMemo(() => Object.entries(options) as [T, string][], [options]);

  return (
    <BaseInput select {...rest}>
      {entries.map(([value, label]) => (
        <MenuItem color="#cecece" key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </BaseInput>
  );
}

export default BaseSelect;
