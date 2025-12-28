import React, { useState } from "react";

const PopupLeadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TEMP: replace with API later
    console.log(formData);

    alert("Thank you! We will contact you shortly.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* NAME */}
      <div>
        <label className="text-sm text-gray-300 mb-1 block">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-[#132C45] border border-white/10 focus:border-[#D4AF37] outline-none text-white"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="text-sm text-gray-300 mb-1 block">
          Mobile Number
        </label>
        <input
          type="tel"
          name="phone"
          required
          placeholder="Enter mobile number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-[#132C45] border border-white/10 focus:border-[#D4AF37] outline-none text-white"
        />
      </div>

      {/* COURSE */}
      <div>
        <label className="text-sm text-gray-300 mb-1 block">
          Interested Course
        </label>
        <select
          name="course"
          required
          value={formData.course}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-[#132C45] border border-white/10 focus:border-[#D4AF37] outline-none text-white"
        >
          <option value="">Select Course</option>
          <option value="Patwari">Patwari</option>
          <option value="SSC">SSC</option>
          <option value="Banking">Banking</option>
          <option value="Police">Police</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* CTA */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-[#0B1F33] font-semibold text-lg hover:opacity-90 transition"
      >
        Get Free Demo Class
      </button>

      {/* TRUST TEXT */}
      <p className="text-xs text-center text-gray-400">
        We respect your privacy. No spam calls.
      </p>
    </form>
  );
};

export default PopupLeadForm;
