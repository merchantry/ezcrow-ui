import React, { useState } from 'react';
import styles from './ApiLoadingScreen.module.scss';
import { useWindowEvent } from 'utils/hooks';
import {
  WEB3_REQUEST_COMPLETED_EVENT,
  WEB3_REQUEST_FAILED_EVENT,
  WEB3_REQUEST_SENT_EVENT,
} from 'web3/api';
import LoadingAnimation from 'components/LoadingAnimation';
import { useAlert } from 'components/AlertContainer/AlertContainer';

function ApiLoadingScreen() {
  const triggerAlert = useAlert();
  const [loading, setLoading] = useState(false);

  useWindowEvent(WEB3_REQUEST_SENT_EVENT, () => {
    setLoading(true);
  });

  useWindowEvent(WEB3_REQUEST_COMPLETED_EVENT, () => {
    setLoading(false);
  });

  useWindowEvent(WEB3_REQUEST_FAILED_EVENT, () => {
    setLoading(false);
    triggerAlert('Transaction failed', 'error');
  });

  if (!loading) return null;

  return (
    <div className={styles.container}>
      <LoadingAnimation />
    </div>
  );
}

export default ApiLoadingScreen;
