function InvitationTableRow({ invitation, onRevoke }) {
  return (
    <tr className="border-t border-slate-200">
      <td className="p-4">{invitation.code}</td>

      <td className="p-4">
        {invitation.usedCount} / {invitation.maxUses}
      </td>

      <td className="p-4">
        {invitation.maxUses - invitation.usedCount}
      </td>

      <td className="p-4">
        {invitation.expiresAt
          ? new Date(invitation.expiresAt).toLocaleDateString()
          : "Never"}
      </td>

      <td className="p-4">{invitation.status}</td>

      <td className="p-4">
        {invitation.status !== "REVOKED" && (
          <button
            onClick={() => onRevoke(invitation._id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Revoke
          </button>
        )}
      </td>
    </tr>
  );
}

export default InvitationTableRow;