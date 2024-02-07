import React, { useState } from 'react';
import styles from './ApiLoadingScreen.module.scss';
import { Box, CircularProgress } from '@mui/material';
import { useWindowEvent } from 'utils/hooks';
import { WEB3_REQUEST_COMPLETED_EVENT, WEB3_REQUEST_SENT_EVENT } from 'web3/api';

function ApiLoadingScreen() {
  const [loading, setLoading] = useState(false);

  useWindowEvent(WEB3_REQUEST_SENT_EVENT, () => {
    setLoading(true);
  });

  useWindowEvent(WEB3_REQUEST_COMPLETED_EVENT, () => {
    setLoading(false);
  });

  if (!loading) return null;

  return (
    <div className={styles.container}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  );
}

export default ApiLoadingScreen;
