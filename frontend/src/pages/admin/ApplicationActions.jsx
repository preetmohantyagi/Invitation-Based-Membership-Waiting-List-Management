import { useNavigate } from "react-router-dom";

const ApplicationActions = ({ application, onReview, onApprove, onReject }) => {
  const navigate = useNavigate();

  const canReview = application.status === "PENDING";
  const canDecide = ["PENDING", "UNDER_REVIEW"].includes(application.status);

  const handleViewDetails = () => {
    navigate(`/admin/applications/${application._id}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleViewDetails}
        className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
      >
        View
      </button>

      {canReview && (
        <button
          onClick={() => onReview(application._id)}
          className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
        >
          Review
        </button>
      )}

      {canDecide && (
        <>
          <button
            onClick={() => onApprove(application._id)}
            className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 hover:bg-green-200"
          >
            Approve
          </button>

          <button
            onClick={() => onReject(application._id)}
            className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 hover:bg-red-200"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
};

export default ApplicationActions;
