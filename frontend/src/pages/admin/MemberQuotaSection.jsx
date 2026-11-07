import { useState } from "react";
import api from "../../services/api";

// Shows quota numbers and lets an admin change one ACTIVE member's quota
const MemberQuotaSection = ({ member, onQuotaUpdated }) => {
  const [invitationQuota, setInvitationQuota] = useState(
    member.invitationQuota ?? 0,
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleQuotaUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !Number.isInteger(Number(invitationQuota)) ||
      Number(invitationQuota) < 0
    ) {
      setMessage("Please enter a valid non-negative quota.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch(`/api/admin/members/${member._id}/quota`, {
        invitationQuota: Number(invitationQuota),
      });

      onQuotaUpdated(response.data.member);
      setMessage("Member invitation quota updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update invitation quota.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Member Invitation Quota
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Total Quota</p>
          <p className="mt-1 text-2xl font-bold">{member.invitationQuota ?? 0}</p>
        </div>

        <div className="rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Created</p>
          <p className="mt-1 text-2xl font-bold">
            {member.invitationsCreated ?? 0}
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-500">Remaining</p>
          <p className="mt-1 text-2xl font-bold">
            {Math.max(
              0,
              (member.invitationQuota ?? 0) - (member.invitationsCreated ?? 0),
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleQuotaUpdate} className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Set New Invitation Quota
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={invitationQuota}
          onChange={(e) => setInvitationQuota(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          disabled={saving}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Quota"}
        </button>

        {message && <p className="mt-3 text-sm text-slate-700">{message}</p>}
      </form>
    </section>
  );
};

export default MemberQuotaSection;
