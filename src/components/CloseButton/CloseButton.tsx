import React from 'react';

import styles from './CloseButton.module.scss';
import { FaXmark } from 'react-icons/fa6';

export interface CloseButtonProps {
  onClick?: () => void;
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <div className={styles.closeButton} onClick={onClick}>
      <FaXmark />
    </div>
  );
}

export default CloseButton;
