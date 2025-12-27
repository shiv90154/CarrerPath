import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#0B1F33] font-poppins">
          Privacy Policy
        </h1>

        <p className="text-gray-600 mb-6 font-inter">
          At <strong>Career Pathway</strong>, we respect your privacy and are
          committed to protecting the personal information you share with us.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Information We Collect
        </h2>
        <p className="text-gray-600 mb-6">
          We may collect personal details such as name, phone number, email
          address, and academic preferences when you register, contact us,
          or enroll in our courses.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Use of Information
        </h2>
        <p className="text-gray-600 mb-6">
          Your information is used solely to provide educational services,
          communicate important updates, and improve our offerings.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Data Security
        </h2>
        <p className="text-gray-600 mb-6">
          We implement appropriate security measures to protect your personal
          data against unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Policy Updates
        </h2>
        <p className="text-gray-600">
          Career Pathway reserves the right to update this Privacy Policy at
          any time. Continued use of our services indicates acceptance of
          these changes.
        </p>

      </div>
    </section>
  );
};

export default PrivacyPolicy;
