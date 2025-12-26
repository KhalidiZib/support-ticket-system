import { createContext, useContext } from "react";

/**
 * AuthContext stores:
 * - user (logged-in user object)
 * - loading (initial auth check)
 * - login(userData)
 * - logout()
 */
const AuthContext = createContext(null);

// Custom hook (recommended usage)
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
