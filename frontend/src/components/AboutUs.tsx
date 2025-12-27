import React from "react";
import FounderSection from "./FounderSection";

const AboutUs = () => {
  return (
    <div className="bg-[#F8FAFC] font-inter">
      {/* HERO SECTION */}
<section className="bg-[#0B1F33] text-white py-16 md:py-20">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

      {/* LEFT CONTENT */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins leading-tight">
          Shaping Future Officers with{" "}
          <span className="text-[#D4AF37]">
            Discipline, Direction & Dedication
          </span>
        </h1>

        <p className="text-lg md:text-xl max-w-xl text-[#E5E7EB] font-inter leading-relaxed">
          Career Pathway is a premier coaching institute for Himachal Pradesh
          and national-level competitive examinations, committed to structured
          preparation and result-oriented guidance.
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative">
        <div className="relative overflow-hidden rounded-xl shadow-lg border border-white/10">
          <img
            src="/about.jpeg"
            alt="Career Pathway Classroom"
            className="w-full h-[280px] md:h-[360px] object-cover"
          />

          {/* Brand overlay */}
          <div className="absolute inset-0 bg-[#0B1F33]/30" />
        </div>

        {/* Gold accent line */}
        <div className="absolute -bottom-3 left-8 w-28 h-[3px] bg-[#D4AF37]" />
      </div>

    </div>
  </div>
</section>


      {/* WHO WE ARE */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white shadow-lg rounded-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-8 text-[#0B1F33] font-poppins font-semibold text-center">
            Who We Are
          </h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-10"></div>
          <p className="text-lg text-[#111827] mb-6 leading-relaxed">
            <strong>Career's Pathway, Shimla</strong> is an established coaching institute with a proven track record in preparing students for competitive examinations. Founded by experienced educators and former civil service professionals, we have built our reputation on academic excellence and result-oriented teaching methodologies.
          </p>
          <p className="text-lg text-[#111827] mb-6 leading-relaxed">
            With years of dedicated service in the field of competitive exam coaching, we have developed a comprehensive ecosystem that supports aspirants from foundational learning to advanced exam strategy. Our institute stands as a reliable partner for serious candidates aiming for government service positions.
          </p>
          <p className="text-lg text-[#111827] leading-relaxed">
            We maintain a serious academic environment where focused preparation, regular assessment, and personalized guidance come together to create successful outcomes. Our commitment to quality education has made us a trusted choice among competitive exam aspirants across Himachal Pradesh.
          </p>
        </div>
      </section>

<FounderSection />
      {/* MISSION & VISION */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* MISSION */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#D4AF37] bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl text-[#D4AF37]">✓</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F33] font-poppins font-semibold">
                  Our Mission
                </h3>
              </div>
              <p className="text-lg text-[#111827] leading-relaxed">
                To provide high-quality, accessible coaching that empowers every aspirant with the knowledge, skills, and confidence needed to succeed in competitive examinations. We are committed to creating a learning environment that emphasizes conceptual clarity, strategic preparation, and ethical values.
              </p>
            </div>

            {/* VISION */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#D4AF37] bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl text-[#D4AF37]">●</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F33] font-poppins font-semibold">
                  Our Vision
                </h3>
              </div>
              <p className="text-lg text-[#111827] leading-relaxed">
                To become the most trusted coaching institute in Northern India for competitive exams, recognized for producing disciplined officers and administrators who contribute positively to governance and nation-building. We envision creating a community of successful candidates who lead with integrity and excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#0B1F33] font-poppins font-semibold">
          What We Do
        </h2>
        <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-12"></div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-[#0B1F33] flex items-center">
              <span className="text-[#D4AF37] mr-2">▸</span> Comprehensive Classroom Coaching
            </h3>
            <p className="text-[#111827] text-gray-700">
              Structured classroom programs covering both prelims and mains syllabus with special focus on HP-specific content. Regular doubt-clearing sessions and personalized attention ensure thorough preparation.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-[#0B1F33] flex items-center">
              <span className="text-[#D4AF37] mr-2">▸</span> Strategic Test Series
            </h3>
            <p className="text-[#111827] text-gray-700">
              Scientifically designed test series that simulate actual exam conditions. Detailed performance analysis, comparative ranking, and improvement roadmaps help students identify and work on their weaknesses.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-[#0B1F33] flex items-center">
              <span className="text-[#D4AF37] mr-2">▸</span> Academic Support System
            </h3>
            <p className="text-[#111827] text-gray-700">
              Daily newspaper analysis, current affairs updates, answer writing workshops, and one-on-one mentoring sessions. Regular HP-specific GK classes ensure comprehensive coverage of state-level examinations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 text-[#0B1F33] flex items-center">
              <span className="text-[#D4AF37] mr-2">▸</span> Quality Study Resources
            </h3>
            <p className="text-[#111827] text-gray-700">
              Updated study material, previous year question banks, practice sets, and digital resources. All materials are regularly revised to align with changing exam patterns and syllabus updates.
            </p>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#0B1F33] font-poppins font-semibold">
            Examinations We Prepare For
          </h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "UPSC Civil Services (IAS/IPS)",
              "HP Administrative Services (HPAS/HAS)",
              "HP Allied & Subordinate Services",
              "Naib Tehsildar & Revenue Services",
              "Banking (PO/Clerk/SO)",
              "SSC (CGL/CHSL/MTS)",
              "HP Police & Constable Exams",
              "UGC NET & SET Examinations",
              "State Government Teaching Jobs",
              "Combined Graduate Level Exams",
              "Forest Services & Allied Exams",
              "Assistant Professor & Lecturer Posts"
            ].map((course, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-[#D4AF37] transition duration-300 hover:shadow-md group"
              >
                <p className="font-medium text-[#111827] flex items-center">
                  <span className="text-[#D4AF37] mr-2 group-hover:scale-110 transition">•</span>
                  {course}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#0B1F33] font-poppins font-semibold">
            Why Choose Career's Pathway
          </h2>
          <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">Expert Faculty Team</h4>
              <p className="text-[#111827] text-gray-600">
                Experienced educators including former civil servants and subject matter experts with proven track records.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">Exam-Oriented Approach</h4>
              <p className="text-[#111827] text-gray-600">
                Focus on question pattern analysis, time management strategies, and answer presentation techniques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">Comprehensive Study Material</h4>
              <p className="text-[#111827] text-gray-600">
                Regularly updated notes, practice sets, and digital resources aligned with latest exam patterns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">Personalized Mentoring</h4>
              <p className="text-[#111827] text-gray-600">
                Individual attention, regular feedback sessions, and customized study plans for each student.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">Result-Driven Methodology</h4>
              <p className="text-[#111827] text-gray-600">
                Systematic approach combining conceptual learning with extensive practice and revision cycles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-3 text-[#0B1F33]">State-Specific Focus</h4>
              <p className="text-[#111827] text-gray-600">
                Special emphasis on Himachal Pradesh GK, current affairs, and state-level examination patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

<section className="bg-[#0B1F33] text-white py-16 md:py-20">
  <div className="container mx-auto px-4 text-center">
    <div className="max-w-4xl mx-auto">

      <h3 className="text-2xl md:text-3xl font-bold mb-6 font-poppins leading-tight">
        Begin Your Journey Towards Government Service
      </h3>

      <p className="text-lg text-[#E5E7EB] mb-8 leading-relaxed">
        At Career&apos;s Pathway, we believe that with the right guidance,
        disciplined preparation, and consistent effort, every serious aspirant
        can achieve their goal of serving the nation through government service.
      </p>

      {/* Gold Divider */}
      <div className="h-[3px] w-32 bg-[#D4AF37] mx-auto mb-8"></div>

      <p className="text-xl italic text-[#E5E7EB] max-w-3xl mx-auto">
        Your success in competitive examinations begins with a single step –
        choosing the right guidance.
      </p>

    </div>
  </div>
</section>

      {/* OUR VALUES */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-[#0B1F33] font-poppins font-semibold">
          Our Core Values
        </h2>
        <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-12"></div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { title: "Discipline", desc: "Systematic approach to preparation" },
            { title: "Excellence", desc: "Commitment to highest standards" },
            { title: "Integrity", desc: "Ethical teaching practices" },
            { title: "Consistency", desc: "Regular progress tracking" },
            { title: "Success", desc: "Focus on tangible results" }
          ].map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-[#D4AF37] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>
              <h4 className="text-xl font-semibold mb-2 text-[#0B1F33]">{value.title}</h4>
              <p className="text-[#6B7280] text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING STATEMENT */}

    </div>
  );
};

export default AboutUs;