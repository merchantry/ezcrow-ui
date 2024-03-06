import { AlertColor } from '@mui/material';
import { createContext } from 'react';

type TriggerAlert = (message: string, severity?: AlertColor, autoHideDuration?: number) => void;

const AlertContext = createContext<TriggerAlert | null>(null);

export default AlertContext;
