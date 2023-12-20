import React from 'react';
import Routes from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'mui/theme';
import ContextData from 'components/ContextData';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextData>
        <Routes />
      </ContextData>
    </ThemeProvider>
  );
}

export default App;
