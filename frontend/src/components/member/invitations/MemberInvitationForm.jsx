const MemberInvitationForm = ({ onSubmit, disabled }) => {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Maximum Redemptions
        </label>
        <input
          type="number"
          name="maxUses"
          min="1"
          step="1"
          defaultValue="1"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Expiry Date (optional)
        </label>
        <input
          type="date"
          name="expiresAt"
          min={tomorrow}
          className="w-full rounded-lg border border-slate-300 px-4 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-slate-900 px-5 py-2 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Generate Invitation
      </button>
      {disabled && (
        <p className="text-sm text-slate-500">
          Your invitation quota is exhausted.
        </p>
      )}
    </form>
  );
};

export default MemberInvitationForm;
