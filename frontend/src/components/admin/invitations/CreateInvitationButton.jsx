function CreateInvitationButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
    >
      + Generate Invitation
    </button>
  );
}

export default CreateInvitationButton;