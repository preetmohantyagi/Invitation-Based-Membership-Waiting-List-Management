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

  async function fetchInvitations() {
    try {
      const response = await api.get("/api/admin/invitations");

      setInvitations(response.data.invitations);
      setStats(calculateInvitationStats(response.data.invitations));
    } catch (error) {
      console.error(
        "Failed to fetch invitations:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  }
  async function createInvitation(invitationData) {
    try {
      const response = await api.post("/api/admin/invitations", invitationData);

      await fetchInvitations();

      return {
        success: true,
        code: response.data.code,
      };
    } catch (error) {
      console.error(
        "Failed to create invitation:",
        error.response?.data?.message || error.message,
      );

      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }
  async function revokeInvitation(invitationId) {
    try {
      await api.patch(`/api/admin/invitations/${invitationId}/revoke`);

      await fetchInvitations();

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        "Failed to revoke invitation:",
        error.response?.data?.message || error.message,
      );

      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, []);
  return {
    invitations,
    loading,
    stats,
    createInvitation,
    revokeInvitation
  };
}

export default useInvitations;
