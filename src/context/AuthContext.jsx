import { AuthContext } from './auth-context.js';

export function AuthProvider({ children, value = null }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
