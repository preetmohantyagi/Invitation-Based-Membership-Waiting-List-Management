import InvitationStatCard from "./InvitationStatCard";

function InvitationStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <InvitationStatCard
        title="Total Invitations"
        value={stats.totalInvitations}
      />

      <InvitationStatCard
        title="Active Invitations"
        value={stats.activeInvitations}
      />

      <InvitationStatCard
        title="Revoked Invitations"
        value={stats.revokedInvitations}
      />
    </div>
  );
}

export default InvitationStats;