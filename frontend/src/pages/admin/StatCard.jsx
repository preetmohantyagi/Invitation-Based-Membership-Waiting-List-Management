const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h3 className="text-sm font-medium text-slate-500">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default StatCard;