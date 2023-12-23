import React from 'react';
import NumberInput from 'components/NumberInput';
import { NumberInputProps } from 'components/NumberInput/NumberInput';
import styles from './ReadOnlyInput.module.scss';

export interface ReadOnlyInputProps extends Omit<NumberInputProps, 'onChange' | 'disabled'> {}

function ReadOnlyInput({ className, ...props }: ReadOnlyInputProps) {
  return <NumberInput className={`${styles.readOnlyInput} ${className}`} disabled {...props} />;
}

export default ReadOnlyInput;
