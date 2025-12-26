import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { fetchCurrentUser } from "../services/authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on startup
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("sts_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentUser();
        console.log("DEBUG: AuthProvider fetched user:", data);
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("AuthProvider: loadUser failed", err);
        setError(err.message || "Failed to load user");
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // LOGIN (sets token + user)
  const login = (payload) => {
    if (payload.token) {
      localStorage.setItem("sts_token", payload.token);
    }
    setUser({
      email: payload.email,
      role: payload.role,
      name: payload.name,
      id: payload.id,
    });
    setError(null);
  };

  const logout = () => {
    localStorage.removeItem("sts_token");
    setUser(null);
  };

  const updateUser = (updatedData) => {
    if (!user) return;
    setUser({ ...user, ...updatedData });
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
