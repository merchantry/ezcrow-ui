import { AlertColor } from '@mui/material';
import { createContext } from 'react';
import { AlertConfig } from './types';

type TriggerAlert = (message: string, severity?: AlertColor, config?: AlertConfig) => void;

const AlertContext = createContext<TriggerAlert | null>(null);

export default AlertContext;
