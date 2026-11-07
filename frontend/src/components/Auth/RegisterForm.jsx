import RegisterField from "./RegisterField";

const RegisterForm = ({ formData, onChange, onSubmit }) => {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <RegisterField
        label="Full Name"
        name="fullName"
        type="text"
        value={formData.fullName}
        onChange={onChange("fullName")}
      />

      <RegisterField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange("email")}
      />

      <RegisterField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onChange("password")}
      />

      <RegisterField
        label="Invitation Code"
        name="invitationCode"
        type="text"
        value={formData.invitationCode}
        onChange={onChange("invitationCode")}
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
