import ApplicationTableRow from "./ApplicationTableRow";

const ApplicationsTable = ({ applications, onApprove, onReject }) => {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 font-semibold">Member Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationTableRow
                key={application._id}
                application={application}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                No applications found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
