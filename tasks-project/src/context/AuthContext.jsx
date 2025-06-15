// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));


  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    setToken(savedToken);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  const [userPerms, setUserPerms] = useState({});
  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/users/me/permissions/', {
      headers: { Authorization: `Token ${token}` },
    });
    setUserPerms(response.data);
    console.log(response.data)
  };



  return (
    <AuthContext.Provider value={{ token, login, logout,userPerms }}>
      {children}
    </AuthContext.Provider>
  );
};
