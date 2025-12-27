import React, { useState } from "react";
import axios from "axios";
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  User,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "courses", label: "Course Information", icon: ChevronRight },
    { value: "technical", label: "Technical Support", icon: ChevronRight },
    { value: "billing", label: "Billing & Payments", icon: ChevronRight },
    { value: "admission", label: "Admission Process", icon: ChevronRight },
    { value: "feedback", label: "Feedback & Suggestions", icon: ChevronRight },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }
    if (!formData.subject.trim()) {
      setError("Subject is required");
      return false;
    }
    if (formData.message.length < 10) {
      setError("Message must be at least 10 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      // Send contact message
      await axios.post(
        buildApiUrl(API_ENDPOINTS.CONTACT_SEND),
        formData
      );

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#0B1F33] via-[#102A4C] to-[#0B1F33] text-white py-16 md:py-24 overflow-hidden">
        {/* Soft overlay */}
        <div className="absolute inset-0 bg-[#0B1F33]/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Gold accents */}
          <div className="inline-flex items-center justify-center gap-2 mb-5">
            <span className="h-1 w-8 bg-[#D4AF37] rounded-full"></span>
            <span className="h-1 w-12 bg-[#D4AF37] rounded-full"></span>
            <span className="h-1 w-8 bg-[#D4AF37] rounded-full"></span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6 leading-tight text-white">
            Get in <span className="text-[#D4AF37]">Touch</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[#E5E7EB] max-w-3xl mx-auto leading-relaxed font-inter">
            Have questions about courses, admissions, or career guidance?
            Our expert team is here to help you confidently move forward.
          </p>

        </div>
      </section>


      {/* CONTACT CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE - CONTACT INFORMATION */}
          <div className="lg:col-span-1 space-y-8">
            {/* CONTACT INFO CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-[#0B1F33] mb-8 font-poppins flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
                </div>
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4 items-start group cursor-pointer">
                  <div className="p-3 bg-[#0B1F33]/5 rounded-xl group-hover:bg-[#D4AF37]/10 transition-colors">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F33] mb-1">Our Location</p>
                    <p className="text-gray-600">Career Pathway Institute
                      Near Mall Road
                      Shimla – 171001
                      Himachal Pradesh, India
                    </p>
                  </div>
                </div>

                <a href="tel:+911234567890" className="flex gap-4 items-center group">
                  <div className="p-3 bg-[#0B1F33]/5 rounded-xl group-hover:bg-[#D4AF37]/10 transition-colors">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F33] mb-1">Phone Number</p>
                    <p className="text-gray-600 group-hover:text-[#1E3A8A] transition-colors">
                      +91 12345 67890
                    </p>
                  </div>
                </a>

                <a href="mailto:info@careerpathway.in" className="flex gap-4 items-center group">
                  <div className="p-3 bg-[#0B1F33]/5 rounded-xl group-hover:bg-[#D4AF37]/10 transition-colors">
                    <Mail className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F33] mb-1">Email Address</p>
                    <p className="text-gray-600 group-hover:text-[#1E3A8A] transition-colors">
                      info@careerpathway.in
                    </p>
                  </div>
                </a>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-[#0B1F33]/5 rounded-xl">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B1F33] mb-1">Working Hours</p>
                    <p className="text-gray-600">Monday - Saturday</p>
                    <p className="text-gray-600">9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SOCIAL MEDIA CARD */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-[#0B1F33] mb-6 font-poppins">
                Follow Us
              </h3>
              <p className="text-gray-600 mb-6">
                Stay updated with our latest courses and career guidance
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600 hover:text-white" },
                  { icon: Instagram, label: "Instagram", color: "hover:bg-pink-600 hover:text-white" },
                  { icon: Youtube, label: "YouTube", color: "hover:bg-red-600 hover:text-white" },
                  { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700 hover:text-white" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* MAP CARD */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="p-6 pb-0">
                <h3 className="text-xl font-bold text-[#0B1F33] mb-4 font-poppins">
                  Find Us Here
                </h3>
              </div>
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>
                <iframe
                  title="Career Pathway Location"
                  className="w-full h-full"
                  loading="lazy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.678912284038!2d77.209022!3d28.628901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b741d057%3A0xcdee88e47393c3f1!2sNew%20Delhi%2C%20India!5e0!3m2!1sen!2s!4v1625123456789!5m2!1sen!2s"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="mb-10">
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Send className="w-4 h-4" />
                  Send a Message
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F33] mb-4 font-poppins">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 text-lg">
                  Fill in the details below and our counsellor will contact you within 24 hours.
                </p>
              </div>

              {/* ALERTS */}
              {success && (
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We'll contact you within 24 hours.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">Error submitting form</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Inquiry Type
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all appearance-none"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Subject *
                  </label>
                  <input
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
                  />
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Please provide detailed information about your inquiry..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all resize-none"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Minimum 10 characters required</span>
                    <span>{formData.message.length}/500</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-[#0B1F33] to-[#1E3A8A] text-white font-bold rounded-xl hover:from-[#1E3A8A] hover:to-[#0B1F33] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-sm text-gray-500 text-center md:text-left">
                    By submitting, you agree to our Privacy Policy and consent to be contacted.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-r from-[#0B1F33] to-[#1E3A8A] rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 font-poppins">
                Need Immediate Help?
              </h3>
              <p className="text-blue-100/80">Call us now for quick assistance</p>
            </div>
            <div className="text-center">
              <a
                href="tel:+911234567890"
                className="text-2xl md:text-3xl font-bold hover:text-[#D4AF37] transition-colors inline-flex items-center gap-3"
              >
                <Phone className="w-6 h-6" />
                +91 12345 67890
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-100/80 mb-3">Available 9 AM - 7 PM, Mon-Sat</p>
              <a
                href="mailto:support@careerpathway.in"
                className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#E6C35A] font-semibold"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;