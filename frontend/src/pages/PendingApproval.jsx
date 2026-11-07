import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PendingApproval = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Checking Session...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.accountStatus === "ACTIVE") {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg rounded-xl bg-white p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Application Under Review
        </h1>
        <p className="mt-4 text-slate-600">
          Your DNEG membership application is waiting for admin approval.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;
