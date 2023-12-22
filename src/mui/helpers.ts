import { Theme, buttonClasses } from '@mui/material';

const uiColors = ['primary', 'warning', 'error', 'success', 'info'] as const;
export type ColorType = (typeof uiColors)[number];

export const getThemeColor = (color: string | undefined, theme: Theme) => {
  const isUIColor = !!color && uiColors.includes(color as ColorType);
  return isUIColor ? theme.palette[color as ColorType].main : '';
};

export const buttonWithColor = (color: string | undefined, theme: Theme) => {
  const backgroundColor = getThemeColor(color, theme);

  return {
    [`&.${buttonClasses.root}:hover`]: {
      backgroundColor,
    },
    [`&.${buttonClasses.disabled}`]: {
      backgroundColor,
      opacity: 0.5,
    },
  };
};
