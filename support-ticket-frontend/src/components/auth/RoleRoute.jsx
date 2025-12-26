import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

export default function RoleRoute({ children, allowedRoles, role }) {
  const roles = allowedRoles || (Array.isArray(role) ? role : [role]);
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    // You can redirect to an "Access denied" page if you want
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
}

export const AdminRoute = ({ children }) => (
  <RoleRoute allowedRoles={[ROLES.ADMIN]}>{children}</RoleRoute>
);

export const AgentRoute = ({ children }) => (
  <RoleRoute allowedRoles={[ROLES.AGENT]}>{children}</RoleRoute>
);

export const CustomerRoute = ({ children }) => (
  <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>{children}</RoleRoute>
);
