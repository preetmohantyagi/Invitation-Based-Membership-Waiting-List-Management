const AuthMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
      {message}
    </p>
  );
};

export default AuthMessage;