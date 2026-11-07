import { useState, useEffect } from "react";
import api from "../../../../services/api";

function calculateInvitationStats(invitations) {
  const now = new Date();

  return {
    totalInvitations: invitations.length,

    activeInvitations: invitations.filter(
      (invitation) =>
        invitation.status === "ACTIVE" &&
        (!invitation.expiresAt || new Date(invitation.expiresAt) > now) &&
        invitation.usedCount < invitation.maxUses,
    ).length,

    revokedInvitations: invitations.filter(
      (invitation) => invitation.status === "REVOKED",
    ).length,
  };
}

function useInvitations() {
  const [stats, setStats] = useState({
    totalInvitations: 0,
    activeInvitations: 0,
    revokedInvitations: 0,
  });
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInvitations(response.data.invitations);
    setStats(calculateInvitationStats(response.data.invitations));
    async function fetchInvitations() {
      try {
        const response = await api.get("/api/admin/invitations");

        setInvitations(response.data.invitations);
      } catch (error) {
        console.error(
          "Failed to fetch invitations:",
          error.response?.data?.message || error.message,
        );
      } finally {
        setLoading(false);
      }
    }

    fetchInvitations();
  }, []);

  return {
    invitations,
    loading,
    stats
  };
}

export default useInvitations;
