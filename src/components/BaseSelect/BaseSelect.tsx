import React, { useMemo } from 'react';

import { MenuItem } from '@mui/material';
import BaseInput from 'components/BaseInput';
import { BaseInputProps } from 'components/BaseInput/BaseInput';

export interface BaseSelectProps extends BaseInputProps {
  options: Record<string, string>;
}

function BaseSelect({ options, ...rest }: BaseSelectProps) {
  const entries = useMemo(() => Object.entries(options) as [string, string][], [options]);

  return (
    <BaseInput select {...rest}>
      {entries.map(([value, label]) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </BaseInput>
  );
}

export default BaseSelect;
