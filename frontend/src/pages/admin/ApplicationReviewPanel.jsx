import ActionButton from "./ActionButton";

const priorities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const ApplicationReviewPanel = ({ application, onPriorityChange, onAction }) => {
  const canReview = application.status === "PENDING";
  const canDecide = ["PENDING", "UNDER_REVIEW"].includes(application.status);

  return (
    <section className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-xl font-semibold text-slate-900">Review</h2>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Priority
        </label>
        <select
          value={application.priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {canReview && (
          <ActionButton
            label="Mark Under Review"
            color="blue"
            onClick={() => onAction("review")}
          />
        )}
        {canDecide && (
          <>
            <ActionButton
              label="Approve"
              color="green"
              onClick={() => onAction("approve")}
            />
            <ActionButton
              label="Reject"
              color="red"
              onClick={() => onAction("reject")}
            />
          </>
        )}
        {!canDecide && (
          <p className="text-sm text-slate-500">
            This application is {application.status.toLowerCase()} and can no
            longer be reviewed.
          </p>
        )}
      </div>
    </section>
  );
};

export default ApplicationReviewPanel;
