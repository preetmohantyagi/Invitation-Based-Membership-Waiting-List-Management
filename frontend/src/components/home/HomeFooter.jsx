import { Link } from "react-router-dom";

function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">

          <div>
            <h2 className="text-2xl font-bold tracking-wider">
              DNEG
            </h2>

            <p className="text-gray-400 mt-3 max-w-sm">
              A community built around meaningful connections.
            </p>
          </div>

          <div className="flex gap-6">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>

            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>

            <Link to="/register" className="text-gray-300 hover:text-white">
              Register
            </Link>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} DNEG. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;