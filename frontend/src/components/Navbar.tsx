import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/study-materials", label: "Study Material" },
    { path: "/courses", label: "Courses" },
    { path: "/test-series", label: "Test Series" },
    { path: "/e-books", label: "E-Books" },
    { path: "/current-affairs", label: "Current Affairs" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-base font-semibold transition ${location.pathname === item.path
                    ? "text-blue-700 bg-blue-50 font-bold"
                    : "text-gray-800 hover:text-blue-700 hover:bg-gray-100"
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* DESKTOP AUTH */}
            <div className="hidden lg:flex items-center gap-4" ref={dropdownRef}>
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-base font-semibold text-gray-800 hover:text-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-5 py-2 rounded-md text-base font-bold hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  >
                    <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-base font-semibold text-gray-800">
                      {user.name || user.email}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <Link to="/dashboard" className="block px-4 py-2 text-base font-semibold hover:bg-gray-100">
                        Dashboard
                      </Link>
                      {user.role === "admin" && (
                        <Link to="/admin/dashboard" className="block px-4 py-2 text-base font-semibold hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="block px-4 py-2 text-base font-semibold hover:bg-gray-100">
                        View Profile
                      </Link>
                      <Link to="/profile/edit" className="block px-4 py-2 text-base font-semibold hover:bg-gray-100">
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-base font-bold text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-800 text-2xl font-bold"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          ref={menuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-200 z-50 transform transition-transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="p-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-base font-semibold text-gray-800 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t pt-4">
              {!user ? (
                <>
                  <Link to="/login" className="block text-base font-semibold mb-2">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-blue-600 text-white text-center py-2 rounded-md text-base font-bold"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-base font-bold text-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
