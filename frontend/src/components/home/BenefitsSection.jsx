import BenefitCard from "./BenefitCard";

function BenefitsSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-4">
          Why DNEG
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Built Around Meaningful Connections
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mt-6">
          DNEG follows a structured membership approach where every application
          begins with an invitation, goes through an administrative review, and
          requires approval before membership access is granted.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <BenefitCard
            number="01"
            title="Invitation-Led Access"
            description="A valid invitation code is required to begin the membership application process."
          />

          <BenefitCard
            number="02"
            title="Application Review"
            description="Every submitted application goes through an administrative review before a decision is made."
          />

          <BenefitCard
            number="03"
            title="Approval-Based Membership"
            description="Submitting an application does not grant membership. Access is activated only after admin approval."
          />
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
