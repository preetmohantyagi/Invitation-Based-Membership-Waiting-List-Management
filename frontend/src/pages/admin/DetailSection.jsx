const DetailSection = ({ title, children }) => {
  return (
    <section className="border-t border-slate-200 pt-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>

      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
};

export default DetailSection;
