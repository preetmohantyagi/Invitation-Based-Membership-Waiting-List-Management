import { useState, useEffect } from "react";
import api from "../services/api";
import DashboardHeader from "./admin/DashboardHeader";
import ApplicationFilters from "./admin/ApplicationFilters";
import DashboardStats from "./admin/DashboardStats";
import ApplicationsTable from "./admin/ApplicationsTable";
const AdminDashboard = () => {
  const [statsLoading, setStatsLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAdmins: 0,
    pendingApplications: 0,
    activeMembers: 0,
  });

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/admin/stats");
        setStats(response.data);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setApplicationsLoading(true);
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
      } finally {
        setApplicationsLoading(false);
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
          <DashboardHeader />
        </div>
        <DashboardStats stats={stats} />
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Membership Applications
          </h2>
          <p className="mt-2 text-slate-500">
            Review and manage membership requests.
          </p>
          <ApplicationFilters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
          />
          {applicationsLoading ? (
            <p className="mt-6 rounded-xl bg-white p-8 text-center text-slate-500">
              Loading applications...
            </p>
          ) : (
            <ApplicationsTable
              applications={applications}
              onApprove={(id) => handleApplicationAction(id, "approve")}
              onReject={(id) => handleApplicationAction(id, "reject")}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
