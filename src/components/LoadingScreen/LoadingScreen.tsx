import React from 'react';
import styles from './LoadingScreen.module.scss';
import { Box, CircularProgress } from '@mui/material';

function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}

export default LoadingScreen;
