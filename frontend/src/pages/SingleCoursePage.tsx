import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  isFree: boolean;
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
}

const SingleCoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user ? `Bearer ${user.token}` : '',
          },
        };
        const { data } = await axios.get<Course>(`https://carrerpath-m48v.onrender.com/api/courses/${id}`, config);
        setCourse(data);
        setLoading(false);

        // TODO: Implement actual purchase check logic
        // For now, assume not purchased if not logged in or if price is > 0
        if (user && data.price > 0) {
          // In a real app, you would check the user's purchases here
          // For demonstration, let's assume user has purchased if they are logged in and it's a paid course
          setHasPurchased(false);
        } else if (user && data.price === 0) {
          setHasPurchased(true);
        }

      } catch (err) {
        setError('Failed to fetch course');
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!user || !course) {
      alert('Please log in to purchase this course.');
      return;
    }

    if (course.price === 0) {
      alert('This course is free and does not require purchase.');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      const orderConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: { razorpayOrderId, amount, currency, name, email, phone, description } } = await axios.post(
        'https://carrerpath-m48v.onrender.com/api/payments/orders',
        { amount: course.price, courseId: course._id },
        orderConfig
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
        amount: amount,
        currency: currency,
        name: 'Institute Name', // Replace with your institute name
        description: description,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyConfig = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
            };
            await axios.post(
              'https://carrerpath-m48v.onrender.com/api/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              verifyConfig
            );
            alert('Payment successful! You now have full access.');
            setHasPurchased(true);
          } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error initiating payment.');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading course...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!course) return <div className="text-center mt-8">Course not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{course.title}</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <img src={course.image} alt={course.title} className="w-full h-64 object-cover mb-6 rounded-md" />
        <p className="text-lg mb-4">{course.description}</p>
        <p className="text-xl font-semibold mb-4">Price: ₹{course.price}</p>
        <p className="text-md text-gray-600 mb-6">Instructor: {course.instructor.name}</p>

        {!hasPurchased && course.price > 0 && user && (
          <button
            onClick={handlePurchase}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6"
          >
            Buy Now for ₹{course.price}
          </button>
        )}

        <h2 className="text-3xl font-bold mb-6">Course Content</h2>

        {/* New Hierarchical Content Structure */}
        {course.content && course.content.length > 0 ? (
          <div className="space-y-6">
            {course.content.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Category Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      {categoryIndex + 1}
                    </span>
                    {category.categoryName}
                  </h3>
                  {category.categoryDescription && (
                    <p className="text-gray-600 mt-2 ml-11">{category.categoryDescription}</p>
                  )}
                </div>

                {/* Category Content */}
                <div className="p-6">
                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="space-y-4">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <div key={subIndex} className="ml-4">
                          {/* Subcategory Header */}
                          <div className="flex items-center mb-3">
                            <span className="text-blue-600 mr-2">👉</span>
                            <h4 className="text-lg font-semibold text-gray-700">
                              {subcategory.subcategoryName}
                            </h4>
                            <span className="ml-2 text-sm text-gray-500">
                              ({subcategory.videos.length} videos)
                            </span>
                          </div>

                          {/* Subcategory Description */}
                          {subcategory.subcategoryDescription && (
                            <p className="text-gray-600 mb-3 ml-6">{subcategory.subcategoryDescription}</p>
                          )}

                          {/* Videos in Subcategory */}
                          <div className="ml-6 space-y-3">
                            {subcategory.videos.map((video) => (
                              <div key={video._id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-800 mb-1">
                                      {video.title}
                                      {video.isFree && (
                                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                          Free Sample
                                        </span>
                                      )}
                                    </h5>
                                    <p className="text-gray-600 text-sm mb-3">{video.description}</p>

                                    {/* Video Player or Lock Message */}
                                    {(video.isFree || hasPurchased) ? (
                                      video.videoUrl ? (
                                        <video controls className="w-full h-auto rounded-md max-w-md">
                                          <source src={video.videoUrl} type="video/mp4" />
                                          Your browser does not support the video tag.
                                        </video>
                                      ) : (
                                        <p className="text-red-500 text-sm">Video URL not available.</p>
                                      )
                                    ) : (
                                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                        <p className="text-yellow-700 text-sm flex items-center">
                                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                          </svg>
                                          Purchase the course to unlock this video
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Direct videos in category (no subcategories) */
                    category.videos && category.videos.length > 0 && (
                      <div className="space-y-3">
                        {category.videos.map((video) => (
                          <div key={video._id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800 mb-1">
                                  {video.title}
                                  {video.isFree && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      Free Sample
                                    </span>
                                  )}
                                </h5>
                                <p className="text-gray-600 text-sm mb-3">{video.description}</p>

                                {/* Video Player or Lock Message */}
                                {(video.isFree || hasPurchased) ? (
                                  video.videoUrl ? (
                                    <video controls className="w-full h-auto rounded-md max-w-md">
                                      <source src={video.videoUrl} type="video/mp4" />
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    <p className="text-red-500 text-sm">Video URL not available.</p>
                                  )
                                ) : (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                    <p className="text-yellow-700 text-sm flex items-center">
                                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                      </svg>
                                      Purchase the course to unlock this video
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback to Legacy Video Structure */
          <>
            <h2 className="text-3xl font-bold mb-4">Course Videos</h2>
            {course.videos.length === 0 ? (
              <p>No videos available for this course.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {course.videos.map((video) => (
                  <div key={video._id} className="border p-4 rounded-md shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">{video.title} {video.isFree && '(Free Sample)'}</h3>
                    <p className="text-gray-600 mb-4">{video.description}</p>
                    {(video.isFree || hasPurchased) ? (
                      video.videoUrl ? (
                        <video controls className="w-full h-auto rounded-md">
                          <source src={video.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <p className="text-red-500">Video URL not available.</p>
                      )
                    ) : (
                      <p className="text-yellow-500">Purchase the course to unlock this video.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleCoursePage;

