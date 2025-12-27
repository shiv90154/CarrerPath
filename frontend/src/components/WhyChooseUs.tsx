import React from 'react';
import { BookOpen, Users, Target, FileText, Monitor } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Experienced & Exam-Oriented Faculty",
      description: "Our faculty members bring years of teaching experience with proven expertise in exam patterns and question trends."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Updated Study Material & Test Series",
      description: "Regularly revised content aligned with current syllabi and comprehensive test series for continuous assessment."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Student-Focused Mentoring",
      description: "Personalized guidance and regular progress tracking to address individual learning needs and goals."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Proven Preparation Strategy",
      description: "Structured methodology refined over years, focusing on conceptual clarity and application-based learning."
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Offline, Online & Hybrid Modes",
      description: "Flexible learning options to accommodate different preferences and schedules without compromising quality."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0B1F33', fontFamily: 'Poppins, sans-serif' }}>
            Why Choose Our Institute
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            We combine experience, methodology, and personalized support to create an effective learning environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg"
            >
              <div 
                className="w-14 h-14 flex items-center justify-center rounded-full mb-5"
                style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              >
                <div style={{ color: '#D4AF37' }}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: '#0B1F33', fontFamily: 'Poppins, sans-serif' }}
              >
                {feature.title}
              </h3>
              
              <p 
                className="text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Our approach is built on measurable outcomes and student success.
            </p>
            <a 
              href="/courses" 
              className="inline-flex items-center px-6 py-3 rounded-md font-medium transition-colors duration-200"
              style={{ 
                backgroundColor: '#0B1F33', 
                color: 'white',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a365d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0B1F33'}
            >
              Explore Our Programs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;