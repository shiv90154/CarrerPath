import React from 'react';
import { Phone, Mail, MapPin, Clock, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1F33] text-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Institute Intro */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4 text-[#D4AF37] font-['Poppins']">
              Career Pathway
            </h2>
            <p className="text-[#E5E7EB] mb-4 font-['Inter'] leading-relaxed">
              Career Pathway is a dedicated coaching institute focused on
              disciplined preparation, conceptual clarity, and result-oriented
              guidance for competitive examinations.
            </p>
            <p className="text-[#9CA3AF] font-['Inter'] text-sm leading-relaxed">
              We mentor aspirants for UPSC, HPAS, SSC, Banking, Teaching and
              other government examinations through structured courses,
              test series, and expert evaluation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] border-b border-[#1E3A8A] pb-2 font-['Poppins']">
              Quick Links
            </h3>
            <ul className="space-y-3 font-['Inter']">
              {[
                'Home',
                'About Us',
                'Courses',
                'Study Material',
                'Video Courses',
                'Test Series',
                'Current Affairs',
                'Contact'
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-[#E5E7EB] hover:text-[#D4AF37] transition-colors duration-200 flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] border-b border-[#1E3A8A] pb-2 font-['Poppins']">
              Our Courses
            </h3>
            <ul className="space-y-3 font-['Inter']">
              {[
                'UPSC / IAS',
                'HPAS / State Services',
                'SSC (CGL, CHSL, MTS)',
                'Banking (IBPS, SBI)',
                'Teaching Exams (CTET, TET)',
                'Allied & Competitive Exams'
              ].map((course) => (
                <li key={course}>
                  <a
                    href={`/courses/${course.toLowerCase().replace(/[^\w]+/g, '-')}`}
                    className="text-[#E5E7EB] hover:text-[#D4AF37] transition-colors duration-200 flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#D4AF37] border-b border-[#1E3A8A] pb-2 font-['Poppins']">
              Contact Us
            </h3>
            <div className="space-y-4 font-['Inter']">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mt-0.5 mr-3 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[#E5E7EB]">Career Pathway Institute</p>
                  <p className="text-[#E5E7EB]">Sanjauli</p>
                  <p className="text-[#9CA3AF]">Shimla, Himachal Pradesh</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" />
                <div>
                  <a 
                    href="tel:+919805291450" 
                    className="text-[#E5E7EB] hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    +91 98052 91450
                  </a>
                  <p className="text-[#9CA3AF] text-sm">Student Enquiry</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-[#D4AF37] shrink-0" />
                <a 
                  href="mailto:careerpathway@gmail.com" 
                  className="text-[#E5E7EB] hover:text-[#D4AF37] transition-colors duration-200"
                >
                  careerpathway@gmail.com
                </a>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 mt-0.5 mr-3 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="text-[#E5E7EB]">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                  <p className="text-[#9CA3AF] text-sm">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1E3A8A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-[#9CA3AF] font-['Inter']">
                © {currentYear} Career Pathway. All rights reserved.
              </p>
              <p className="text-[#9CA3AF] text-sm font-['Inter'] mt-1">
                Guiding aspirants towards disciplined preparation and success.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="/privacy-policy" 
                className="text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors duration-200 text-sm font-['Inter']"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors duration-200 text-sm font-['Inter']"
              >
                Terms & Conditions
              </a>
              <a 
                href="/refund-policy" 
                className="text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors duration-200 text-sm font-['Inter']"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
