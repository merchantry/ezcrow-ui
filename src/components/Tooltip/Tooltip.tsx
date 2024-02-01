import React from 'react';
import theme from 'mui/theme';
import { Tooltip as MuiTooltip, TooltipProps, styled, tooltipClasses } from '@mui/material';

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip disableInteractive {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 13,
    cursor: 'help',
    backgroundColor: theme.palette.primary.light,
  },
}));

export default Tooltip;
