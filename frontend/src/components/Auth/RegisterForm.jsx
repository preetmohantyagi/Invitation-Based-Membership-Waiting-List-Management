import RegisterField from "./RegisterField";

const fields = [
  { label: "Full Name", name: "fullName", type: "text" },
  { label: "Email", name: "email", type: "email" },
  { label: "Password", name: "password", type: "password" },
  { label: "Phone", name: "phone", type: "tel" },
  { label: "Designation", name: "designation", type: "text" },
  { label: "Company", name: "company", type: "text" },
  { label: "Industry", name: "industry", type: "text" },
  { label: "Experience (e.g. 5 years)", name: "experience", type: "text" },
  { label: "Location", name: "location", type: "text" },
];

const RegisterForm = ({ formData, onChange, onSubmit, submitting }) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {fields.map((field) => (
        <RegisterField
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name]}
          onChange={onChange(field.name)}
        />
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
};

export default RegisterForm;
