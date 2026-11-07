import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const status = user?.accountStatus;
  const statusColors = {
    PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    SUSPENDED: "bg-orange-100 text-orange-800",
    DISABLED: "bg-gray-100 text-gray-800",
  };
  const statusMessages = {
    PENDING_APPROVAL: "Your application is awaiting Admin Approval.",
    ACTIVE: "Your membership is active. Welcome to DNEG!",
    REJECTED: "Your membership application was Rejected.",
    SUSPENDED: "Your membership is currently Suspended.",
    DISABLED: "Your account has been Disabled.",
  };

  const handleClick = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };
  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md">
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome to DNEG
        <p className="mt-2 text-lg font-medium text-slate-700">
          Hello, {user?.fullName}!
        </p>
        <div className="mt-4">
          <span className="text-sm text-slate-600">Membership Status:</span>

          <span
            className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {user?.accountStatus}
          </span>
        </div>
      </h1>
      <p className="mt-2 text-slate-500">
        {statusMessages[status] || "Welcome to DNEG!"}
      </p>{" "}
    </div>
  );
};

export default Dashboard;
