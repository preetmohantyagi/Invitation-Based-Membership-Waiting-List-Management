import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const MemberRoute = ({ children }) => {
  const { user, loading } = useAuth();
  return loading ? (
    "Checking Session..."
  ) : !user ? (
    <Navigate to="/login" replace />
  ) : user.accountStatus === "ACTIVE" ? (
    children
  ) : (
    <Navigate to="/pending-approval" replace />
  );
};

export default MemberRoute;
