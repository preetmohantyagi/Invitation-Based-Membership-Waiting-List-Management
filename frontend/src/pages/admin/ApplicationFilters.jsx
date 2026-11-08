const selectClass =
  "rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500";

const ApplicationFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  sort,
  setSort,
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <input
        type="text"
        placeholder="Search by name, email or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={selectClass}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
        <option value="WITHDRAWN">Withdrawn</option>
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className={selectClass}
      >
        <option value="">All Priorities</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={selectClass}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Highest priority first</option>
      </select>
    </div>
  );
};

export default ApplicationFilters;
