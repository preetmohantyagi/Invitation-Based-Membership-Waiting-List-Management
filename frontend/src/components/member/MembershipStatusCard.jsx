const statusColors = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING_APPROVAL: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-orange-100 text-orange-800",
  DISABLED: "bg-gray-100 text-gray-800",
};

const MembershipStatusCard = ({ user }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Membership</h2>

      <div className="mt-4 space-y-2 text-slate-600">
        <p>
          <span className="font-medium text-slate-900">Status:</span>{" "}
          <span
            className={`ml-1 rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[user.accountStatus] || "bg-gray-100 text-gray-800"
            }`}
          >
            {user.accountStatus}
          </span>
        </p>
        <p>
          <span className="font-medium text-slate-900">Email:</span>{" "}
          {user.email}
        </p>
        <p>
          <span className="font-medium text-slate-900">Member since:</span>{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MembershipStatusCard;
