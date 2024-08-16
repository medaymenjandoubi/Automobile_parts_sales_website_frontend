// src/components/Layout.js
import React from 'react';
import { Provider } from './context/index.js';
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar.js';

const Layout = () => {
  return (
    <Provider>
      <div style={{width:"100%"}}><NavBar/></div>
      <Outlet />
    </Provider>
  );
};

export default Layout;
