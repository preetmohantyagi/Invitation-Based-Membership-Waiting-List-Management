import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Member-only pages: logged in, role USER and accountStatus ACTIVE
const MemberRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Checking Session...</p>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  if (user.accountStatus !== "ACTIVE") {
    return <Navigate to="/pending-approval" replace />;
  }
  return children;
};

export default MemberRoute;
