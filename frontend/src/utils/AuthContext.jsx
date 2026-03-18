import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token =
      localStorage.getItem("respecthub_token") ||
      sessionStorage.getItem("respecthub_token");

    const savedUser =
      localStorage.getItem("respecthub_user") ||
      sessionStorage.getItem("respecthub_user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (token, userData, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("respecthub_token", token);
    storage.setItem("respecthub_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("respecthub_token");
    localStorage.removeItem("respecthub_user");
    sessionStorage.removeItem("respecthub_token");
    sessionStorage.removeItem("respecthub_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};