import { useState, useEffect } from "react";
import api from "../../../../services/api";
import { useAuth } from "../../../../context/AuthContext";

function useMemberInvitations() {
  const { setUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchInvitations() {
    try {
      const response = await api.get("/api/users/invitations");
      setInvitations(response.data.invitations ?? []);
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
      const response = await api.post("/api/invitations/member", invitationData);

      // keep quota numbers in sync with the backend response
      setUser((previousUser) => ({
        ...previousUser,
        invitationQuota: response.data.quota.total,
        invitationsCreated: response.data.quota.used,
      }));

      await fetchInvitations();

      return { success: true, code: response.data.code };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  useEffect(() => {
    fetchInvitations();
  }, []);

  return { invitations, loading, createInvitation };
}

export default useMemberInvitations;
