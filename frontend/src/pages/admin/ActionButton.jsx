const colors = {
  blue: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  green: "bg-green-100 text-green-700 hover:bg-green-200",
  red: "bg-red-100 text-red-700 hover:bg-red-200",
};

const ActionButton = ({ label, onClick, color = "blue", disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${colors[color]}`}
    >
      {label}
    </button>
  );
};

export default ActionButton;
