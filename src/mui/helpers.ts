import { Theme, buttonClasses } from '@mui/material';

const uiColors = ['primary', 'warning', 'error', 'success', 'info'] as const;
export type ColorType = (typeof uiColors)[number];

export const getThemeColor = (color: string | undefined, theme: Theme) => {
  const isUIColor = !!color && uiColors.includes(color as ColorType);
  return isUIColor ? theme.palette[color as ColorType].main : '';
};

export const buttonWithColor = (_color: string | undefined, theme: Theme) => {
  const color = getThemeColor(_color, theme);
  const backgroundColor = getThemeColor('primary', theme);

  return {
    [`&.${buttonClasses.root}`]: {
      color,
      backgroundColor,
    },
    [`&.${buttonClasses.root}:hover`]: {
      color,
      backgroundColor,
    },
    [`&.${buttonClasses.root} svg`]: {
      fill: color,
    },
    [`&.${buttonClasses.disabled}`]: {
      color,
      backgroundColor,
      opacity: 0.5,
    },
  };
};
