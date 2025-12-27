import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    level: string;
    duration: string;
    language: string;
    tags: string[];
    instructor: {
        _id: string;
        name: string;
    };
    totalVideos: number;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    discountPercentage: number;
    isFeatured: boolean;
}

interface CoursesResponse {
    courses: Course[];
    totalPages: number;
    currentPage: number;
    total: number;
}

const CoursesPage: React.FC = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        category: '',
        level: '',
        search: '',
        sort: 'newest'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense', 'Teaching'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'popular', label: 'Most Popular' }
    ];

    useEffect(() => {
        fetchCourses();
    }, [filters, currentPage]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '12',
                ...filters
            });

            const { data } = await axios.get<CoursesResponse>(
                `http://localhost:5000/api/courses?${params}`
            );

            setCourses(data.courses);
            setTotalPages(data.totalPages);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCourses();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading && courses.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">

                    {/* HEADING */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0B1F33] font-poppins leading-tight">
                        Professional{" "}
                        <span className="text-[#D4AF37]">
                            Courses
                        </span>
                    </h1>

                    {/* SUBTEXT */}
                    <p className="text-lg md:text-xl text-[#4B5563] font-inter max-w-3xl mx-auto leading-relaxed">
                        Build industry-ready skills with <strong>expert-designed video courses </strong>
                        focused on practical learning and real-world application.
                    </p>

                </div>

                {/* Specialized Course Links */}
                <div className="bg-gradient-to-r from-blue-800 to-slate-800 rounded-2xl p-8 mb-8 text-white">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold font-['Poppins'] mb-2">
                            🎯 Specialized Government Exam Coaching
                        </h2>
                        <p className="text-blue-100 font-['Inter']">
                            Explore our dedicated landing pages for comprehensive exam preparation
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'IAS', link: '/courses/ias', popular: true },
                            { name: 'HAS/HPAS', link: '/courses/has-hpas', popular: true },
                            { name: 'Allied Services', link: '/courses/allied-services' },
                            { name: 'SSC Exams', link: '/courses/ssc' },
                            { name: 'Banking', link: '/courses/banking' },
                            { name: 'CDS', link: '/courses/cds' },
                            { name: 'UGC NET/SET', link: '/courses/ugc-net-set' },
                            { name: 'TET/CTET', link: '/courses/tet-ctet' },
                            { name: 'TGT/PGT/JBT', link: '/courses/tgt-pgt-jbt' },
                            { name: 'Naib Tehsildar', link: '/courses/naib-tehsildar' },
                            { name: 'Patwari/Police', link: '/courses/patwari-police' },
                            { name: 'JOA IT/State', link: '/courses/joa-it-state' }
                        ].map((course, index) => (
                            <Link
                                key={index}
                                to={course.link}
                                className="relative bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-3 text-center transition-all duration-300 hover:scale-105 border border-white/20 hover:border-yellow-400"
                            >
                                {course.popular && (
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-bold">
                                        🔥
                                    </div>
                                )}
                                <div className="font-semibold text-sm">{course.name}</div>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-blue-100 text-sm font-['Inter']">
                            💡 Each page contains detailed syllabus, fees, and enrollment information
                        </p>
                    </div>
                </div>


                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </form>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        {/* Level Filter */}
                        <select
                            value={filters.level}
                            onChange={(e) => handleFilterChange('level', e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Levels</option>
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {courses.map((course) => (
                        <div key={course._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                            <div className="relative">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                {course.isFeatured && (
                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                        Featured
                                    </div>
                                )}
                                {course.discountPercentage > 0 && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                        {course.discountPercentage}% OFF
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {course.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{course.level}</span>
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {course.description}
                                </p>

                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <span className="mr-3">👨‍🏫 {course.instructor.name}</span>
                                    <span className="mr-3">📹 {course.totalVideos} videos</span>
                                    <span>⏱️ {course.duration}</span>
                                </div>

                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        {course.rating > 0 && (
                                            <>
                                                <div className="flex items-center text-yellow-400 mr-2">
                                                    {'★'.repeat(Math.floor(course.rating))}
                                                    {'☆'.repeat(5 - Math.floor(course.rating))}
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    ({course.totalRatings})
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {course.enrolledStudents} students
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            {formatPrice(course.price)}
                                        </span>
                                        {course.originalPrice > course.price && (
                                            <span className="text-sm text-gray-500 line-through ml-2">
                                                {formatPrice(course.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    to={`/courses/${course._id}`}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center block font-medium"
                                >
                                    View Course
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 border rounded-lg ${currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;