import React from "react";
import { PlayCircle, CalendarDays, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FreeDemoSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#0B1F33]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight font-poppins">
            Free Demo Classes
            <span className="block text-[#D4AF37] mt-1">
              Learn Before You Enroll
            </span>
          </h2>

          <p className="text-[#E5E7EB] text-lg mt-5 max-w-xl leading-relaxed font-inter">
            Experience our teaching methodology through{" "}
            <strong>FREE demo classes</strong>. Get clarity, confidence,
            and expert guidance before enrolling in any competitive
            examination course.
          </p>

          {/* HIGHLIGHTS */}
          <div className="mt-7 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <PlayCircle className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-medium font-inter">
                Live Interactive Classes
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-medium font-inter">
                Flexible Timings
              </span>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-medium font-inter">
                Expert Faculty
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/Contact"
            className="inline-flex items-center gap-2 mt-8 bg-[#D4AF37] text-[#0B1F33]
                       px-8 py-3 rounded-full font-bold text-lg
                       hover:bg-[#E6C35A] transition"
          >
            Book Free Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-[#102A44] border border-white/10 rounded-2xl p-8 shadow-lg text-white">
          <h3 className="text-2xl font-semibold mb-5 font-poppins">
            Upcoming Demo Sessions
          </h3>

          <ul className="space-y-4 font-inter">
            <li className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[#E5E7EB]">
                UPSC / State PCS
              </span>
          
            </li>

            <li className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[#E5E7EB]">
                SSC & Banking
              </span>
            
            </li>

            <li className="flex justify-between items-center">
              <span className="text-[#E5E7EB]">
                Foundation Batch
              </span>
         
            </li>
          </ul>

          <Link
            to="/contact"
            className="block mt-6 w-full text-center bg-[#D4AF37]
                       text-[#0B1F33] py-3 rounded-lg font-bold
                       hover:bg-[#E6C35A] transition"
          >
            View Full Schedule
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FreeDemoSection;
