import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Phone,
  Home,
  BookOpen,
  Mail,
  Search,
} from "lucide-react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center">

        {/* ICON */}
        <div className="mb-10">
          <div className="relative inline-block">
            <div className="w-36 h-36 rounded-full bg-[#0B1F33]/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-[#0B1F33]
                            rounded-full w-20 h-20 flex items-center justify-center
                            text-3xl font-bold shadow-lg">
              404
            </div>
          </div>
        </div>

        {/* MESSAGE */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#0B1F33] mb-4 font-poppins">
          Page Not Found
        </h1>
        <p className="text-lg text-[#4B5563] mb-10 font-inter">
          The page you are looking for may have been moved, removed,
          or does not exist.
        </p>

        {/* CALL CTA */}
        <div className="mb-12">
          <a
            href="tel:+911234567890"
            className="inline-flex items-center justify-center gap-3
                       bg-[#D4AF37] text-[#0B1F33]
                       font-bold py-4 px-8 rounded-full text-lg
                       hover:bg-[#E6C35A] transition shadow-lg"
          >
            <Phone className="w-5 h-5" />
            Call Now: +91 12345 67890
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Available Mon – Sat | 9:00 AM – 8:00 PM
          </p>
        </div>

        {/* NAVIGATION OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-lg text-[#0B1F33] mb-2">
              Home Page
            </h3>
            <p className="text-gray-600 mb-4">
              Return to the main website
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-medium"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-lg text-[#0B1F33] mb-2">
              Courses
            </h3>
            <p className="text-gray-600 mb-4">
              Explore popular courses
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-medium"
            >
              <BookOpen className="w-4 h-4" />
              View Courses
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="font-semibold text-lg text-[#0B1F33] mb-2">
              Contact Support
            </h3>
            <p className="text-gray-600 mb-4">
              Get help from our team
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-medium"
            >
              <Mail className="w-4 h-4" />
              Contact Us
            </Link>
          </div>

        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
          <h3 className="font-semibold text-lg text-[#0B1F33] mb-4">
            Search the Website
          </h3>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Search courses, test series, ebooks..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <button
              className="bg-[#0B1F33] text-white px-6 py-3 rounded-lg
                         font-medium hover:bg-[#102A44] transition inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <p className="text-gray-600 mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { to: "/courses", label: "Courses" },
              { to: "/test-series", label: "Test Series" },
              { to: "/e-books", label: "E-Books" },
              { to: "/study-material", label: "Study Material" },
              { to: "/current-affairs", label: "Current Affairs" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[#D4AF37] hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
