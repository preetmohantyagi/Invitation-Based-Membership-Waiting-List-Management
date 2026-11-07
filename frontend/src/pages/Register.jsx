import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import RegisterHeader from "../components/auth/RegisterHeader";
import RegisterForm from "../components/auth/RegisterForm";
import AuthMessage from "../components/auth/AuthMessage";
import AuthLayout from "../components/auth/AuthLayout";
import InvitationRequired from "../components/auth/InvitationRequired";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // set only after the backend says the invitation code is valid
  const [validCode, setValidCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    company: "",
    industry: "",
    experience: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await api.post("/api/auth/register", {
        ...formData,
        code: validCode,
      });
      setUser(response.data.user);
      navigate("/pending-approval");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!validCode) {
    return (
      <AuthLayout>
        <InvitationRequired
          initialCode={searchParams.get("code") || ""}
          onValidCode={setValidCode}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <RegisterHeader />

      <p className="mt-4 text-center text-xs text-slate-500">
        Invitation: <span className="font-semibold">{validCode}</span>
      </p>

      <AuthMessage message={message} />

      <div className="mt-8">
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </AuthLayout>
  );
};

export default Register;
