import { useState } from "react";
import api from "../services/api";

import RegisterHeader from "../components/auth/RegisterHeader";
import RegisterForm from "../components/auth/RegisterForm";
import AuthMessage from "../components/auth/AuthMessage";
import AuthLayout from "../components/auth/AuthLayout";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    invitationCode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      code: formData.invitationCode,
    };

    delete data.invitationCode;

    try {
      const response = await api.post("/api/auth/register", data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout>
      <RegisterHeader />

      <AuthMessage message={message} />

      <div className="mt-8">
        <RegisterForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthLayout>
  );
};

export default Register;
