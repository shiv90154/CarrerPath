import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-4">

        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#0B1F33] font-poppins">
          Refund Policy
        </h1>

        <p className="text-gray-600 mb-6 font-inter">
          Career Pathway follows a transparent and fair refund policy
          for all its courses and services.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Fee Refund Eligibility
        </h2>
        <p className="text-gray-600 mb-6">
          Course fees once paid are generally non-refundable. Refunds
          may be considered only in exceptional cases as per institute
          discretion.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Digital Content
        </h2>
        <p className="text-gray-600 mb-6">
          No refund shall be provided for digital products such as
          recorded videos, PDFs, e-books, or test series once accessed.
        </p>

        <h2 className="text-xl font-semibold text-[#0B1F33] mb-2">
          Payment Disputes
        </h2>
        <p className="text-gray-600">
          Any payment-related concerns must be reported within 7 days
          of the transaction for review.
        </p>

      </div>
    </section>
  );
};

export default RefundPolicy;
