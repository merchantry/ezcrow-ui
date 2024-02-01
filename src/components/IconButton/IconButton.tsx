import React from 'react';
import { styled, Button, ButtonProps } from '@mui/material';

import styles from './IconButton.module.scss';
import { buttonWithColor } from 'mui/helpers';
import theme from 'mui/theme';

export interface IconButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
}

const IconButton = styled(({ children, className, ...rest }: IconButtonProps) => (
  <Button variant="contained" className={`${styles.iconButton} ${className}`} {...rest}>
    {children}
  </Button>
))(({ color }) => buttonWithColor(color, theme));

export default IconButton;
