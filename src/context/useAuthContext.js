import { useContext } from 'react';
import { AuthContext } from './auth-context.js';

export function useAuthContext() {
  return useContext(AuthContext);
}
