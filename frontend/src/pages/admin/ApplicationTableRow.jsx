import ApplicationActions from "./ApplicationActions";

const ApplicationTableRow = ({
  application,
  onReview,
  onApprove,
  onReject,
}) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
  };

  return (
    <tr className="border-b border-slate-100">
      <td className="px-6 py-4 font-medium text-slate-900">
        {application.user?.fullName || "N/A"}
      </td>

      <td className="px-6 py-4 text-slate-600">
        {application.user?.email || "N/A"}
      </td>

      <td className="px-6 py-4 text-slate-600">{application.company}</td>

      <td className="px-6 py-4 text-slate-600">{application.priority}</td>

      <td className="px-6 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusColors[application.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {application.status}
        </span>
      </td>

      <td className="px-6 py-4">
        <ApplicationActions
          application={application}
          onReview={onReview}
          onApprove={onApprove}
          onReject={onReject}
        />
      </td>
    </tr>
  );
};

export default ApplicationTableRow;
