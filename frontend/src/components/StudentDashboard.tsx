import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface StudyMaterial {
    _id: string;
    title: string;
    coverImage: string;
    category: string;
    examType: string;
    subject: string;
    year: string;
    type: 'Free' | 'Paid';
    author: {
        name: string;
    };
    purchaseDate: string;
    orderId: string;
}

interface Course {
    _id: string;
    title: string;
    image: string;
    category: string;
    instructor: {
        name: string;
    };
    purchaseDate: string;
    orderId: string;
}

interface TestSeries {
    _id: string;
    title: string;
    image: string;
    category: string;
    instructor: {
        name: string;
    };
    purchaseDate: string;
    orderId: string;
}

interface Ebook {
    _id: string;
    title: string;
    coverImage: string;
    category: string;
    author: {
        name: string;
    };
    purchaseDate: string;
    orderId: string;
}

interface Payment {
    _id: string;
    totalPrice: number;
    createdAt: string;
    paidAt: string;
    paymentMethod: string;
    productType: string;
    productName: string;
    status: string;
}

interface Result {
    _id: string;
    testName: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    dateTaken: string;
    testType: string;
}

interface Stats {
    totalCourses: number;
    totalTestSeries: number;
    totalEbooks: number;
    totalStudyMaterials: number;
    totalTestsTaken: number;
    totalSpent: number;
    recentActivity: Array<{
        type: string;
        title: string;
        date: string;
        amount: number;
    }>;
}

