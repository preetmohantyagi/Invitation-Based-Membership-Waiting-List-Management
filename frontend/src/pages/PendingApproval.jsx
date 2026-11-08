import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationList from "../components/NotificationList";
import api from "../services/api";

const accountMessages = {
  PENDING_APPROVAL:
    "Your DNEG membership application is waiting for admin approval.",
  REJECTED: "Your membership application was rejected.",
};

const PendingApproval = () => {
  const { user, loading } = useAuth();
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role === "ADMIN" || user.accountStatus === "ACTIVE") {
      return;
    }
    const fetchApplication = async () => {
      try {
        const response = await api.get("/api/users/application");
        setApplication(response.data);
      } catch (error) {
        setMessage(error.response?.data?.message || "");
      }
    };
    fetchApplication();
  }, [user]);

  if (loading) return <p className="p-6">Checking Session...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user.accountStatus === "ACTIVE") {
    return <Navigate to="/dashboard" replace />;
  }

  const canWithdraw =
    application && ["PENDING", "UNDER_REVIEW"].includes(application.status);

  const handleWithdraw = async () => {
    if (
      !window.confirm("Are you sure you want to withdraw your application?")
    ) {
      return;
    }
    try {
      const response = await api.patch("/api/users/application/withdraw");
      setApplication((previous) => ({
        ...previous,
        status: response.data.status,
      }));
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not withdraw");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-6 p-6">
      <div className="max-w-lg rounded-xl bg-white p-8 text-center shadow-md">
        <h1 className="text-2xl font-bold text-slate-900">
          Membership Application
        </h1>
        <p className="mt-4 text-slate-600">
          {accountMessages[user.accountStatus] ||
            "Your account does not have member access."}
        </p>

        {application && (
          <p className="mt-4 text-sm text-slate-600">
            Application status:{" "}
            <span className="font-semibold">{application.status}</span>
          </p>
        )}
        {application?.rejectionReason && (
          <p className="mt-2 text-sm text-slate-600">
            Reason: {application.rejectionReason}
          </p>
        )}

        {canWithdraw && (
          <button
            onClick={handleWithdraw}
            className="mt-6 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            Withdraw Application
          </button>
        )}

        {message && <p className="mt-4 text-sm text-slate-500">{message}</p>}
      </div>
      <div className="w-full max-w-lg">
        <NotificationList />
      </div>
    </div>
  );
};

export default PendingApproval;
