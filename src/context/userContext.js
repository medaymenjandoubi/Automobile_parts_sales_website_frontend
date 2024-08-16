// src/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    setUserRole(user?.role[0]);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
