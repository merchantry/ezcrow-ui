import React, { useMemo } from 'react';

import { Chip as MuiChip } from '@mui/material';
import styles from './Chip.module.scss';
import Tooltip from 'components/Tooltip';

export interface ChipProps {
  label: string;
  color?: 'primary' | 'warning' | 'info' | 'success' | 'error';
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  icon?: React.ReactElement;
  className?: string;
}

function Chip({ label, color, tooltip, tooltipPlacement, icon, className }: ChipProps) {
  const chip = useMemo(
    () => (
      <MuiChip
        icon={icon}
        color="primary"
        className={`${styles.chip} ${color ? styles[color] : ''} ${className} ${
          tooltip ? styles.withTooltip : ''
        }`}
        label={label}
      />
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
