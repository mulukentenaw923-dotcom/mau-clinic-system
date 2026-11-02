import { NotificationContext } from './notification-context.js';

export function NotificationProvider({ children, value = null }) {
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
