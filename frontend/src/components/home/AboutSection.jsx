function AboutSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        
        <div>
          <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4">
            About DNEG
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            More Than Just a Membership.
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            DNEG is a community designed to bring people together through
            meaningful connections, shared experiences, and opportunities.
          </p>
        </div>

        
        <div className="bg-gray-900 text-white rounded-2xl p-8 md:p-10">
          <p className="text-sm uppercase tracking-widest text-gray-400 mb-6">
            Membership at DNEG
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            A Thoughtful Approach to Membership
          </h3>

          <p className="text-gray-300 leading-relaxed mb-8">
            Every application goes through a review process.
            A valid invitation allows you to apply, while
            membership access is granted only after admin approval.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-sm text-gray-400">Our approach</p>

            <p className="text-lg font-medium mt-2">
              Invitation → Application → Approval
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;