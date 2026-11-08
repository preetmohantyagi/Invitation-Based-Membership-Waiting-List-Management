import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useMemberInvitations from "./hooks/useMemberInvitations";
import InvitationQuotaCard from "./InvitationQuotaCard";
import MemberInvitationForm from "./MemberInvitationForm";
import GeneratedInvitation from "./GeneratedInvitation";
import MemberInvitationList from "./MemberInvitationList";

const MemberInvitationSection = () => {
  const { user } = useAuth();
  const { invitations, loading, createInvitation } = useMemberInvitations();
  const [generatedCode, setGeneratedCode] = useState("");
  const [message, setMessage] = useState("");

  const total = user.invitationQuota ?? 0;
  const used = user.invitationsCreated ?? 0;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setGeneratedCode("");

    const formData = new FormData(event.target);
    const result = await createInvitation({
      maxUses: Number(formData.get("maxUses")),
      expiresAt: formData.get("expiresAt") || null,
    });

    if (result.success) {
      setGeneratedCode(result.code);
      event.target.reset();
    } else {
      setMessage(result.message);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Invite Someone
      </h2>

      <div className="mt-4">
        <InvitationQuotaCard total={total} used={used} />
      </div>

      <MemberInvitationForm
        onSubmit={handleSubmit}
        disabled={used >= total}
      />

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

      <GeneratedInvitation code={generatedCode} />

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading invitations...</p>
      ) : (
        <MemberInvitationList invitations={invitations} />
      )}
    </section>
  );
};

export default MemberInvitationSection;
