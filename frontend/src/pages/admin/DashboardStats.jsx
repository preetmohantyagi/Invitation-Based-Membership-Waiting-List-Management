import StatCard from "./StatCard";

const DashboardStats = ({ stats }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard title="Total Applicants" value={stats.totalApplicants} />

      <StatCard title="Pending" value={stats.pendingApplications} />

      <StatCard title="Under Review" value={stats.underReviewApplications} />

      <StatCard title="Approved Users" value={stats.approvedUsers} />

      <StatCard title="Rejected" value={stats.rejectedApplications} />
    </div>
  );
};

export default DashboardStats;
