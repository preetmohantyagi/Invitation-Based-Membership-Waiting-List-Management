import ProcessStep from "./ProcessStep";

function HowItWorksSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4">
          The Process
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How DNEG Works
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mt-6">
          Becoming a DNEG member starts with an invitation. Submit your
          application using a valid invitation code and wait for the admin team
          to review your request. Once approved, your membership access will be
          activated.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <ProcessStep
            number="01"
            title="Get Invited"
            description="Receive a valid invitation code to begin your membership application."
          />

          <ProcessStep
            number="02"
            title="Submit Application"
            description="Use your invitation code and submit your application for review."
          />

          <ProcessStep
            number="03"
            title="Get Approved"
            description="The admin reviews your application. Member access is granted only after approval."
          />
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
