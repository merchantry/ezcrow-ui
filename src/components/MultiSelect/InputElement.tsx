import React from 'react';
import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import styles from './InputElement.module.scss';

interface InputElementProps extends OutlinedInputProps {
  label: string;
}

function InputElement({ className, ...rest }: InputElementProps) {
  return <OutlinedInput className={`${styles.input} ${className}`} {...rest} />;
}

export default InputElement;
