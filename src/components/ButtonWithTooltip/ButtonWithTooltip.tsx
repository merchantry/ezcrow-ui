import React from 'react';

import styles from './ButtonWithTooltip.module.scss';
import BaseButton, { BaseButtonProps } from 'components/BaseButton/BaseButton';
import Tooltip from 'components/Tooltip';

export interface ButtonWithTooltipProps extends BaseButtonProps {
  tooltip?: string;
  placement?: 'bottom' | 'left' | 'right' | 'top';
}

function ButtonWithTooltip({ tooltip, placement = 'left', ...rest }: ButtonWithTooltipProps) {
  return (
    <Tooltip title={!rest.disabled ? tooltip : undefined} placement={placement}>
      <div className={styles.buttonContainer}>
        <BaseButton {...rest} />
      </div>
    </Tooltip>
  );
}

export default ButtonWithTooltip;
