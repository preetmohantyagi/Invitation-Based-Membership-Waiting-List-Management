import { useState } from "react";
import api from "../../../services/api";

function InvitationTableRow({ invitation, onRevoke }) {
  const [showHistory, setShowHistory] = useState(false);
  const [redemptions, setRedemptions] = useState([]);
  const [historyMessage, setHistoryMessage] = useState("");

  async function toggleHistory() {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    try {
      const response = await api.get(
        `/api/admin/invitations/${invitation._id}/redemptions`,
      );
      setRedemptions(response.data.redemptions ?? []);
      setHistoryMessage("");
    } catch (error) {
      setHistoryMessage(
        error.response?.data?.message || "Could not load history",
      );
    }
    setShowHistory(true);
  }

  return (
    <>
      <tr className="border-t border-slate-200">
        <td className="p-4">{invitation.code}</td>

        <td className="p-4">
          {invitation.createdBy
            ? `${invitation.createdBy.fullName} (${invitation.createdBy.role})`
            : "N/A"}
        </td>

        <td className="p-4">
          {invitation.usedCount} / {invitation.maxUses}
        </td>

        <td className="p-4">{invitation.maxUses - invitation.usedCount}</td>

        <td className="p-4">
          {invitation.expiresAt
            ? new Date(invitation.expiresAt).toLocaleDateString()
            : "Never"}
        </td>

        <td className="p-4">{invitation.status}</td>

        <td className="p-4 space-x-4">
          <button
            onClick={toggleHistory}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showHistory ? "Hide History" : "History"}
          </button>
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

      {showHistory && (
        <tr className="bg-slate-50">
          <td colSpan="7" className="p-4 text-sm">
            {historyMessage ? (
              <p className="text-red-600">{historyMessage}</p>
            ) : redemptions.length === 0 ? (
              <p className="text-slate-500">Not redeemed yet.</p>
            ) : (
              <ul className="space-y-1">
                {redemptions.map((redemption) => (
                  <li key={redemption.applicationId}>
                    {redemption.fullName} ({redemption.email}) -{" "}
                    {redemption.applicationStatus}, on{" "}
                    {new Date(redemption.redeemedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

export default InvitationTableRow;
