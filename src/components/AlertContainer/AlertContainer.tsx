import { Alert, AlertColor, Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';
import { useWindowEvent } from 'utils/hooks';
import api from 'web3/api';

interface AlertContainerProps {
  children: React.ReactNode;
}

type TriggerAlert = (message: string, severity?: AlertColor, autoHideDuration?: number) => void;

const AlertContext = createContext<TriggerAlert | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error('useAlert must be used within a AlertContextProvider');
  }

  return context;
};

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

  useWindowEvent(api.WEB3_REQUEST_SENT, (e: Event | CustomEvent) => {
    triggerAlert((e as CustomEvent<string>).detail, 'info');
  });

  useWindowEvent(api.WEB3_REQUEST_COMPLETED, (e: Event | CustomEvent) => {
    triggerAlert((e as CustomEvent<string>).detail, 'success');
  });

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
