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
    totalApplicants: 0,
    pendingApplications: 0,
    underReviewApplications: 0,
    approvedUsers: 0,
    rejectedApplications: 0,
  });

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");

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

  useEffect(() => {
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
            sort: sort,
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
  }, [search, status, priority, sort]);

  const handleApplicationAction = async (applicationId, action, body = {}) => {
    try {
      const response = await api.patch(
        `/api/admin/applications/${applicationId}/${action}`,
        body,
      );

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: response.data.applicationStatus }
            : application,
        ),
      );

      fetchStats();
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || `${action} failed`);
    }
  };

  const handleReject = (applicationId) => {
    const reason = window.prompt("Rejection reason (optional):");
    if (reason === null) return; // admin ne cancel kar diya
    handleApplicationAction(applicationId, "reject", {
      rejectionReason: reason,
    });
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
            sort={sort}
            setSort={setSort}
          />
          {applicationsLoading ? (
            <p className="mt-6 rounded-xl bg-white p-8 text-center text-slate-500">
              Loading applications...
            </p>
          ) : (
            <ApplicationsTable
              applications={applications}
              onReview={(id) => handleApplicationAction(id, "review")}
              onApprove={(id) => handleApplicationAction(id, "approve")}
              onReject={handleReject}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
