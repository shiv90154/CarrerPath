import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#0B1F33] font-poppins">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-6 font-inter">
          By accessing or enrolling with <strong>Career Pathway</strong>,
          you agree to comply with the following terms and conditions.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Course Enrollment
        </h2>
        <p className="text-gray-600 mb-6">
          Admission to any course is subject to eligibility criteria,
          availability of seats, and successful fee payment.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Use of Study Material
        </h2>
        <p className="text-gray-600 mb-6">
          All course content, videos, PDFs, and test materials are the
          intellectual property of Career Pathway and must not be shared,
          copied, or redistributed.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Code of Conduct
        </h2>
        <p className="text-gray-600 mb-6">
          Students are expected to maintain discipline and respectful
          behavior in online and offline classes.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Modifications
        </h2>
        <p className="text-gray-600">
          Career Pathway reserves the right to modify course structure,
          schedules, or faculty assignments when necessary.
        </p>

      </div>
    </section>
  );
};

export default TermsAndConditions;
