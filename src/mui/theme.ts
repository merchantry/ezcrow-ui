import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#061b2a',
    },
    secondary: {
      main: '#fff',
      dark: '#f2f2f2',
      light: '#fff',
    },
    warning: {
      main: '#eadd15',
    },
    error: {
      main: '#ff4242',
    },
    success: {
      main: '#3ab05b',
    },
    info: {
      main: '#308dcf',
    },
  },
});

export default theme;
