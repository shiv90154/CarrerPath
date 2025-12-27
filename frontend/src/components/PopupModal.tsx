import React from "react";
import { X } from "lucide-react";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative bg-[#0B1F33] text-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl border border-white/10 animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-start p-6 border-b border-white/10">
          <div>
            <h3 className="text-2xl font-bold font-poppins">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-[#E5E7EB] mt-1 font-inter">
                {subtitle}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#D4AF37] transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>
  );
};

export default PopupModal;
