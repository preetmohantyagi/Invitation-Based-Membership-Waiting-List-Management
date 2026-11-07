import { useState } from "react";

import InvitationPageHeader from "../../components/admin/invitations/InvitationPageHeader";
import CreateInvitationButton from "../../components/admin/invitations/CreateInvitationButton";
import InvitationStats from "../../components/admin/invitations/InvitationStats";
import InvitationTable from "../../components/admin/invitations/InvitationTable";
import CreateInvitationForm from "../../components/admin/invitations/CreateInvitationForm";
import useInvitations from "../../components/admin/invitations/hooks/useInvitations";

function InvitationManagement() {
  const { invitations, loading, stats, createInvitation, revokeInvitation } =
    useInvitations();

  const [showForm, setShowForm] = useState(false);
  
  async function handleCreateInvitation(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const invitationData = {
      maxUses: Number(formData.get("maxUses")),
      expiresAt: formData.get("expiresAt") || null,
    };

    const result = await createInvitation(invitationData);

    if (result.success) {
      alert(`Invitation created successfully! Code: ${result.code}`);
      setShowForm(false);
    } else {
      alert(result.message);
    }
  }
  async function handleRevokeInvitation(invitationId) {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this invitation?",
    );

    if (!confirmed) return;

    const result = await revokeInvitation(invitationId);

    if (result.success) {
      alert("Invitation revoked successfully!");
    } else {
      alert(result.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <InvitationPageHeader />

          <CreateInvitationButton onClick={() => setShowForm(true)} />
        </div>

        <InvitationStats stats={stats} />
        {showForm && (
          <CreateInvitationForm
            onSubmit={handleCreateInvitation}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <p className="text-center text-slate-600">Loading invitations...</p>
        ) : (
          <InvitationTable
            invitations={invitations}
            onRevoke={handleRevokeInvitation}
          />
        )}
      </div>
    </div>
  );
}

export default InvitationManagement;