const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
    const [purchasedTestSeries, setPurchasedTestSeries] = useState<TestSeries[]>([]);
    const [purchasedEbooks, setPurchasedEbooks] = useState<Ebook[]>([]);
    const [purchasedStudyMaterials, setPurchasedStudyMaterials] = useState<StudyMaterial[]>([]);
    const [testResults, setTestResults] = useState<Result[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            try {
                // Fetch all data in parallel
                const [
                    coursesResponse,
                    testSeriesResponse,
                    ebooksResponse,
                    studyMaterialsResponse,
                    resultsResponse,
                    paymentsResponse,
                    statsResponse
                ] = await Promise.all([
                    axios.get<Course[]>('https://carrerpath-m48v.onrender.com/api/student/courses', config),
                    axios.get<TestSeries[]>('https://carrerpath-m48v.onrender.com/api/student/testseries', config),
                    axios.get<Ebook[]>('https://carrerpath-m48v.onrender.com/api/student/ebooks', config),
                    axios.get<StudyMaterial[]>('https://carrerpath-m48v.onrender.com/api/student/studymaterials', config),
                    axios.get<Result[]>('https://carrerpath-m48v.onrender.com/api/student/results', config),
                    axios.get<Payment[]>('https://carrerpath-m48v.onrender.com/api/student/payments', config),
                    axios.get<Stats>('https://carrerpath-m48v.onrender.com/api/student/stats', config)
                ]);

                setPurchasedCourses(coursesResponse.data);
                setPurchasedTestSeries(testSeriesResponse.data);
                setPurchasedEbooks(ebooksResponse.data);
                setPurchasedStudyMaterials(studyMaterialsResponse.data);
                setTestResults(resultsResponse.data);
                setPaymentHistory(paymentsResponse.data);
                setStats(statsResponse.data);

                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch dashboard data');
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">Please log in to view your dashboard.</p>
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'courses', name: 'My Courses', icon: '📚' },
        { id: 'tests', name: 'Test Series', icon: '📝' },
        { id: 'ebooks', name: 'E-Books', icon: '📖' },
        { id: 'studymaterials', name: 'Study Materials', icon: '📄' },
        { id: 'results', name: 'Test Results', icon: '�' },
        { id: 'payments', name: 'Payments', icon: '�}' },
        { id: 'profile', name: 'Profile', icon: '👤' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome back, {user.name}! 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Track your learning progress and manage your courses
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Member since</div>
                            <div className="font-semibold text-gray-900">
                                {formatDate(user.createdAt || new Date().toISOString())}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">📚</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.totalCourses}
                                            </div>
                                            <div className="text-sm text-gray-600">Courses Purchased</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">📝</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.totalTestSeries}
                                            </div>
                                            <div className="text-sm text-gray-600">Test Series</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">�</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.totalEbooks}
                                            </div>
                                            <div className="text-sm text-gray-600">E-Books</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">�</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stats.totalStudyMaterials}
                                            </div>
                                            <div className="text-sm text-gray-600">Study Materials</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center">
                                        <div className="text-3xl mr-4">💰</div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {formatPrice(stats.totalSpent)}
                                            </div>
                                            <div className="text-sm text-gray-600">Total Invested</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Recent Activity
                                </h3>
                                {stats.recentActivity.length > 0 ? (
                                    <div className="space-y-3">
                                        {stats.recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center">
                                                    <div className="text-2xl mr-3">🛒</div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {activity.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(activity.date)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">
                                                        {formatPrice(activity.amount)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No recent activity
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                My Courses ({purchasedCourses.length})
                            </h3>
                            {purchasedCourses.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📚</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No courses purchased yet
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Start your learning journey by purchasing a course
                                    </p>
                                    <Link
                                        to="/courses"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Browse Courses
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {purchasedCourses.map((course) => (
                                        <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {course.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Purchased: {formatDate(course.purchaseDate)}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {course.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    By {course.instructor.name}
                                                </p>
                                                <Link
                                                    to={`/courses/${course._id}`}
                                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                                                >
                                                    Continue Learning
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Test Series Tab */}
                    {activeTab === 'tests' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                My Test Series ({purchasedTestSeries.length})
                            </h3>
                            {purchasedTestSeries.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📝</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No test series purchased yet
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Practice with our comprehensive test series
                                    </p>
                                    <Link
                                        to="/test-series"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Browse Test Series
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {purchasedTestSeries.map((series) => (
                                        <div key={series._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                src={series.image}
                                                alt={series.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        {series.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Purchased: {formatDate(series.purchaseDate)}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {series.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    By {series.instructor.name}
                                                </p>
                                                <Link
                                                    to={`/test-series/${series._id}`}
                                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
                                                >
                                                    Start Practice
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* E-Books Tab */}
                    {activeTab === 'ebooks' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                My E-Books ({purchasedEbooks.length})
                            </h3>
                            {purchasedEbooks.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📖</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No e-books purchased yet
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Build your digital library with our e-books
                                    </p>
                                    <Link
                                        to="/e-books"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Browse E-Books
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {purchasedEbooks.map((ebook) => (
                                        <div key={ebook._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                src={ebook.coverImage}
                                                alt={ebook.title}
                                                className="w-full h-64 object-cover"
                                            />
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                                        {ebook.category}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {ebook.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    By {ebook.author.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Purchased: {formatDate(ebook.purchaseDate)}
                                                </p>
                                                <Link
                                                    to={`/e-books/${ebook._id}`}
                                                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center block"
                                                >
                                                    Read Now
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Study Materials Tab */}
                    {activeTab === 'studymaterials' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                My Study Materials ({purchasedStudyMaterials.length})
                            </h3>
                            {purchasedStudyMaterials.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📄</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No study materials purchased yet
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        Access previous year papers and study guides
                                    </p>
                                    <Link
                                        to="/study-materials"
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Browse Study Materials
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {purchasedStudyMaterials.map((material) => (
                                        <div key={material._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                            <img
                                                src={material.coverImage || '/images/default-paper-cover.jpg'}
                                                alt={material.title}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/default-paper-cover.jpg';
                                                }}
                                            />
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                        {material.examType}
                                                    </span>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded ${material.type === 'Free'
                                                        ? 'bg-green-50 text-green-600'
                                                        : 'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {material.type}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {material.title}
                                                </h4>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center justify-between">
                                                        <span>{material.subject}</span>
                                                        <span>{material.year}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    By {material.author.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Purchased: {formatDate(material.purchaseDate)}
                                                </p>
                                                <Link
                                                    to={`/study-materials/${material._id}`}
                                                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-center block"
                                                >
                                                    {material.type === 'Free' ? 'Download' : 'Access Material'}
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Test Results Tab */}
                    {activeTab === 'results' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Test Results ({testResults.length})
                            </h3>
                            {testResults.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📈</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No test results yet
                                    </h4>
                                    <p className="text-gray-600">
                                        Take some tests to see your results here
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Test Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Score
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Percentage
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {testResults.map((result) => (
                                                <tr key={result._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {result.testName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {result.score}/{result.totalQuestions}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${result.percentage >= 80
                                                            ? 'bg-green-100 text-green-800'
                                                            : result.percentage >= 60
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {result.percentage}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {result.testType}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(result.dateTaken)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Payment History ({paymentHistory.length})
                            </h3>
                            {paymentHistory.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">💳</div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                        No payments yet
                                    </h4>
                                    <p className="text-gray-600">
                                        Your payment history will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Method
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paymentHistory.map((payment) => (
                                                <tr key={payment._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {payment.productName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {payment.productType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {formatPrice(payment.totalPrice)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {payment.paymentMethod}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(payment.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                My Profile
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                                            <div className="text-gray-900">{user.name}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <div className="text-gray-900 flex items-center">
                                                {user.email}
                                                {user.emailVerified && (
                                                    <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone</label>
                                            <div className="text-gray-900 flex items-center">
                                                {user.phone}
                                                {user.phoneVerified && (
                                                    <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Role</label>
                                            <div className="text-gray-900 capitalize">{user.role}</div>
                                        </div>
                                        {user.dateOfBirth && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                                <div className="text-gray-900">
                                                    {new Date(user.dateOfBirth).toLocaleDateString('en-IN')}
                                                </div>
                                            </div>
                                        )}
                                        {user.gender && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Gender</label>
                                                <div className="text-gray-900">{user.gender}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-4">Account Statistics</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Courses</label>
                                            <div className="text-gray-900">{stats?.totalCourses || 0}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Spent</label>
                                            <div className="text-gray-900">{formatPrice(stats?.totalSpent || 0)}</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Tests Taken</label>
                                            <div className="text-gray-900">{stats?.totalTestsTaken || 0}</div>
                                        </div>
                                        {user.lastLogin && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Last Login</label>
                                                <div className="text-gray-900">
                                                    {new Date(user.lastLogin).toLocaleDateString('en-IN')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            {user.bio && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium text-gray-900 mb-2">About Me</h4>
                                    <p className="text-gray-600">{user.bio}</p>
                                </div>
                            )}

                            {/* Address Section */}
                            {user.address && (user.address.street || user.address.city) && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                                    <div className="text-gray-600">
                                        {user.address.street && <div>{user.address.street}</div>}
                                        <div>
                                            {[user.address.city, user.address.state, user.address.pincode]
                                                .filter(Boolean).join(', ')}
                                        </div>
                                        {user.address.country && <div>{user.address.country}</div>}
                                    </div>
                                </div>
                            )}

                            {/* Education Section */}
                            {user.education && user.education.qualification && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                                    <div className="text-gray-600">
                                        <div className="font-medium">{user.education.qualification}</div>
                                        {user.education.institution && (
                                            <div>{user.education.institution}</div>
                                        )}
                                        {user.education.year && (
                                            <div>Year: {user.education.year}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Preferences Section */}
                            {user.preferences && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {user.preferences.language && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Language</label>
                                                <div className="text-gray-900">{user.preferences.language}</div>
                                            </div>
                                        )}
                                        {user.preferences.examTypes && user.preferences.examTypes.length > 0 && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Exam Types</label>
                                                <div className="text-gray-900">
                                                    {user.preferences.examTypes.join(', ')}
                                                </div>
                                            </div>
                                        )}
                                        {user.preferences.subjects && user.preferences.subjects.length > 0 && (
                                            <div className="md:col-span-2">
                                                <label className="text-sm font-medium text-gray-500">Subjects</label>
                                                <div className="text-gray-900">
                                                    {user.preferences.subjects.join(', ')}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t flex flex-wrap gap-3">
                                <Link
                                    to="/profile/edit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Edit Profile
                                </Link>
                                <Link
                                    to="/change-password"
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Change Password
                                </Link>
                                {!user.emailVerified && (
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                                        Verify Email
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );/*  */
};

export default StudentDashboard;

