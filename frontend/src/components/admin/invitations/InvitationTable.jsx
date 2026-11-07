import InvitationTableRow from "./InvitationTableRow";

function InvitationTable({ invitations, onRevoke }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-100 text-slate-600 text-sm">
          <tr>
            <th className="p-4">Code</th>
            <th className="p-4">Created By</th>
            <th className="p-4">Used</th>
            <th className="p-4">Remaining</th>
            <th className="p-4">Expiry</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {invitations.map((invitation) => (
            <InvitationTableRow
              key={invitation._id}
              invitation={invitation}
              onRevoke={onRevoke}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvitationTable;
