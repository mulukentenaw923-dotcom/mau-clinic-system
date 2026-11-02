import { useContext } from 'react';
import { NotificationContext } from './notification-context.js';

export function useNotificationContext() {
  return useContext(NotificationContext);
}
