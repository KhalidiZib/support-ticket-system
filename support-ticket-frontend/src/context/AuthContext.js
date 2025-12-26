import { createContext, useContext } from "react";

const AuthContext = createContext(null);

// Custom hook to access the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
