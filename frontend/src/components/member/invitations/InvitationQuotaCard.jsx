const InvitationQuotaCard = ({ total, used }) => {
  const remaining = Math.max(0, total - used);

  const items = [
    { label: "Total Quota", value: total },
    { label: "Generated", value: used },
    { label: "Remaining", value: remaining },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg bg-slate-100 p-4">
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InvitationQuotaCard;
