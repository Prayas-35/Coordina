"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (token) => {
    setToken(token);
    Cookies.set('token', token, { expires: 30 });
  };

  const logout = () => {
    setToken(null);
    Cookies.remove('token');
  };

  useEffect(() => {
    const tokenFromCookie = Cookies.get('token');
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};