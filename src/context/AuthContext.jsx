import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../api/mockApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load current user on app start
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser) setUser(currentUser);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const loggedInUser = await api.login(email, password);
      setUser(loggedInUser);
      setError("");
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout user
  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = { user, login, logout, error, setError, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
