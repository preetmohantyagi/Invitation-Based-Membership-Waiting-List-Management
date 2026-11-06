import { useState } from "react";

import InvitationPageHeader from "../../components/admin/invitations/InvitationPageHeader";
import CreateInvitationButton from "../../components/admin/invitations/CreateInvitationButton";
import InvitationStats from "../../components/admin/invitations/InvitationStats";
import InvitationTable from "../../components/admin/invitations/InvitationTable";
import CreateInvitationForm from "../../components/admin/invitations/CreateInvitationForm";
import useInvitations from "../../components/admin/invitations/hooks/useInvitations";

// Calculate invitation statistics

function InvitationManagement() {
  const { invitations, loading, stats } = useInvitations();
  const [showForm, setShowForm] = useState(false);

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
            onSubmit={(event) => event.preventDefault()}
            onCancel={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <p className="text-center text-slate-600">Loading invitations...</p>
        ) : (
          <InvitationTable invitations={invitations} onRevoke={() => {}} />
        )}
      </div>
    </div>
  );
}

export default InvitationManagement;
