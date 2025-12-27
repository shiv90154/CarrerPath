import React from "react";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Users,
  Clock,
} from "lucide-react";

const ContactCTA: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">


      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center text-white">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-poppins leading-tight">
              Begin Your Preparation{" "}
              <span className="text-[#D4AF37] block sm:inline">
                with Confidence
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-[#E5E7EB] max-w-xl mb-10 leading-relaxed font-inter">
              Join thousands of serious aspirants preparing with expert
              guidance, disciplined planning, and result-oriented mentoring.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <button
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
                           bg-[#D4AF37] text-[#0B1F33]
                           hover:bg-[#E6C35A] hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get Free Counselling
              </button>

              <a
                href="tel:+911234567890"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
                           border-2 border-[#D4AF37] text-white
                           hover:bg-[#D4AF37]/10 hover:-translate-y-1 transition-all duration-300"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Call Now
              </a>
            </div>

            {/* INFO STRIP */}
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto text-[#D4AF37] mb-1" />
                <p className="text-sm text-gray-300">24/7 Support</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto text-[#D4AF37] mb-1" />
                <p className="text-sm text-gray-300">Free Guidance</p>
              </div>
              <div className="text-center">
                <ShieldCheck className="w-6 h-6 mx-auto text-[#D4AF37] mb-1" />
                <p className="text-sm text-gray-300">Trusted Mentors</p>
              </div>
            </div>
          </div>

          {/* RIGHT CONTACT FORM */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Request a Call Back
            </h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg bg-[#0B1F33]/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-3 rounded-lg bg-[#0B1F33]/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              />

              <textarea
                rows={3}
                placeholder="Your Message"
                className="w-full px-4 py-3 rounded-lg bg-[#0B1F33]/60 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
              />

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0B1F33] py-3 rounded-lg font-bold hover:bg-[#E6C35A] transition"
              >
                Submit Request
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              We respect your privacy. Your details are safe with us.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
