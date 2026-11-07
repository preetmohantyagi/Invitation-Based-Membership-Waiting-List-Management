import { useState } from "react";

// Internal notes, only visible to admins
const AdminNotes = ({ initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(notes);
    setSaving(false);
  };

  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-xl font-semibold text-slate-900">
        Internal Admin Notes
      </h2>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          placeholder="Notes visible only to admins..."
        />
        <button
          type="submit"
          disabled={saving}
          className="mt-3 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </form>
    </section>
  );
};

export default AdminNotes;
