import React from 'react';
import { BookOpen, Clock, Users, Award } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  fee: string;
  seats: number;
  popular: boolean;
  features: string[];
}

const FeaturedCourses: React.FC = () => {
  const courses: Course[] = [
    {
      id: 1,
      title: "HPAS Comprehensive Program",
      description: "Complete preparation for Himachal Pradesh Administrative Services",
      duration: "12 Months",
      fee: "45,999",
      seats: 24,
      popular: true,
      features: ["HP GK Special", "Current Affairs", "Mock Interviews", "Test Series"]
    },
    {
      id: 2,
      title: "UPSC Foundation Course",
      description: "Structured program for Civil Services Preliminary and Mains",
      duration: "18 Months",
      fee: "62,999",
      seats: 30,
      popular: false,
      features: ["NCERT Foundation", "Optional Subject", "Essay Writing", "Personality Test"]
    },
    {
      id: 3,
      title: "Banking & SSC Crash Course",
      description: "Intensive preparation for IBPS, SBI, and SSC examinations",
      duration: "4 Months",
      fee: "24,999",
      seats: 28,
      popular: true,
      features: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"]
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <div key={course.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
          {course.popular && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-semibold">{course.duration}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-500 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Seats Left</div>
                  <div className="font-semibold">{course.seats}/30</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {course.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Award className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-bold text-blue-700">₹{course.fee}</div>
                <div className="text-sm text-gray-500">EMI Available</div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-900 transition-all duration-300">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedCourses;