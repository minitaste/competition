import React, { createContext, useEffect, useState } from "react";
import { ACCESS_TOKEN } from "./constants";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async (token) => {
    try {
      const response = await api.get(`/api/user/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      fetchUser(token);
    } 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
