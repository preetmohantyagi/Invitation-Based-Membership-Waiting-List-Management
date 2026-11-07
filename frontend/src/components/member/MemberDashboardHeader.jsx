const MemberDashboardHeader = ({ name }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Welcome to DNEG</h1>
      <p className="mt-2 text-lg text-slate-600">Hello, {name}!</p>
    </div>
  );
};

export default MemberDashboardHeader;
