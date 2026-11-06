import { Link } from "react-router-dom";

function HomeNavbar() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-5 bg-white shadow-sm">
      <div>
        <Link
          to="/"
          className="text-2xl font-bold tracking-wider text-gray-900"
        >
          DNEG
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link
          to="/login"
          className="text-gray-700 font-medium hover:text-black transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-3 sm:px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;
