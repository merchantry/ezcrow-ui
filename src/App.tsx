import React from 'react';
import Routes from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import theme from 'mui/theme';
import ContextData from 'components/ContextData';
import AlertContainer from 'components/AlertContainer';
import ApiLoadingScreen from 'components/ApiLoadingScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextData>
        <AlertContainer>
          <Routes />
          <ApiLoadingScreen />
        </AlertContainer>
      </ContextData>
    </ThemeProvider>
  );
}

export default App;
