import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

          <p className="mt-2 text-slate-600">
            Manage membership applications and users.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/invitations")}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
        >
          Manage Invitations
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
