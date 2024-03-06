import React, { useState } from 'react';
import styles from './ApiLoadingScreen.module.scss';
import { useWindowEvent } from 'utils/hooks';
import {
  WEB3_REQUEST_COMPLETED_EVENT,
  WEB3_REQUEST_FAILED_EVENT,
  WEB3_REQUEST_MINED_EVENT,
  WEB3_REQUEST_SENT_EVENT,
} from 'web3/api';
import LoadingAnimation from 'components/LoadingAnimation';
import { useAlert } from 'components/AlertContainer/hooks';

function ApiLoadingScreen() {
  const triggerAlert = useAlert();
  const [loading, setLoading] = useState(false);

  useWindowEvent(WEB3_REQUEST_SENT_EVENT, () => {
    setLoading(true);
  });

  useWindowEvent(WEB3_REQUEST_COMPLETED_EVENT, e => {
    const { detail } = e as CustomEvent<string>;
    triggerAlert(detail, 'info');
  });

  useWindowEvent(WEB3_REQUEST_FAILED_EVENT, e => {
    const { detail } = e as CustomEvent<string>;
    setLoading(false);
    triggerAlert(detail, 'error');
  });

  useWindowEvent(WEB3_REQUEST_MINED_EVENT, e => {
    const { detail } = e as CustomEvent<string>;
    setLoading(false);
    triggerAlert(detail, 'success');
  });

  if (!loading) return null;

  return (
    <div className={styles.container}>
      <LoadingAnimation />
    </div>
  );
}

export default ApiLoadingScreen;
