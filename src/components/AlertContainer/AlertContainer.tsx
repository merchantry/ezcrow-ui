import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import AlertContext from './AlertContext';

interface AlertContainerProps {
  children: React.ReactNode;
}

function AlertContainer({ children }: AlertContainerProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [autoHideDuration, setAutoHideDuration] = useState(5000);

  const triggerAlert = (
    message: string,
    severity: AlertColor = 'info',
    autoHideDuration = 5000,
  ) => {
    setMessage(message);
    setSeverity(severity);
    setAutoHideDuration(autoHideDuration);
    setOpen(true);
  };

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <AlertContext.Provider value={triggerAlert}>
      <div>
        {children}
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
          <Alert variant="filled" severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </AlertContext.Provider>
  );
}

export default AlertContainer;
