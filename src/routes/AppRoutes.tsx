import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { Login } from '../pages/Login/Login';
import { Onboarding } from '../pages/Onboarding/Onboarding';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Ledger } from '../pages/Ledger/Ledger';
import { Profile } from '../pages/Profile/Profile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Onboarding Routes - No auth required but user must be logged in */}
      <Route path="/onboarding" element={
        <PrivateRoute>
          <Onboarding />
        </PrivateRoute>
      } />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/ledger" element={
        <PrivateRoute>
          <Ledger />
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
    </Routes>
  );
};