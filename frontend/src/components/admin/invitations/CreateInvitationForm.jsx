function CreateInvitationForm({ onSubmit, onCancel }) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5"
    >
      <h2 className="text-xl font-semibold text-slate-900">
        Generate New Invitation
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Maximum Uses
        </label>

        <input
          type="number"
          name="maxUses"
          min="1"
          defaultValue="1"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Expiry Date
        </label>

        <input
          type="date"
          name="expiresAt"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
        >
          Generate
        </button>
      </div>
    </form>
  );
}

export default CreateInvitationForm;