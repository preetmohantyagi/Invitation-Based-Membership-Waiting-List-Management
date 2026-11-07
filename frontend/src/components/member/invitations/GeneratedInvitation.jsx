const GeneratedInvitation = ({ code }) => {
  if (!code) return null;

  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm text-green-800">Invitation generated:</p>
      <p className="mt-1 select-all text-xl font-bold tracking-wider text-green-900">
        {code}
      </p>
      <p className="mt-1 text-xs text-green-700">
        Share this code. It only allows someone to apply, approval is not
        guaranteed.
      </p>
    </div>
  );
};

export default GeneratedInvitation;
