import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-4xl text-center mx-auto">
        <p className="text-sm font-semibold tracking-[0.3em] text-gray-500 uppercase mb-6">
          Welcome to DNEG
        </p>

        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
          A Community Built on
          <span className="text-gray-500"> Connections.</span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          DNEG is an invitation-based membership community built around
          meaningful connections, shared interests, and opportunities to connect
          with like-minded individuals. Membership begins with a valid
          invitation and requires an application review and approval.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Invitation Required · Application Reviewed · Approval Based
        </p>

        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          Join the Waitlist
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
