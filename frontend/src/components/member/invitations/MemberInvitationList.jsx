const MemberInvitationList = ({ invitations }) => {
  if (invitations.length === 0) {
    return (
      <p className="mt-6 text-sm text-slate-500">
        You have not generated any invitations yet.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">
        Your Invitations
      </h3>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Used</th>
            <th className="px-4 py-3">Expiry</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => (
            <tr key={invitation._id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium">{invitation.code}</td>
              <td className="px-4 py-3">
                {invitation.usedCount} / {invitation.maxUses}
              </td>
              <td className="px-4 py-3">
                {invitation.expiresAt
                  ? new Date(invitation.expiresAt).toLocaleDateString()
                  : "Never"}
              </td>
              <td className="px-4 py-3">{invitation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberInvitationList;
