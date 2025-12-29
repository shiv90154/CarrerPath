import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GooglePayModal from '../components/GooglePayModal';

interface Video {
  _id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  views: number;
}

interface Subcategory {
  subcategoryName: string;
  subcategoryDescription?: string;
  videos: Video[];
}

interface Category {
  categoryName: string;
  categoryDescription?: string;
  subcategories: Subcategory[];
  videos: Video[]; // For categories without subcategories
}

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  instructor: { name: string };
  videos: Video[]; // Legacy support
  content: Category[]; // New hierarchical structure
  hasPurchased?: boolean;
  accessType?: 'full' | 'limited';
}

const SingleCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Security measures
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user ? `Bearer ${user.token}` : '',
          },
        };
        const { data } = await axios.get<Course>(`/api/courses/${id}`, config);
        setCourse(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const handlePurchase = () => {
    if (!user) {
      alert('Please log in to purchase this course.');
      return;
    }

    if (!course) {
      alert('Course data not loaded.');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh the course data to get updated purchase status
    window.location.reload();
  };

  const handleVideoClick = (videoId: string) => {
    if (!course?.hasPurchased) {
      alert('Please purchase this course to access videos.');
      return;
    }
    navigate(`/courses/${course._id}/videos/${videoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ userSelect: 'none' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <p className="text-sm text-gray-500 mb-4">
                Instructor: {course.instructor.name}
              </p>

              {/* Course Content */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Content</h3>

                {course.content && course.content.length > 0 ? (
                  <div className="space-y-4">
                    {course.content.map((category, catIndex) => (
                      <div key={catIndex} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900">{category.categoryName}</h4>
                          {category.categoryDescription && (
                            <p className="text-sm text-gray-600 mt-1">{category.categoryDescription}</p>
                          )}
                        </div>

                        {/* Category Videos */}
                        {category.videos && category.videos.length > 0 && (
                          <div className="p-4">
                            {category.videos.map((video, videoIndex) => (
                              <div
                                key={video._id}
                                onClick={() => handleVideoClick(video._id)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${course.hasPurchased
                                  ? 'hover:bg-blue-50 text-blue-600'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  }`}
                              >
                                <div className="flex items-center">
                                  <div className="mr-3">
                                    {course.hasPurchased ? '▶️' : '🔒'}
                                  </div>
                                  <div>
                                    <p className="font-medium">{video.title}</p>
                                    <p className="text-sm text-gray-500">{video.duration}</p>
                                  </div>
                                </div>
                                {!course.hasPurchased && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Purchase Required
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Subcategories */}
                        {category.subcategories && category.subcategories.map((subcategory, subIndex) => (
                          <div key={subIndex} className="border-t border-gray-200">
                            <div className="bg-gray-25 px-6 py-2">
                              <h5 className="font-medium text-gray-800">{subcategory.subcategoryName}</h5>
                            </div>
                            <div className="px-6 py-2">
                              {subcategory.videos.map((video, videoIndex) => (
                                <div
                                  key={video._id}
                                  onClick={() => handleVideoClick(video._id)}
                                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${course.hasPurchased
                                    ? 'hover:bg-blue-50 text-blue-600'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                  <div className="flex items-center">
                                    <div className="mr-3">
                                      {course.hasPurchased ? '▶️' : '🔒'}
                                    </div>
                                    <div>
                                      <p className="font-medium">{video.title}</p>
                                      <p className="text-sm text-gray-500">{video.duration}</p>
                                    </div>
                                  </div>
                                  {!course.hasPurchased && (
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                      Purchase Required
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Legacy video structure
                  <div className="space-y-2">
                    {course.videos.map((video, index) => (
                      <div
                        key={video._id}
                        onClick={() => handleVideoClick(video._id)}
                        className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors ${course.hasPurchased
                          ? 'hover:bg-blue-50 text-blue-600'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        <div className="flex items-center">
                          <div className="mr-3">
                            {course.hasPurchased ? '▶️' : '🔒'}
                          </div>
                          <div>
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-gray-500">{video.duration}</p>
                          </div>
                        </div>
                        {!course.hasPurchased && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Purchase Required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {course.price === 0 ? 'FREE' : `₹${course.price}`}
                </div>
                <p className="text-gray-600">
                  {course.price === 0 ? 'Free course' : 'One-time payment'}
                </p>
              </div>

              {course.hasPurchased ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4">
                    ✅ Course Purchased
                  </div>
                  <p className="text-sm text-gray-600">
                    You have full access to all course content.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {course.price === 0 ? 'Get Free Access' : 'Purchase Course'}
                </button>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📚</span>
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📱</span>
                  <span>Mobile & desktop access</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🎓</span>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💳</span>
                  <span>Google Pay payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Pay Modal */}
      {course && (
        <GooglePayModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          product={{
            id: course._id,
            title: course.title,
            price: course.price,
            type: 'course',
            image: course.image
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default SingleCoursePage;