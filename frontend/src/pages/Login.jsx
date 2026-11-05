import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();
    const data = {
      email: String(email),
      password: String(password),
    };
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", data);
      setMessage(response.data.message);
      setUser(response.data.user);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Login to your DNEG Account</p>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          value={email}
          id="email"
          name="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          value={password}
          id="password"
          name="password"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
