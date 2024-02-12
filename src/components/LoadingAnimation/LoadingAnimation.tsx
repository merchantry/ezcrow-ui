import React from 'react';
import styles from './LoadingAnimation.module.scss';
import { Box, CircularProgress } from '@mui/material';

function LoadingAnimation() {
  return (
    <div className={styles.wrapper}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}

export default LoadingAnimation;
