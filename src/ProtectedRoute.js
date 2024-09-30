// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {

  return localStorage.getItem('token') ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
