import React from 'react';

import styles from './Modal.module.scss';
import CloseButton from 'components/CloseButton/CloseButton';

interface ModalProps {
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

interface ModalComponentProps {
  children?: React.ReactNode;
  className?: string;
}

function Modal({ title, children, onClose, className }: ModalProps) {
  return (
    <div className={`${styles.modal} ${className}`}>
      <div className={styles.header}>
        <div>{!!title && <h3>{title}</h3>}</div>
        {!!onClose && <CloseButton onClick={onClose} />}
      </div>
      {children}
    </div>
  );
}

function ModalBody({ children, className }: ModalComponentProps) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

function ModalFooter({ children, className }: ModalComponentProps) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
