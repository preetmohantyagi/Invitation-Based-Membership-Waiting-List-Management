import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthMessage from "../components/auth/AuthMessage";
import AuthLayout from "../components/auth/AuthLayout";

import LoginHeader from "../components/auth/LoginHeader";
import LoginForm from "../components/auth/LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", data);

      setMessage(response.data.message);
      setUser(response.data.user);
      const loggedInUser = response.data.user;

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin");
      } else if (loggedInUser.accountStatus === "ACTIVE") {
        navigate("/dashboard");
      } else {
        navigate("/pending-approval");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoginHeader />

      <AuthMessage message={message} />

      <div className="mt-8">
        <LoginForm
          email={email}
          password={password}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </AuthLayout>
  );
};

export default Login;
