import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../config/api';
import {
    BookOpen, TestTube, BookOpenCheck, FileText, Trophy,
    CreditCard, User, Menu, X, Home, Search, Bell, Settings,
    ChevronRight, Download, Play, Clock, Star, TrendingUp,
    Award, Target, Calendar, DollarSign, Activity, Eye,
    LogOut, Sparkles, Crown, Gem, Rocket, CheckCircle, Plus
} from 'lucide-react';

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
    const { user, logout } = useAuth();
    const navigate = useNavigate();
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: Home, path: '/dashboard' },
        { id: 'courses', name: 'My Courses', icon: BookOpen, badge: purchasedCourses.length },
        { id: 'tests', name: 'Test Series', icon: TestTube, badge: purchasedTestSeries.length },
        { id: 'ebooks', name: 'E-Books', icon: BookOpenCheck, badge: purchasedEbooks.length },
        { id: 'studymaterials', name: 'Study Materials', icon: FileText, badge: purchasedStudyMaterials.length },
        { id: 'results', name: 'Test Results', icon: Trophy, badge: testResults.length },
        { id: 'payments', name: 'Payment History', icon: CreditCard, badge: paymentHistory.length },
        { id: 'profile', name: 'Profile', icon: User, path: '/profile' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [
                    coursesResponse,
                    testSeriesResponse,
                    ebooksResponse,
                    studyMaterialsResponse,
                    resultsResponse,
                    paymentsResponse,
                    statsResponse
                ] = await Promise.all([
                    apiClient.get<Course[]>(API_ENDPOINTS.STUDENT_COURSES),
                    apiClient.get<TestSeries[]>(API_ENDPOINTS.STUDENT_TESTSERIES),
                    apiClient.get<Ebook[]>(API_ENDPOINTS.STUDENT_EBOOKS),
                    apiClient.get<StudyMaterial[]>(API_ENDPOINTS.STUDENT_STUDYMATERIALS),
                    apiClient.get<Result[]>(API_ENDPOINTS.STUDENT_RESULTS),
                    apiClient.get<Payment[]>(API_ENDPOINTS.STUDENT_PAYMENTS),
                    apiClient.get<Stats>(API_ENDPOINTS.STUDENT_STATS)
                ]);

                setPurchasedCourses(coursesResponse.data);
                setPurchasedTestSeries(testSeriesResponse.data);
                setPurchasedEbooks(ebooksResponse.data);
                setPurchasedStudyMaterials(studyMaterialsResponse.data);
                setTestResults(resultsResponse.data);
                setPaymentHistory(paymentsResponse.data);
                setStats(statsResponse.data);

                setLoading(false);
            } catch (err: any) {
                console.error('Dashboard data fetch error:', err);
                setError(err.response?.data?.message || 'Failed to fetch dashboard data');
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

    const retryFetch = () => {
        setError(null);
        setLoading(true);
        // Re-trigger the useEffect by updating a dependency
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const [
                    coursesResponse,
                    testSeriesResponse,
                    ebooksResponse,
                    studyMaterialsResponse,
                    resultsResponse,
                    paymentsResponse,
                    statsResponse
                ] = await Promise.all([
                    apiClient.get<Course[]>(API_ENDPOINTS.STUDENT_COURSES),
                    apiClient.get<TestSeries[]>(API_ENDPOINTS.STUDENT_TESTSERIES),
                    apiClient.get<Ebook[]>(API_ENDPOINTS.STUDENT_EBOOKS),
                    apiClient.get<StudyMaterial[]>(API_ENDPOINTS.STUDENT_STUDYMATERIALS),
                    apiClient.get<Result[]>(API_ENDPOINTS.STUDENT_RESULTS),
                    apiClient.get<Payment[]>(API_ENDPOINTS.STUDENT_PAYMENTS),
                    apiClient.get<Stats>(API_ENDPOINTS.STUDENT_STATS)
                ]);

                setPurchasedCourses(coursesResponse.data);
                setPurchasedTestSeries(testSeriesResponse.data);
                setPurchasedEbooks(ebooksResponse.data);
                setPurchasedStudyMaterials(studyMaterialsResponse.data);
                setTestResults(resultsResponse.data);
                setPaymentHistory(paymentsResponse.data);
                setStats(statsResponse.data);

                setLoading(false);
            } catch (err: any) {
                console.error('Dashboard data fetch error:', err);
                setError(err.response?.data?.message || 'Failed to fetch dashboard data');
                setLoading(false);
            }
        };
        fetchData();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={retryFetch}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry Loading
                        </button>
                        <Link
                            to="/dashboard-test"
                            className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
                        >
                            Run Diagnostics
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout & Login Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <Gem className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">Student Portal</h1>
                            <p className="text-blue-100 text-xs">Career Pathway</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:bg-white/20 rounded-lg p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </div>
                            {item.badge && item.badge > 0 && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-blue-600" />
                                    Welcome back, {user?.name}!
                                </h1>
                                <p className="text-gray-600">Track your learning progress and achievements</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="relative p-2 text-gray-400 hover:text-gray-600">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm">Courses Purchased</p>
                                            <p className="text-3xl font-bold">{stats.totalCourses}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setActiveTab('courses')}
                                            className="text-blue-100 hover:text-white text-sm flex items-center gap-1"
                                        >
                                            View courses <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-emerald-100 text-sm">Test Series</p>
                                            <p className="text-3xl font-bold">{stats.totalTestSeries}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <TestTube className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setActiveTab('tests')}
                                            className="text-emerald-100 hover:text-white text-sm flex items-center gap-1"
                                        >
                                            Practice now <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">E-Books</p>
                                            <p className="text-3xl font-bold">{stats.totalEbooks}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <BookOpenCheck className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setActiveTab('ebooks')}
                                            className="text-purple-100 hover:text-white text-sm flex items-center gap-1"
                                        >
                                            Read now <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">Total Invested</p>
                                            <p className="text-3xl font-bold">{formatPrice(stats.totalSpent)}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <DollarSign className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setActiveTab('payments')}
                                            className="text-orange-100 hover:text-white text-sm flex items-center gap-1"
                                        >
                                            View history <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Link
                                    to="/courses"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <BookOpen className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Browse Courses</h3>
                                            <p className="text-sm text-gray-600">Explore new courses</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/test-series"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <TestTube className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Take Tests</h3>
                                            <p className="text-sm text-gray-600">Practice with tests</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/e-books"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-purple-100 rounded-lg p-3">
                                            <BookOpenCheck className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Read E-Books</h3>
                                            <p className="text-sm text-gray-600">Digital library</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/study-materials"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-orange-100 rounded-lg p-3">
                                            <FileText className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Study Materials</h3>
                                            <p className="text-sm text-gray-600">Previous year papers</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
                                {stats.recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-blue-100 rounded-lg p-2">
                                                        <Activity className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{activity.title}</p>
                                                        <p className="text-sm text-gray-600">{formatDate(activity.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{formatPrice(activity.amount)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No recent activity</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">My Courses ({purchasedCourses.length})</h2>
                                <Link
                                    to="/courses"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Browse More
                                </Link>
                            </div>

                            {purchasedCourses.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses purchased yet</h3>
                                    <p className="text-gray-600 mb-4">Start your learning journey by purchasing a course</p>
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
                                        <div key={course._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {course.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(course.purchaseDate)}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    By {course.instructor.name}
                                                </p>
                                                <Link
                                                    to={`/courses/${course._id}`}
                                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block flex items-center justify-center gap-2"
                                                >
                                                    <Play className="w-4 h-4" />
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
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">My Test Series ({purchasedTestSeries.length})</h2>
                                <Link
                                    to="/test-series"
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Browse More
                                </Link>
                            </div>

                            {purchasedTestSeries.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <TestTube className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No test series purchased yet</h3>
                                    <p className="text-gray-600 mb-4">Practice with our comprehensive test series</p>
                                    <Link
                                        to="/test-series"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Browse Test Series
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {purchasedTestSeries.map((series) => (
                                        <div key={series._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            <img
                                                src={series.image}
                                                alt={series.title}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                                                        {series.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {formatDate(series.purchaseDate)}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {series.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    By {series.instructor.name}
                                                </p>
                                                <Link
                                                    to={`/test-series/${series._id}`}
                                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block flex items-center justify-center gap-2"
                                                >
                                                    <Target className="w-4 h-4" />
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
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">My E-Books ({purchasedEbooks.length})</h2>
                                <Link
                                    to="/e-books"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Browse More
                                </Link>
                            </div>

                            {purchasedEbooks.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <BookOpenCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No e-books purchased yet</h3>
                                    <p className="text-gray-600 mb-4">Build your digital library with our e-books</p>
                                    <Link
                                        to="/e-books"
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                                    >
                                        Browse E-Books
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {purchasedEbooks.map((ebook) => (
                                        <div key={ebook._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {ebook.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    By {ebook.author.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    Purchased: {formatDate(ebook.purchaseDate)}
                                                </p>
                                                <Link
                                                    to={`/e-books/${ebook._id}`}
                                                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center block flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
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
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">My Study Materials ({purchasedStudyMaterials.length})</h2>
                                <Link
                                    to="/study-materials"
                                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Browse More
                                </Link>
                            </div>

                            {purchasedStudyMaterials.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No study materials purchased yet</h3>
                                    <p className="text-gray-600 mb-4">Access previous year papers and study guides</p>
                                    <Link
                                        to="/study-materials"
                                        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
                                    >
                                        Browse Study Materials
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {purchasedStudyMaterials.map((material) => (
                                        <div key={material._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                            <img
                                                src={material.coverImage || '/images/default-paper-cover.jpg'}
                                                alt={material.title}
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/default-paper-cover.jpg';
                                                }}
                                            />
                                            <div className="p-6">
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
                                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {material.title}
                                                </h3>
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
                                                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-center block flex items-center justify-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
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
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Test Results ({testResults.length})</h2>
                                <Link
                                    to="/test-series"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <TestTube className="w-4 h-4" />
                                    Take More Tests
                                </Link>
                            </div>

                            {testResults.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No test results yet</h3>
                                    <p className="text-gray-600">Take some tests to see your results here</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                </div>
                            )}
                        </div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Payment History ({paymentHistory.length})</h2>
                                <div className="text-sm text-gray-600">
                                    Total Spent: <span className="font-semibold text-gray-900">{formatPrice(stats?.totalSpent || 0)}</span>
                                </div>
                            </div>

                            {paymentHistory.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                    <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
                                    <p className="text-gray-600">Your payment history will appear here</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                                <div className="flex space-x-3">
                                    <Link
                                        to="/profile/edit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Edit Profile
                                    </Link>
                                    <Link
                                        to="/change-password"
                                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
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
                                                    <CheckCircle className="ml-2 w-4 h-4 text-green-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone</label>
                                            <div className="text-gray-900 flex items-center">
                                                {user.phone}
                                                {user.phoneVerified && (
                                                    <CheckCircle className="ml-2 w-4 h-4 text-green-600" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Role</label>
                                            <div className="text-gray-900 capitalize">{user.role}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-gray-900 mb-4">Account Statistics</h3>
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
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                                            <div className="text-gray-900">
                                                {formatDate(user.createdAt || new Date().toISOString())}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default StudentDashboard;