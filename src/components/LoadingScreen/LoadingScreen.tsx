import React from 'react';
import styles from './LoadingScreen.module.scss';
import LoadingAnimation from 'components/LoadingAnimation';

function LoadingScreen() {
  return (
    <div className={styles.wrapper}>
      <LoadingAnimation />
    </div>
  );
}

export default LoadingScreen;
