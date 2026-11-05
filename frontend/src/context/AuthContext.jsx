import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/me");
        const user = response.data.user;
        setUser(user);
      } catch (error) {
        setUser(null);
        setMessage(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  const logout = async () => {
    try {
      const response = await api.post("/api/auth/logout");
      setMessage(response.data.message);

      setUser(null);
      
      return true;
    } catch (error) {
      setMessage(error.response?.data?.message || "Logout failed");
      return false
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, setLoading, message, setMessage,logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
