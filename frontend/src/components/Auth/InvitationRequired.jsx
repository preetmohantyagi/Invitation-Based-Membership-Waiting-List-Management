import { useState } from "react";
import api from "../../services/api";
import AuthMessage from "./AuthMessage";

const InvitationRequired = ({ initialCode, onValidCode }) => {
  const [code, setCode] = useState(initialCode);
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setChecking(true);

    try {
      await api.post("/api/invitations/validate", { code });
      onValidCode(code.trim().toUpperCase());
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not check the code");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Invitation Required
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          DNEG is invitation-only. Enter your invitation code to apply for
          membership. A valid code lets you apply, but does not guarantee
          approval.
        </p>
      </div>

      <AuthMessage message={message} />

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="INV-XXXXXXXXXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <button
          type="submit"
          disabled={checking}
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default InvitationRequired;
