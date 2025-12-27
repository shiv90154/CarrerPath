import React, { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";

const AutoCallPopup: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 10000); // ⏱ 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* POPUP BOX */}
      <div className="relative bg-[#0B1F33] text-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-white/10 animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#D4AF37]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* CONTENT */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#D4AF37]/20">
            <Phone className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <h3 className="text-2xl font-bold font-poppins mb-3">
            Need Guidance?
          </h3>

          <p className="text-[#E5E7EB] text-sm mb-6 font-inter">
            Talk to our experts now and get complete guidance for your
            competitive exam preparation.
          </p>

          {/* CALL BUTTON */}
          <a
            href="tel:+911234567890"
            className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#0B1F33] px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#E6C35A] transition"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </a>

          <p className="text-xs text-gray-400 mt-4">
            Free counselling • No obligation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutoCallPopup;
