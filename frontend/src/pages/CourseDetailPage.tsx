import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Video {
    _id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: string;
    order: number;
    isFree: boolean;
    isPreview: boolean;
    views: number;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    fullDescription: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    level: string;
    duration: string;
    language: string;
    tags: string[];
    requirements: string[];
    whatYouWillLearn: string[];
    instructor: {
        _id: string;
        name: string;
        bio: string;
        avatar: string;
    };
    videos: Video[];
    totalVideos: number;
    totalDuration: string;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    discountPercentage: number;
    hasPurchased: boolean;
    accessType: 'full' | 'limited';
    totalLockedVideos?: number;
}

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCourse();
        }
    }, [id, user]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const config = user ? {
                headers: { Authorization: `Bearer ${user.token}` }
            } : {};

            const { data } = await axios.get<Course>(
                `http://localhost:5000/api/courses/${id}`,
                config
            );

            setCourse(data);

            // Set first available video as current
            if (data.videos.length > 0) {
                const firstAvailable = data.videos.find(v => v.isFree || v.isPreview || data.hasPurchased);
                setCurrentVideo(firstAvailable || data.videos[0]);
            }

            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to fetch course');
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = async (video: Video) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (video.isFree || video.isPreview || course?.hasPurchased) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const { data } = await axios.get(
                    `http://localhost:5000/api/courses/${id}/videos/${video._id}`,
                    config
                );

                setCurrentVideo(data);
            } catch (err: any) {
                if (err.response?.status === 403) {
                    alert('Please purchase the course to access this video');
                } else {
                    console.error(err);
                }
            }
        } else {
            alert('Please purchase the course to access this video');
        }
    };

    const handlePurchase = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!course) return;

        try {
            setPaymentLoading(true);

            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            // Create Razorpay order
            const { data: orderData } = await axios.post(
                'http://localhost:5000/api/payments/orders',
                {
                    amount: course.price,
                    courseId: course._id
                },
                config
            );

            // Initialize Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: orderData.name,
                description: orderData.description,
                order_id: orderData.razorpayOrderId,
                handler: async (response: any) => {
                    try {
                        // Verify payment
                        await axios.post(
                            'http://localhost:5000/api/payments/verify',
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            config
                        );

                        alert('Payment successful! You now have access to the full course.');
                        fetchCourse(); // Refresh course data
                    } catch (err) {
                        console.error(err);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: orderData.name,
                    email: orderData.email,
                    contact: orderData.phone,
                },
                theme: {
                    color: '#2563eb',
                },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setPaymentLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading course...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="bg-black rounded-lg overflow-hidden mb-6">
                            {currentVideo ? (
                                <div className="relative aspect-video">
                                    <video
                                        key={currentVideo._id}
                                        controls
                                        className="w-full h-full"
                                        poster={currentVideo.thumbnailUrl}
                                    >
                                        <source src={currentVideo.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>

                                    {!course.hasPurchased && !currentVideo.isFree && !currentVideo.isPreview && (
                                        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <div className="text-6xl mb-4">🔒</div>
                                                <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                                                <p className="mb-4">Purchase the course to access this video</p>
                                                <button
                                                    onClick={handlePurchase}
                                                    disabled={paymentLoading}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {paymentLoading ? 'Processing...' : `Buy Now - ${formatPrice(course.price)}`}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="aspect-video flex items-center justify-center text-white">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4">📹</div>
                                        <p>Select a video to start learning</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Current Video Info */}
                        {currentVideo && (
                            <div className="bg-white rounded-lg p-6 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {currentVideo.title}
                                </h2>
                                <p className="text-gray-600 mb-4">{currentVideo.description}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="mr-4">⏱️ {currentVideo.duration}</span>
                                    <span className="mr-4">👁️ {currentVideo.views} views</span>
                                    {currentVideo.isFree && (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            Free
                                        </span>
                                    )}
                                    {currentVideo.isPreview && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            Preview
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Course Description */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Course</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 mb-4">{course.fullDescription}</p>

                                {course.whatYouWillLearn.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">What you'll learn:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {course.whatYouWillLearn.map((item, index) => (
                                                <li key={index} className="text-gray-600">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {course.requirements.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {course.requirements.map((req, index) => (
                                                <li key={index} className="text-gray-600">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Instructor Info */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Instructor</h4>
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                            {course.instructor.avatar ? (
                                                <img
                                                    src={course.instructor.avatar}
                                                    alt={course.instructor.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">👨‍🏫</span>
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{course.instructor.name}</h5>
                                            {course.instructor.bio && (
                                                <p className="text-gray-600 text-sm mt-1">{course.instructor.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Course Info Card */}
                        <div className="bg-white rounded-lg p-6 mb-6 sticky top-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(course.price)}
                                    </span>
                                    {course.discountPercentage > 0 && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                                            {course.discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                                {course.originalPrice > course.price && (
                                    <span className="text-gray-500 line-through">
                                        {formatPrice(course.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {!course.hasPurchased ? (
                                <button
                                    onClick={handlePurchase}
                                    disabled={paymentLoading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold mb-4"
                                >
                                    {paymentLoading ? 'Processing...' : 'Buy Now'}
                                </button>
                            ) : (
                                <div className="bg-green-50 border border-green-200 text-green-800 py-3 px-4 rounded-lg mb-4 text-center font-semibold">
                                    ✅ Course Purchased
                                </div>
                            )}

                            {/* Course Stats */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📹 Total Videos</span>
                                    <span className="font-semibold">{course.totalVideos}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">⏱️ Duration</span>
                                    <span className="font-semibold">{course.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📚 Level</span>
                                    <span className="font-semibold">{course.level}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">🌐 Language</span>
                                    <span className="font-semibold">{course.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">👥 Students</span>
                                    <span className="font-semibold">{course.enrolledStudents}</span>
                                </div>
                                {course.rating > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">⭐ Rating</span>
                                        <span className="font-semibold">
                                            {course.rating.toFixed(1)} ({course.totalRatings})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {course.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex flex-wrap gap-2">
                                        {course.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video List */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                Course Content ({course.videos.length} videos)
                            </h3>

                            {!course.hasPurchased && course.totalLockedVideos && (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
                                    🔒 {course.totalLockedVideos} videos are locked. Purchase the course to unlock all content.
                                </div>
                            )}

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {course.videos.map((video, index) => {
                                    const isAccessible = video.isFree || video.isPreview || course.hasPurchased;
                                    const isActive = currentVideo?._id === video._id;

                                    return (
                                        <div
                                            key={video._id}
                                            onClick={() => handleVideoClick(video)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${isActive
                                                ? 'bg-blue-50 border border-blue-200'
                                                : 'hover:bg-gray-50 border border-transparent'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-1">
                                                        <span className="text-xs text-gray-500 mr-2">
                                                            {index + 1}.
                                                        </span>
                                                        <h4 className={`text-sm font-medium truncate ${isAccessible ? 'text-gray-900' : 'text-gray-500'
                                                            }`}>
                                                            {video.title}
                                                        </h4>
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500">
                                                        <span className="mr-2">⏱️ {video.duration}</span>
                                                        {video.isFree && (
                                                            <span className="bg-green-100 text-green-800 px-1 py-0.5 rounded mr-1">
                                                                Free
                                                            </span>
                                                        )}
                                                        {video.isPreview && (
                                                            <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded mr-1">
                                                                Preview
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-2 flex-shrink-0">
                                                    {isAccessible ? (
                                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    ) : (
                                                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;