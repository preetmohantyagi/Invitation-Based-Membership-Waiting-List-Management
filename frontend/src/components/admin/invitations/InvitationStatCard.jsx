function InvitationStatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>

      <h2 className="text-2xl font-bold text-slate-900 mt-2">
        {value}
      </h2>
    </div>
  );
}

export default InvitationStatCard;