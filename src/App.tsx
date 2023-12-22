import React from 'react';
import Routes from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'mui/theme';
import ContextData from 'components/ContextData';
import AlertContainer from 'components/AlertContainer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextData>
        <AlertContainer>
          <Routes />
        </AlertContainer>
      </ContextData>
    </ThemeProvider>
  );
}

export default App;
