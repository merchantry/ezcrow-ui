import React from 'react';

import styles from './IconButtonWithTooltip.module.scss';
import IconButton from 'components/IconButton';
import { IconButtonProps } from 'components/IconButton/IconButton';
import Tooltip from 'components/Tooltip';

interface IconButtonWithTooltipProps extends IconButtonProps {
  tooltip: string;
  placement?: 'bottom' | 'left' | 'right' | 'top';
}

function IconButtonWithTooltip({ tooltip, placement, ...rest }: IconButtonWithTooltipProps) {
  return (
    <Tooltip title={!rest.disabled ? tooltip : undefined} placement={placement}>
      <div className={styles.buttonContainer}>
        <IconButton {...rest} />
      </div>
    </Tooltip>
  );
}

export default IconButtonWithTooltip;
