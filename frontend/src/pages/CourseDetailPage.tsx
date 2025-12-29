import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import GooglePayModal from '../components/GooglePayModal';
import {
    Play,
    Clock,
    Users,
    Star,
    BookOpen,
    Globe,
    Award,
    CheckCircle,
    Lock,
    Eye,
    ArrowLeft,
    Download,
    Share2
} from 'lucide-react';

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
    videos: Video[]; // Legacy support
    content: Category[]; // New hierarchical structure
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
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

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
                buildApiUrl(`/api/courses/${id}`),
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
                    buildApiUrl(`/api/courses/${id}/videos/${video._id}`),
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

    const handlePurchase = () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!course) return;

        setPaymentModalOpen(true);
    };

    const handlePaymentSuccess = () => {
        setPaymentModalOpen(false);
        fetchCourse(); // Refresh course data
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
            <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#0B1F33] border-t-transparent mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Loading course details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-6">⚠️</div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
                        <button
                            onClick={() => navigate('/courses')}
                            className="inline-flex items-center gap-2 bg-[#0B1F33] text-white px-6 py-3 rounded-xl hover:bg-[#1E3A8A] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#0B1F33] to-[#1E3A8A] text-white">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={() => navigate('/courses')}
                        className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Courses
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-[#D4AF37] text-[#0B1F33] px-3 py-1 rounded-full text-sm font-semibold">
                                    {course.category}
                                </span>
                                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm">
                                    {course.level}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-[#D4AF37]" />
                                    <span>{course.rating > 0 ? `${course.rating.toFixed(1)} (${course.totalRatings} reviews)` : 'No ratings yet'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{course.enrolledStudents} students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>{course.language}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-xl">
                                <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="text-center mb-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <span className="text-3xl font-bold text-[#0B1F33]">
                                            {course.price === 0 ? 'FREE' : formatPrice(course.price)}
                                        </span>
                                        {course.discountPercentage > 0 && course.price > 0 && (
                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                                                {course.discountPercentage}% OFF
                                            </span>
                                        )}
                                    </div>
                                    {course.originalPrice > course.price && course.price > 0 && (
                                        <span className="text-gray-500 line-through text-lg">
                                            {formatPrice(course.originalPrice)}
                                        </span>
                                    )}
                                </div>

                                {!course.hasPurchased ? (
                                    <button
                                        onClick={handlePurchase}
                                        className="w-full bg-gradient-to-r from-[#0B1F33] to-[#1E3A8A] text-white py-3 px-4 rounded-xl hover:from-[#1E3A8A] hover:to-[#0B1F33] transition-all duration-300 font-semibold mb-4 transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        {course.price === 0 ? 'Enroll for Free' : 'Buy Now'}
                                    </button>
                                ) : (
                                    <div className="bg-green-50 border-2 border-green-200 text-green-800 py-3 px-4 rounded-xl mb-4 text-center font-semibold flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Course Purchased
                                    </div>
                                )}

                                <div className="text-center text-sm text-gray-600">
                                    <p>30-day money-back guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                            <div className="bg-black relative">
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
                                            <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
                                                <div className="text-center text-white p-8">
                                                    <Lock className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]" />
                                                    <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
                                                    <p className="mb-6 text-gray-300">Purchase the course to access this video</p>
                                                    <button
                                                        onClick={handlePurchase}
                                                        className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0B1F33] px-8 py-3 rounded-xl hover:from-[#B8941F] hover:to-[#D4AF37] transition-all duration-300 font-bold"
                                                    >
                                                        {course.price === 0 ? 'Enroll for Free' : `Buy Now - ${formatPrice(course.price)}`}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center text-white">
                                        <div className="text-center">
                                            <Play className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]" />
                                            <p className="text-xl">Select a video to start learning</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Current Video Info */}
                            {currentVideo && (
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        {currentVideo.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 leading-relaxed">{currentVideo.description}</p>
                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{currentVideo.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{currentVideo.views} views</span>
                                        </div>
                                        {currentVideo.isFree && (
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                Free
                                            </span>
                                        )}
                                        {currentVideo.isPreview && (
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                Preview
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: BookOpen },
                                        { id: 'curriculum', label: 'Curriculum', icon: Play },
                                        { id: 'instructor', label: 'Instructor', icon: Award },
                                        { id: 'reviews', label: 'Reviews', icon: Star }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                                ? 'border-[#D4AF37] text-[#0B1F33] bg-[#D4AF37]/5'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Course</h3>
                                            <p className="text-gray-600 leading-relaxed mb-6">{course.fullDescription}</p>
                                        </div>

                                        {course.whatYouWillLearn.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    What you'll learn
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {course.whatYouWillLearn.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-600">{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {course.requirements.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-4">Requirements</h4>
                                                <ul className="space-y-2">
                                                    {course.requirements.map((req, index) => (
                                                        <li key={index} className="flex items-start gap-3">
                                                            <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                                                            <span className="text-gray-600">{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'curriculum' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Course Content
                                            </h3>
                                            {!course.hasPurchased && course.totalLockedVideos && (
                                                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                                                    🔒 {course.totalLockedVideos} videos locked
                                                </span>
                                            )}
                                        </div>

                                        {/* New Hierarchical Content Structure */}
                                        {course.content && course.content.length > 0 ? (
                                            <div className="space-y-6">
                                                {course.content.map((category, categoryIndex) => (
                                                    <div key={categoryIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                                                        {/* Category Header */}
                                                        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 px-6 py-4 border-b border-gray-200">
                                                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                                <span className="bg-[#D4AF37] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
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
                                                                                <span className="text-[#D4AF37] mr-2 text-lg">👉</span>
                                                                                <h4 className="text-lg font-semibold text-gray-700">
                                                                                    {subcategory.subcategoryName}
                                                                                </h4>
                                                                                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                                    {subcategory.videos.length} videos
                                                                                </span>
                                                                            </div>

                                                                            {/* Subcategory Description */}
                                                                            {subcategory.subcategoryDescription && (
                                                                                <p className="text-gray-600 mb-3 ml-6">{subcategory.subcategoryDescription}</p>
                                                                            )}

                                                                            {/* Videos in Subcategory */}
                                                                            <div className="ml-6 space-y-2">
                                                                                {subcategory.videos.map((video, videoIndex) => {
                                                                                    const isAccessible = video.isFree || video.isPreview || course.hasPurchased;
                                                                                    const isActive = currentVideo?._id === video._id;

                                                                                    return (
                                                                                        <div
                                                                                            key={video._id}
                                                                                            onClick={() => handleVideoClick(video)}
                                                                                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${isActive
                                                                                                ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md'
                                                                                                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                                                                                }`}
                                                                                        >
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                                                    <div className="flex-shrink-0">
                                                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAccessible ? 'bg-green-100' : 'bg-gray-100'
                                                                                                            }`}>
                                                                                                            {isAccessible ? (
                                                                                                                <Play className="w-4 h-4 text-green-600" />
                                                                                                            ) : (
                                                                                                                <Lock className="w-4 h-4 text-gray-400" />
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="flex-1 min-w-0">
                                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                                            <span className="text-sm text-gray-500 font-medium">
                                                                                                                {videoIndex + 1}.
                                                                                                            </span>
                                                                                                            <h4 className={`font-medium truncate ${isAccessible ? 'text-gray-900' : 'text-gray-500'
                                                                                                                }`}>
                                                                                                                {video.title}
                                                                                                            </h4>
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                                                            <span className="flex items-center gap-1">
                                                                                                                <Clock className="w-3 h-3" />
                                                                                                                {video.duration}
                                                                                                            </span>
                                                                                                            {video.isFree && (
                                                                                                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                                                    Free
                                                                                                                </span>
                                                                                                            )}
                                                                                                            {video.isPreview && (
                                                                                                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                                                    Preview
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                /* Direct videos in category (no subcategories) */
                                                                category.videos && category.videos.length > 0 && (
                                                                    <div className="space-y-2">
                                                                        {category.videos.map((video, videoIndex) => {
                                                                            const isAccessible = video.isFree || video.isPreview || course.hasPurchased;
                                                                            const isActive = currentVideo?._id === video._id;

                                                                            return (
                                                                                <div
                                                                                    key={video._id}
                                                                                    onClick={() => handleVideoClick(video)}
                                                                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${isActive
                                                                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md'
                                                                                        : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                                            <div className="flex-shrink-0">
                                                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAccessible ? 'bg-green-100' : 'bg-gray-100'
                                                                                                    }`}>
                                                                                                    {isAccessible ? (
                                                                                                        <Play className="w-4 h-4 text-green-600" />
                                                                                                    ) : (
                                                                                                        <Lock className="w-4 h-4 text-gray-400" />
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                                    <span className="text-sm text-gray-500 font-medium">
                                                                                                        {videoIndex + 1}.
                                                                                                    </span>
                                                                                                    <h4 className={`font-medium truncate ${isAccessible ? 'text-gray-900' : 'text-gray-500'
                                                                                                        }`}>
                                                                                                        {video.title}
                                                                                                    </h4>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                                                    <span className="flex items-center gap-1">
                                                                                                        <Clock className="w-3 h-3" />
                                                                                                        {video.duration}
                                                                                                    </span>
                                                                                                    {video.isFree && (
                                                                                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                                            Free
                                                                                                        </span>
                                                                                                    )}
                                                                                                    {video.isPreview && (
                                                                                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                                            Preview
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            /* Fallback to Legacy Video Structure */
                                            <div className="space-y-2">
                                                {course.videos.map((video, index) => {
                                                    const isAccessible = video.isFree || video.isPreview || course.hasPurchased;
                                                    const isActive = currentVideo?._id === video._id;

                                                    return (
                                                        <div
                                                            key={video._id}
                                                            onClick={() => handleVideoClick(video)}
                                                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${isActive
                                                                ? 'bg-[#D4AF37]/10 border-[#D4AF37] shadow-md'
                                                                : 'hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                                    <div className="flex-shrink-0">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAccessible ? 'bg-green-100' : 'bg-gray-100'
                                                                            }`}>
                                                                            {isAccessible ? (
                                                                                <Play className="w-4 h-4 text-green-600" />
                                                                            ) : (
                                                                                <Lock className="w-4 h-4 text-gray-400" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <span className="text-sm text-gray-500 font-medium">
                                                                                {index + 1}.
                                                                            </span>
                                                                            <h4 className={`font-medium truncate ${isAccessible ? 'text-gray-900' : 'text-gray-500'
                                                                                }`}>
                                                                                {video.title}
                                                                            </h4>
                                                                        </div>
                                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="w-3 h-3" />
                                                                                {video.duration}
                                                                            </span>
                                                                            {video.isFree && (
                                                                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                    Free
                                                                                </span>
                                                                            )}
                                                                            {video.isPreview && (
                                                                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                                    Preview
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'instructor' && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Meet Your Instructor</h3>
                                        <div className="flex items-start gap-6">
                                            <div className="w-24 h-24 bg-gradient-to-br from-[#0B1F33] to-[#1E3A8A] rounded-2xl flex items-center justify-center flex-shrink-0">
                                                {course.instructor.avatar ? (
                                                    <img
                                                        src={course.instructor.avatar}
                                                        alt={course.instructor.name}
                                                        className="w-24 h-24 rounded-2xl object-cover"
                                                    />
                                                ) : (
                                                    <Award className="w-12 h-12 text-[#D4AF37]" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {course.instructor.name}
                                                </h4>
                                                {course.instructor.bio && (
                                                    <p className="text-gray-600 leading-relaxed">
                                                        {course.instructor.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h3>
                                        {course.rating > 0 ? (
                                            <div className="text-center py-8">
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <Star className="w-8 h-8 text-[#D4AF37] fill-current" />
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        {course.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">
                                                    Based on {course.totalRatings} reviews
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-600">No reviews yet</p>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Be the first to review this course!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Features</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Play className="w-4 h-4" />
                                        <span>Total Videos</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{course.totalVideos}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>Duration</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{course.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <BookOpen className="w-4 h-4" />
                                        <span>Level</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{course.level}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Globe className="w-4 h-4" />
                                        <span>Language</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{course.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>Students</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{course.enrolledStudents}</span>
                                </div>
                                {course.rating > 0 && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Star className="w-4 h-4" />
                                            <span>Rating</span>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            {course.rating.toFixed(1)} ({course.totalRatings})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {course.tags.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {course.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                                    <Share2 className="w-4 h-4" />
                                    Share this course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Pay Modal */}
            {course && (
                <GooglePayModal
                    isOpen={paymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
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

export default CourseDetailPage;