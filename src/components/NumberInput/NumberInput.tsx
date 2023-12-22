import React, { useCallback, useEffect, useState } from 'react';
import BaseInput from 'components/BaseInput';
import { BaseInputProps } from 'components/BaseInput/BaseInput';
import { roundTo as _roundTo } from 'utils/helpers';

export interface NumberInputProps extends Omit<BaseInputProps, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  roundTo?: number;
  min?: number;
  max?: number;
  step?: number;
}

function NumberInput({
  value,
  onChange,
  onBlur,
  roundTo,
  min,
  max,
  step,
  ...rest
}: NumberInputProps) {
  const [stringValue, setStringValue] = useState<string>(value?.toString() ?? '');

  const handleBlur = useCallback(() => {
    if (onChange) {
      let newValue = parseFloat(stringValue);
      if (isNaN(newValue)) newValue = 0;
      if (roundTo !== undefined) newValue = _roundTo(newValue, roundTo);
      if (min !== undefined) newValue = Math.max(newValue, min);
      if (max !== undefined) newValue = Math.min(newValue, max);

      onChange(newValue);
    }

    if (onBlur) onBlur();
  }, [onChange, onBlur, stringValue, roundTo, min, max]);

  useEffect(() => {
    setStringValue(value?.toString() ?? '');
  }, [value]);

  return (
    <BaseInput
      type="number"
      value={stringValue}
      onChange={setStringValue}
      onBlur={handleBlur}
      inputProps={{ min, max, step }}
      {...rest}
    />
  );
}

export default NumberInput;
