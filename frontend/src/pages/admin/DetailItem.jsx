const DetailItem = ({ label, value }) => {
  return (
    <p className="text-slate-600">
      <span className="font-medium text-slate-900">
        {label}:
      </span>{" "}
      {value || "N/A"}
    </p>
  );
};

export default DetailItem;