import React, { useMemo } from 'react';

import { Chip as MuiChip, styled, ChipProps as MuiChipProps } from '@mui/material';
import styles from './Chip.module.scss';
import Tooltip from 'components/Tooltip';
import { getThemeColor } from 'mui/helpers';
import theme from 'mui/theme';

export interface ChipProps {
  label: string;
  color?: 'primary' | 'warning' | 'info' | 'success' | 'error';
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactElement;
  className?: string;
}

const StyledChip = styled(({ label, icon, className }: MuiChipProps) => (
  <MuiChip icon={icon} color="primary" className={className} label={label} />
))(() => ({
  backgroundColor: getThemeColor('primary', theme),
}));

function Chip({ label, color, tooltip, tooltipPlacement, icon, className }: ChipProps) {
  const chip = useMemo(
    () => (
      <div className={styles.chipContainer}>
        <StyledChip
          label={label}
          color={color}
          icon={icon}
          className={`${styles.chip} ${color ? styles[color] : ''} ${className} ${
            tooltip ? styles.withTooltip : ''
          }`}
        />
      </div>
    ),
    [className, color, icon, label, tooltip],
  );

  if (tooltip)
    return (
      <Tooltip title={tooltip} placement={tooltipPlacement}>
        {chip}
      </Tooltip>
    );

  return chip;
}

export default Chip;
