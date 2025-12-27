import React from "react";
import { GraduationCap, Shield, Landmark, Briefcase } from "lucide-react";

const CoreCoursesSection: React.FC = () => {
  const courses = [
    {
      title: "Civil Services",
      icon: Landmark,
      items: [
        "IAS (UPSC Civil Services)",
        "HAS / HPAS",
        "Allied Services",
        "Naib Tehsildar"
      ]
    },
    {
      title: "Banking & SSC",
      icon: Briefcase,
      items: [
        "Bank PO / Clerk",
        "SSC CGL",
        "SSC GD",
        "SSC CHSL",
        "SSC MTS"
      ]
    },
    {
      title: "Defence & National Exams",
      icon: Shield,
      items: [
        "CDS",
        "UGC NET / SET"
      ]
    },
    {
      title: "Teaching & State Exams",
      icon: GraduationCap,
      items: [
        "TET / CTET",
        "TGT / PGT / JBT",
        "Patwari",
        "Police Constable",
        "JOA IT",
        "Other State Exams"
      ]
    }
  ];

  return (
    <section className="bg-[#0B1F33] py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins">
            Our <span className="text-[#D4AF37]">Core Courses</span>
          </h2>
          <p className="text-gray-300 mt-4 max-w-3xl mx-auto font-inter">
            Comprehensive classroom, online, and hybrid programs designed for
            aspirants preparing for central and state-level competitive examinations.
          </p>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto mt-6" />
        </div>

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-md border border-white/10
                           rounded-xl p-6 hover:border-[#D4AF37]
                           transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20
                                  flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-poppins">
                    {course.title}
                  </h3>
                </div>

                <ul className="space-y-2 text-sm text-gray-300 font-inter">
                  {course.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FOOT NOTE */}
        <div className="text-center mt-14">
          <p className="text-gray-300 font-inter">
            ✔ Expert Faculty &nbsp;•&nbsp; ✔ Updated Syllabus &nbsp;•&nbsp;
            ✔ Offline | Online | Hybrid Modes
          </p>
        </div>

      </div>
    </section>
  );
};

export default CoreCoursesSection;
