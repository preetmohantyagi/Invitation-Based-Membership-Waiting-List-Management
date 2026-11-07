import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };
  return (
    <>
      <div className="bg-slate-950 text-white px-6 py-5">
        <nav className="flex items-center justify-between">
          <Link className="text-2xl font-bold tracking-wider text-white" to="/">
            DNEG
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
                <span>{user.fullName}</span>
                <button
                  className="mt-1 rounded-lg bg-red-600 px-3 py-1 font-medium text-white transition-colors hover:bg-red-700"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  to="/register"
                >
                  Register
                </Link>
                <Link
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  to="/login"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
