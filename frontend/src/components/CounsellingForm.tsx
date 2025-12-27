import React from "react";

const CounsellingForm: React.FC = () => {
  return (
    <form className="space-y-4">

      <input
        type="text"
        placeholder="Your Name"
        className="w-full px-4 py-3 rounded-lg bg-[#102A44] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
        required
      />

      <input
        type="tel"
        placeholder="Mobile Number"
        className="w-full px-4 py-3 rounded-lg bg-[#102A44] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
        required
      />

      <select
        className="w-full px-4 py-3 rounded-lg bg-[#102A44] border border-white/10 text-white focus:outline-none focus:border-[#D4AF37]"
      >
        <option value="">Select Exam</option>
        <option>UPSC</option>
        <option>State PCS</option>
        <option>SSC</option>
        <option>Banking</option>
      </select>

      <textarea
        rows={3}
        placeholder="Your Message"
        className="w-full px-4 py-3 rounded-lg bg-[#102A44] border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
      />

      <button
        type="submit"
        className="w-full bg-[#D4AF37] text-[#0B1F33] py-3 rounded-lg font-bold hover:bg-[#E6C35A] transition"
      >
        Submit Request
      </button>

      <p className="text-xs text-gray-400 text-center">
        We respect your privacy. Your details are safe with us.
      </p>

    </form>
  );
};

export default CounsellingForm;
