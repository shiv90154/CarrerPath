import React from "react";

import Hero from "./Hero";
import Notices from "./Notices";
import WhyChooseUs from "./WhyChooseUs";
import CoreCoursesSection from "./CoreCoursesSection";
import CourseLandingSection from "./CourseLandingSection";
import FreeDemoSection from "./FreeDemoSection";
import Testimonials from "./Testimonials";
import ContactCTA from "./ContactCTA";

const Home: React.FC = () => {
  return (
    <main className="bg-[#F8FAFC] text-[#111827] overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section id="home">
        <Hero />
      </section>

      {/* ================= NOTICES (OPTIONAL) ================= */}
      {/* Uncomment when needed */}

      <section id="notices">
        <Notices />
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section id="why-choose-us" className="py-16 bg-white">
        <WhyChooseUs />
      </section>

      {/* ================= CORE COURSES ================= */}
      <section id="core-courses">
        <CoreCoursesSection />
      </section>

      {/* ================= SPECIALIZED COURSE LANDING PAGES ================= */}
      <section id="course-landing-pages">
        <CourseLandingSection />
      </section>


      {/* ================= FREE DEMO ================= */}


      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-16 bg-[#F8FAFC]">
        <Testimonials />
      </section>

      {/* ================= CONTACT CTA ================= */}
      <section id="free-demo">
        <FreeDemoSection />
      </section>
    </main>
  );
};

export default Home;
