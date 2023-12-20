import React from 'react';

import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 13,
    cursor: 'help',
  },
}));

export default Tooltip;
