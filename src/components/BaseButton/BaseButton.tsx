import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

import styles from './BaseButton.module.scss';
import { buttonWithColor } from 'mui/helpers';
import theme from 'mui/theme';

export interface BaseButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const BaseButton = styled(({ children, className, ...rest }: BaseButtonProps) => (
  <Button variant="contained" className={`${styles.button} ${className}`} {...rest}>
    {children}
  </Button>
))(({ color }) => buttonWithColor(color, theme));

export default BaseButton;
