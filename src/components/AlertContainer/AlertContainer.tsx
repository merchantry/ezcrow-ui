import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { MouseEventHandler, useRef, useState } from 'react';
import AlertContext from './AlertContext';
import BaseButton from 'components/BaseButton';
import styles from './AlertContainer.module.scss';
import { AlertConfig } from './types';
import { getThemeColor } from 'mui/helpers';
import theme from 'mui/theme';
import { BaseButtonProps } from 'components/BaseButton/BaseButton';

interface AlertContainerProps {
  children: React.ReactNode;
}

const DEFAULT_AUTO_HIDE_DURATION = 5000;
const DEFAULT_BUTTON_TEXT = 'OK';

const getButtonTextColor = (color: string) => getThemeColor(color, theme);

function ActionButton({ to, ...rest }: { to?: string } & BaseButtonProps) {
  return to ? (
    <a href={to}>
      <BaseButton {...rest} />
    </a>
  ) : (
    <BaseButton {...rest} />
  );
}

function AlertContainer({ children }: AlertContainerProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [autoHideDuration, setAutoHideDuration] = useState(DEFAULT_AUTO_HIDE_DURATION);
  const [buttonText, setButtonText] = useState(DEFAULT_BUTTON_TEXT);
  const [buttonColor, setButtonColor] = useState<string>();
  const [buttonLink, setButtonLink] = useState<string>();
  const onClickRef = useRef<MouseEventHandler<HTMLButtonElement>>();

  const triggerAlert = (message: string, severity: AlertColor = 'info', config?: AlertConfig) => {
    const {
      autoHideDuration = DEFAULT_AUTO_HIDE_DURATION,
      buttonText = DEFAULT_BUTTON_TEXT,
      buttonLink,
      onClick,
    } = config || {};

    setMessage(message);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
    setButtonText(buttonText);
    setButtonLink(buttonLink);
    setButtonColor(getButtonTextColor(severity));
    if (onClick) {
      onClickRef.current = e => {
        e.preventDefault();

        onClick();
        closeAlert();
      };
    }
    setOpen(true);
  };

  const closeAlert = () => {
    setOpen(false);
    setTimeout(() => {
      onClickRef.current = undefined;
    }, 500);
  };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;

    closeAlert();
  };

  return (
    <AlertContext.Provider value={triggerAlert}>
      <div>
        {children}
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
          <Alert variant="filled" severity={severity}>
            <div className={styles.textContainer}>
              {message}
              {onClickRef.current && (
                <ActionButton
                  to={buttonLink}
                  style={{ color: buttonColor }}
                  onClick={onClickRef.current}
                >
                  {buttonText}
                </ActionButton>
              )}
            </div>
          </Alert>
        </Snackbar>
      </div>
    </AlertContext.Provider>
  );
}

export default AlertContainer;
