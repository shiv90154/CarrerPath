import React from "react";

const FounderSection: React.FC = () => {
  return (
    <section className="bg-[#F9FAFB] py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

        {/* LEFT – IMAGE */}
        <div className="flex justify-center">
          <div className="relative">
            <img
              src="/founder.jpeg" // 👉 place image in public folder
              alt="Founder - Career Pathway"
              className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-2xl shadow-xl border-4 border-[#D4AF37]"
            />
            {/* Gold accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-4 border-[#D4AF37] rounded-2xl -z-10" />
          </div>
        </div>

        {/* RIGHT – CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F33] font-poppins mb-3">
            Meet the Founder
          </h2>

          <h3 className="text-xl font-semibold text-[#D4AF37] mb-4">
            Founder & Director, Career Pathway
          </h3>

          <p className="text-[#4B5563] leading-relaxed mb-5">
            Career Pathway was founded with a clear vision — to provide
            structured, disciplined, and result-oriented guidance to aspirants
            preparing for competitive examinations.
          </p>

          <p className="text-[#4B5563] leading-relaxed mb-5">
            With years of experience in mentoring students for government and
            professional careers, the focus has always been on conceptual
            clarity, ethical preparation, and consistent performance
            improvement.
          </p>

          <p className="text-[#4B5563] leading-relaxed mb-8">
            The institute believes that success is not achieved overnight but
            through the right strategy, mentorship, and hard work — values that
            form the foundation of Career Pathway.
          </p>

          {/* SIGNATURE / CTA */}
          <div className="flex items-center gap-4">
            <div>
              <p className="font-bold text-[#0B1F33]">
                — Founder, Career Pathway
              </p>
              <p className="text-sm text-gray-500">
                Mentor | Educator | Visionary Leader
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FounderSection;
