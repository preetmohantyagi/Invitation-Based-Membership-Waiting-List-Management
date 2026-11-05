import React from "react";
import { useState, useEffect } from "react";
import api from "../services/api";
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAdmins: 0,
    pendingApplications: 0,
    activeMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
  };
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get("/api/admin/", {
          params: {
            search: search,
            status: status,
            priority: priority,
          },
        });

        setApplications(response.data.applications);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchApplications();
  }, [search, status, priority]);
  const handleApplicationAction = async (applicationId, action) => {
    try {
      const response = await api.patch(
        `/api/admin/applications/${applicationId}/${action}`,
      );

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: response.data.applicationStatus }
            : application,
        ),
      );

      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || `${action} failed`);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

          <p className="mt-2 text-slate-500">
            Manage DNEG members and membership applications.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-slate-500">Total Members</p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalMembers}
              </p>
            </h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-slate-500">
              Pending Applications
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              <p className="text-3xl font-bold text-slate-900">
                {stats.pendingApplications}
              </p>
            </h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-slate-500">Active Members</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              <p className="text-3xl font-bold text-slate-900">
                {stats.activeMembers}
              </p>
            </h2>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-md">
            <p className="text-sm font-medium text-slate-500">Total Admins</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalAdmins}
              </p>
            </h2>
          </div>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Membership Applications
          </h2>
          <p className="mt-2 text-slate-500">
            Review and manage membership requests.
          </p>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search by member name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:max-w-md"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:max-w-md"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 md:max-w-md"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-md">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Member Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-slate-100"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {application.user?.fullName || "Unknown"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {application.user?.email || "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusColors[application.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {application.status.charAt(0) +
                            application.status
                              .slice(1)
                              .toLowerCase()
                              .replace("_", " ")}
                        </span>
                      </td>

                      {["PENDING", "UNDER_REVIEW"].includes(
                        application.status,
                      ) ? (
                        <div className="flex gap-2">
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleApplicationAction(
                                    application._id,
                                    "approve",
                                  )
                                }
                                className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleApplicationAction(
                                    application._id,
                                    "reject",
                                  )
                                }
                                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </div>
                      ) : (
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400">
                            No actions available
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
