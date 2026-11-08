import { useEffect, useState } from "react";
import api from "../../services/api";

// Admin page: ACTIVE / SUSPENDED members, their quota and suspend/reactivate
const MemberQuotaRow = ({ member, onSaved }) => {
  const [quota, setQuota] = useState(member.invitationQuota);
  const [saving, setSaving] = useState(false);

  const isSuspended = member.accountStatus === "SUSPENDED";

  const handleSave = async () => {
    if (!Number.isInteger(Number(quota)) || Number(quota) < 0) {
      alert("Please enter a valid non-negative quota.");
      return;
    }
    try {
      setSaving(true);
      const response = await api.patch(
        `/api/admin/members/${member._id}/quota`,
        {
          invitationQuota: Number(quota),
        },
      );
      onSaved(response.data.member);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quota");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async () => {
    const newStatus = isSuspended ? "ACTIVE" : "SUSPENDED";
    const question = isSuspended
      ? `Reactivate ${member.fullName}?`
      : `Suspend ${member.fullName}? They will lose member access.`;
    if (!window.confirm(question)) return;

    try {
      const response = await api.patch(
        `/api/admin/members/${member._id}/status`,
        {
          accountStatus: newStatus,
        },
      );
      onSaved(response.data.member);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const remaining = Math.max(
    0,
    member.invitationQuota - member.invitationsCreated,
  );

  return (
    <tr className="border-t border-slate-200">
      <td className="p-4 font-medium text-slate-900">{member.fullName}</td>
      <td className="p-4 text-slate-600">{member.email}</td>
      <td className="p-4">{member.accountStatus}</td>
      <td className="p-4">{member.invitationQuota}</td>
      <td className="p-4">{member.invitationsCreated}</td>
      <td className="p-4">{remaining}</td>
      <td className="p-4">
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={quota}
            disabled={isSuspended}
            onChange={(e) => setQuota(e.target.value)}
            className="w-24 rounded-lg border border-slate-300 px-3 py-1 disabled:bg-slate-100"
          />
          <button
            onClick={handleSave}
            disabled={saving || isSuspended}
            className="rounded-lg bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </td>
      <td className="p-4">
        <button
          onClick={handleStatusChange}
          className={`rounded-lg px-4 py-1 text-sm font-medium ${
            isSuspended
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {isSuspended ? "Reactivate" : "Suspend"}
        </button>
      </td>
    </tr>
  );
};

const MemberQuotas = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/api/admin/members");
        setMembers(response.data.members ?? []);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const handleSaved = (updatedMember) => {
    setMembers((previous) =>
      previous.map((member) =>
        member._id === updatedMember._id ? updatedMember : member,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-slate-900">Members</h1>
        <p className="mt-2 text-slate-600">
          Set invitation quotas, and suspend or reactivate members.
        </p>

        {loading ? (
          <p className="mt-6 text-slate-500">Loading members...</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total Quota</th>
                  <th className="p-4">Generated</th>
                  <th className="p-4">Remaining</th>
                  <th className="p-4">Update Quota</th>
                  <th className="p-4">Access</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <MemberQuotaRow
                      key={`${member._id}-${member.accountStatus}-${member.invitationQuota}`}
                      member={member}
                      onSaved={handleSaved}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500">
                      No members yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberQuotas;
