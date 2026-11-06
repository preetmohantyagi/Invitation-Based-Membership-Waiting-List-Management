import StatCard from "./StatCard";

const DashboardStats = ({ stats }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Members"
        value={stats.totalMembers}
      />

      <StatCard
        title="Pending Applications"
        value={stats.pendingApplications}
      />

      <StatCard
        title="Active Members"
        value={stats.activeMembers}
      />

      <StatCard
        title="Total Admins"
        value={stats.totalAdmins}
      />
    </div>
  );
};

export default DashboardStats;