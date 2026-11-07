const AuditHistory = ({ history }) => {
  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-xl font-semibold text-slate-900">Review History</h2>

      {history.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No history yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {history.map((log) => (
            <li key={log._id} className="rounded-lg bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">
                {log.action.replaceAll("_", " ")}
              </p>
              <p className="text-slate-600">{log.details}</p>
              <p className="mt-1 text-xs text-slate-500">
                by {log.performedBy?.fullName || "Unknown"} on{" "}
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AuditHistory;
