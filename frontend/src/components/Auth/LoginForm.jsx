import RegisterField from "./RegisterField";

const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <RegisterField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={onEmailChange}
      />

      <RegisterField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={onPasswordChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
