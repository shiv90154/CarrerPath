import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  instructor: { name: string };
}

const VideoCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get<Course[]>('http://localhost:5000/api/courses');
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-12 font-inter text-[#6B7280]">Loading courses...</div>;
  if (error) return <div className="text-center mt-12 font-inter text-[#B91C1C]">Error: {error}</div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="container mx-auto p-6">
        {/* Header Section */}
    <div className="text-center mb-14">

  {/* HEADING */}
  <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B1F33] font-poppins leading-tight">
    Video{" "}
    <span className="text-[#D4AF37]">
      Course Library
    </span>
  </h1>

  {/* SUBTEXT */}
  <p className="text-lg md:text-xl text-[#4B5563] font-inter max-w-3xl mx-auto mb-10 leading-relaxed">
    Expert-led <strong>video lectures</strong> designed for conceptual clarity,
    smart revision, and result-oriented preparation for competitive examinations.
  </p>

  {/* GOLD DIVIDER */}
  <div className="h-0.75 w-28 bg-[#D4AF37] mx-auto mb-10"></div>

  {/* FREE vs PAID INDICATORS */}
  <div className="flex flex-wrap justify-center items-center gap-4">

    <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
      <span className="text-sm font-semibold text-[#111827] font-inter">
        Free Sample Videos
      </span>
    </div>

    <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
      <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]"></span>
      <span className="text-sm font-semibold text-[#111827] font-inter">
        Paid Full Courses
      </span>
    </div>

  </div>

</div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white rounded-lg overflow-hidden border border-[#E5E7EB] hover:border-[#1E3A8A] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Course Image */}
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover" 
                />
                
                {/* Price Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium font-inter ${
                  course.price === 0 
                    ? 'bg-[#D4AF37] text-[#0B1F33]' 
                    : 'bg-[#B91C1C] text-white'
                }`}>
                  {course.price === 0 ? 'Free Sample' : `₹${course.price}`}
                </div>
              </div>
              
              {/* Course Content */}
              <div className="p-6">
                {/* Category Tag */}
                <span className="inline-block px-3 py-1 bg-[#F8FAFC] text-[#6B7280] text-xs rounded-full font-inter mb-3">
                  {course.category}
                </span>
                
                {/* Course Title */}
                <h2 className="text-xl font-semibold mb-3 text-[#0B1F33] font-poppins leading-tight">
                  {course.title}
                </h2>
                
                {/* Course Description */}
                <p className="text-[#6B7280] mb-4 line-clamp-3 font-inter">
                  {course.description}
                </p>
                
                {/* Meta Information */}
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-[#E5E7EB]">
                  <div>
                    <p className="text-sm text-[#6B7280] font-inter">Instructor</p>
                    <p className="font-medium text-[#111827] font-inter">{course.instructor.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#6B7280] font-inter">Access</p>
                    <p className="font-medium text-[#111827] font-inter">
                      {course.price === 0 ? 'Immediate' : 'Enroll Required'}
                    </p>
                  </div>
                </div>
                
                {/* Action Button */}
                <Link
                  to={`/video-courses/${course._id}`}
                  className={`block text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 font-inter ${
                    course.price === 0
                      ? 'bg-[#F8FAFC] text-[#0B1F33] border border-[#E5E7EB] hover:bg-[#F1F5F9]'
                      : 'bg-[#1E3A8A] text-white hover:bg-[#0B1F33]'
                  }`}
                >
                  {course.price === 0 ? 'Watch Sample' : 'Enroll Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 pt-8 border-t border-[#E5E7EB] text-center">
          <h3 className="text-2xl font-bold mb-4 text-[#0B1F33] font-poppins">
            Need Guidance on Choosing a Course?
          </h3>
          <p className="text-[#6B7280] mb-6 font-inter max-w-2xl mx-auto">
            Our academic counselors can help you select the right video course based on your exam goals and current preparation level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/free-counselling"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] transition-colors duration-200 font-inter font-medium"
            >
              Book Free Counselling
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#1E3A8A] border border-[#E5E7EB] rounded-lg hover:border-[#1E3A8A] transition-colors duration-200 font-inter font-medium"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCoursesPage;