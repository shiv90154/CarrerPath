import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      category: "NEET 2024",
      feedback: "The faculty's approach to concept building helped me secure a rank under 1000. Regular test series and doubt sessions were invaluable.",
      rating: 5,
      batch: "Batch 2023-24"
    },
    {
      id: 2,
      name: "Priya Patel",
      category: "JEE Main",
      feedback: "Study material was comprehensive and regularly updated. The hybrid mode allowed me to balance school and coaching effectively.",
      rating: 5,
      batch: "Batch 2023-24"
    },
    {
      id: 3,
      name: "Amit Kumar",
      category: "UPSC Preparation",
      feedback: "Mentoring sessions provided clear strategy and kept me motivated throughout the preparation. Current affairs updates were particularly helpful.",
      rating: 4,
      batch: "Civil Services 2023"
    },
    {
      id: 4,
      name: "Sneha Reddy",
      category: "CA Foundation",
      feedback: "The faculty's teaching methodology made complex accounting concepts easy to understand. Regular revision tests built my confidence.",
      rating: 5,
      batch: "CA June 2024"
    },
    {
      id: 5,
      name: "Karan Mehta",
      category: "GMAT",
      feedback: "Quantitative reasoning strategies taught here improved my score significantly. Mock tests simulated actual exam conditions perfectly.",
      rating: 4,
      batch: "GMAT 2024"
    },
    {
      id: 6,
      name: "Anjali Singh",
      category: "CLAT",
      feedback: "Legal reasoning and logical thinking modules were exceptionally well-structured. Faculty provided personalized attention when needed.",
      rating: 5,
      batch: "Batch 2023-24"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrev = () => {
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleDotClick = (index: number) => {
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Calculate visible testimonials based on screen size
  const getVisibleTestimonials = () => {
    if (window.innerWidth >= 1024) {
      // Show 3 on desktop
      const startIndex = currentIndex;
      const visible = [];
      for (let i = 0; i < 3; i++) {
        visible.push(testimonials[(startIndex + i) % testimonials.length]);
      }
      return visible;
    } else if (window.innerWidth >= 768) {
      // Show 2 on tablet
      const startIndex = currentIndex;
      const visible = [];
      for (let i = 0; i < 2; i++) {
        visible.push(testimonials[(startIndex + i) % testimonials.length]);
      }
      return visible;
    } else {
      // Show 1 on mobile
      return [testimonials[currentIndex]];
    }
  };

  const [visibleTestimonials, setVisibleTestimonials] = useState(getVisibleTestimonials());

  // Update visible testimonials on resize
  useEffect(() => {
    const handleResize = () => {
      setVisibleTestimonials(getVisibleTestimonials());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  // Update visible testimonials when currentIndex changes
  useEffect(() => {
    setVisibleTestimonials(getVisibleTestimonials());
  }, [currentIndex]);

  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-current text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
            Student Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Hear from our students about their preparation journey
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="relative mb-12">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Quote className="w-6 h-6" style={{ color: '#D4AF37' }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {testimonial.category}
                        </p>
                      </div>
                      <RatingStars rating={testimonial.rating} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {testimonial.batch}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {testimonial.feedback}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">2500+</div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Students Mentored</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">12+</div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>Material Relevance</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;