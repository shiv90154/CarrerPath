import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

interface Test {
    _id: string;
    title: string;
    description: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    difficulty: string;
    isFree: boolean;
    isPreview: boolean;
    order: number;
}

interface LiveTest {
    _id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    status: string;
    currentStatus: string;
    maxParticipants: number;
    currentParticipants: number;
}

interface Subcategory {
    subcategoryName: string;
    subcategoryDescription?: string;
    tests: Test[];
    liveTests: LiveTest[];
}

interface Category {
    categoryName: string;
    categoryDescription?: string;
    subcategories: Subcategory[];
    tests: Test[]; // Direct tests without subcategories
    liveTests: LiveTest[]; // Direct live tests without subcategories
}

interface TestSeries {
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
    content: Category[]; // New hierarchical structure
    tests: Test[]; // Legacy support
    liveTests: LiveTest[]; // Legacy support
    totalTests: number;
    totalLiveTests: number;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    discountPercentage: number;
    hasPurchased: boolean;
    accessType: 'full' | 'limited';
    totalLockedTests?: number;
    validityPeriod: number;
    hasLiveTests: boolean;
    liveTestSchedule: string;
    resultAnalysis: boolean;
    rankingSystem: boolean;
    solutionAvailable: boolean;
}

const TestSeriesDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [testSeries, setTestSeries] = useState<TestSeries | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTestSeries();
        }
    }, [id, user]);

    const fetchTestSeries = async () => {
        try {
            setLoading(true);
            const config = user ? {
                headers: { Authorization: `Bearer ${user.token}` }
            } : {};

            const { data } = await axios.get<TestSeries>(
                `https://carrerpath-m48v.onrender.com/api/testseries/${id}`,
                config
            );

            setTestSeries(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to fetch test series');
        } finally {
            setLoading(false);
        }
    };

    const handleTestClick = (test: Test) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (test.isFree || testSeries?.hasPurchased) {
            navigate(`/test-series/${id}/test/${test._id}`);
        } else {
            alert('Please purchase the test series to access this test');
        }
    };

    const handlePurchase = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
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
                        <p className="mt-4 text-gray-600">Loading test series...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !testSeries) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Series Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/test-series')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to Test Series
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
                        {/* Header */}
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <div className="flex items-start space-x-6">
                                <img
                                    src={testSeries.image}
                                    alt={testSeries.title}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium mr-2">
                                            {testSeries.category}
                                        </span>
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                            {testSeries.level}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {testSeries.title}
                                    </h1>
                                    <p className="text-gray-600 mb-4">{testSeries.description}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-4">📝 {testSeries.totalTests} Tests</span>
                                        <span className="mr-4">⏱️ {testSeries.duration}</span>
                                        <span className="mr-4">🌐 {testSeries.language}</span>
                                        <span>👥 {testSeries.enrolledStudents} Students</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Test Series</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 mb-6">{testSeries.fullDescription}</p>

                                {/* Instructor Info */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Instructor</h4>
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                            {testSeries.instructor.avatar ? (
                                                <img
                                                    src={testSeries.instructor.avatar}
                                                    alt={testSeries.instructor.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">👨‍🏫</span>
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{testSeries.instructor.name}</h5>
                                            {testSeries.instructor.bio && (
                                                <p className="text-gray-600 text-sm mt-1">{testSeries.instructor.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Content - Hierarchical Structure */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Test Series Content
                            </h3>

                            {!testSeries.hasPurchased && testSeries.totalLockedTests && (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
                                    🔒 {testSeries.totalLockedTests} tests are locked. Purchase the test series to unlock all tests.
                                </div>
                            )}

                            {/* New Hierarchical Content Structure */}
                            {testSeries.content && testSeries.content.length > 0 ? (
                                <div className="space-y-6">
                                    {testSeries.content.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Category Header */}
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                                <h3 className="text-lg font-bold text-gray-800 flex items-center">
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
                                                                    <span className="text-blue-600 mr-2 text-lg">👉</span>
                                                                    <h4 className="text-lg font-semibold text-gray-700">
                                                                        {subcategory.subcategoryName}
                                                                    </h4>
                                                                    <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                        {subcategory.tests.length + subcategory.liveTests.length} tests
                                                                    </span>
                                                                </div>

                                                                {/* Subcategory Description */}
                                                                {subcategory.subcategoryDescription && (
                                                                    <p className="text-gray-600 mb-3 ml-6">{subcategory.subcategoryDescription}</p>
                                                                )}

                                                                {/* Tests in Subcategory */}
                                                                <div className="ml-6 space-y-3">
                                                                    {/* Regular Tests */}
                                                                    {subcategory.tests.map((test, testIndex) => {
                                                                        const isAccessible = test.isFree || test.isPreview || testSeries.hasPurchased;

                                                                        return (
                                                                            <div
                                                                                key={test._id}
                                                                                className={`border rounded-lg p-4 transition-colors ${isAccessible
                                                                                    ? 'hover:bg-gray-50 cursor-pointer border-gray-200'
                                                                                    : 'bg-gray-50 border-gray-300'
                                                                                    }`}
                                                                                onClick={() => isAccessible && handleTestClick(test)}
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center mb-2">
                                                                                            <span className="text-sm text-gray-500 mr-3">
                                                                                                Test {testIndex + 1}
                                                                                            </span>
                                                                                            {test.isFree && (
                                                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                                    Free
                                                                                                </span>
                                                                                            )}
                                                                                            {test.isPreview && (
                                                                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                                    Preview
                                                                                                </span>
                                                                                            )}
                                                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                                                                test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                                                    'bg-red-100 text-red-800'
                                                                                                }`}>
                                                                                                {test.difficulty}
                                                                                            </span>
                                                                                        </div>
                                                                                        <h5 className={`font-medium mb-1 ${isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                                            {test.title}
                                                                                        </h5>
                                                                                        <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                                                                                        <div className="flex items-center text-xs text-gray-500">
                                                                                            <span className="mr-4">⏱️ {test.duration} min</span>
                                                                                            <span className="mr-4">❓ {test.totalQuestions} questions</span>
                                                                                            <span>📊 {test.totalMarks} marks</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="ml-4 flex-shrink-0">
                                                                                        {isAccessible ? (
                                                                                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                                                                                                Start Test
                                                                                            </button>
                                                                                        ) : (
                                                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                                                </svg>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}

                                                                    {/* Live Tests */}
                                                                    {subcategory.liveTests.map((liveTest, liveTestIndex) => (
                                                                        <div
                                                                            key={liveTest._id}
                                                                            className="border border-red-200 rounded-lg p-4 bg-red-50"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center mb-2">
                                                                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                            🔴 LIVE TEST
                                                                                        </span>
                                                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${liveTest.currentStatus === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                                                            liveTest.currentStatus === 'live' ? 'bg-green-100 text-green-800' :
                                                                                                'bg-gray-100 text-gray-800'
                                                                                            }`}>
                                                                                            {liveTest.currentStatus.toUpperCase()}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h5 className="font-medium mb-1 text-gray-900">
                                                                                        {liveTest.title}
                                                                                    </h5>
                                                                                    <p className="text-gray-600 text-sm mb-2">{liveTest.description}</p>
                                                                                    <div className="flex items-center text-xs text-gray-500">
                                                                                        <span className="mr-4">📅 {new Date(liveTest.startTime).toLocaleDateString()}</span>
                                                                                        <span className="mr-4">⏰ {new Date(liveTest.startTime).toLocaleTimeString()}</span>
                                                                                        <span className="mr-4">⏱️ {liveTest.duration} min</span>
                                                                                        <span>👥 {liveTest.currentParticipants}/{liveTest.maxParticipants}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="ml-4 flex-shrink-0">
                                                                                    {liveTest.currentStatus === 'live' ? (
                                                                                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                                                                                            Join Live
                                                                                        </button>
                                                                                    ) : liveTest.currentStatus === 'upcoming' ? (
                                                                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                                                                            Register
                                                                                        </button>
                                                                                    ) : (
                                                                                        <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm">
                                                                                            Completed
                                                                                        </button>
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
                                                    /* Direct tests in category (no subcategories) */
                                                    <div className="space-y-3">
                                                        {/* Regular Tests */}
                                                        {category.tests.map((test, testIndex) => {
                                                            const isAccessible = test.isFree || test.isPreview || testSeries.hasPurchased;

                                                            return (
                                                                <div
                                                                    key={test._id}
                                                                    className={`border rounded-lg p-4 transition-colors ${isAccessible
                                                                        ? 'hover:bg-gray-50 cursor-pointer border-gray-200'
                                                                        : 'bg-gray-50 border-gray-300'
                                                                        }`}
                                                                    onClick={() => isAccessible && handleTestClick(test)}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center mb-2">
                                                                                <span className="text-sm text-gray-500 mr-3">
                                                                                    Test {testIndex + 1}
                                                                                </span>
                                                                                {test.isFree && (
                                                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                        Free
                                                                                    </span>
                                                                                )}
                                                                                {test.isPreview && (
                                                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                        Preview
                                                                                    </span>
                                                                                )}
                                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                                                    test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                                        'bg-red-100 text-red-800'
                                                                                    }`}>
                                                                                    {test.difficulty}
                                                                                </span>
                                                                            </div>
                                                                            <h5 className={`font-medium mb-1 ${isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                                {test.title}
                                                                            </h5>
                                                                            <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                                                                            <div className="flex items-center text-xs text-gray-500">
                                                                                <span className="mr-4">⏱️ {test.duration} min</span>
                                                                                <span className="mr-4">❓ {test.totalQuestions} questions</span>
                                                                                <span>📊 {test.totalMarks} marks</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-4 flex-shrink-0">
                                                                            {isAccessible ? (
                                                                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                                                                                    Start Test
                                                                                </button>
                                                                            ) : (
                                                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2H5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                                    </svg>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}

                                                        {/* Live Tests */}
                                                        {category.liveTests.map((liveTest) => (
                                                            <div
                                                                key={liveTest._id}
                                                                className="border border-red-200 rounded-lg p-4 bg-red-50"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center mb-2">
                                                                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                🔴 LIVE TEST
                                                                            </span>
                                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${liveTest.currentStatus === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                                                                liveTest.currentStatus === 'live' ? 'bg-green-100 text-green-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                                }`}>
                                                                                {liveTest.currentStatus.toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                        <h5 className="font-medium mb-1 text-gray-900">
                                                                            {liveTest.title}
                                                                        </h5>
                                                                        <p className="text-gray-600 text-sm mb-2">{liveTest.description}</p>
                                                                        <div className="flex items-center text-xs text-gray-500">
                                                                            <span className="mr-4">📅 {new Date(liveTest.startTime).toLocaleDateString()}</span>
                                                                            <span className="mr-4">⏰ {new Date(liveTest.startTime).toLocaleTimeString()}</span>
                                                                            <span className="mr-4">⏱️ {liveTest.duration} min</span>
                                                                            <span>👥 {liveTest.currentParticipants}/{liveTest.maxParticipants}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4 flex-shrink-0">
                                                                        {liveTest.currentStatus === 'live' ? (
                                                                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                                                                                Join Live
                                                                            </button>
                                                                        ) : liveTest.currentStatus === 'upcoming' ? (
                                                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                                                                                Register
                                                                            </button>
                                                                        ) : (
                                                                            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-sm">
                                                                                Completed
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Fallback to Legacy Test Structure */
                                <div className="space-y-4">
                                    {testSeries.tests.map((test, index) => {
                                        const isAccessible = test.isFree || testSeries.hasPurchased;

                                        return (
                                            <div
                                                key={test._id}
                                                className={`border rounded-lg p-4 transition-colors ${isAccessible
                                                    ? 'hover:bg-gray-50 cursor-pointer border-gray-200'
                                                    : 'bg-gray-50 border-gray-300'
                                                    }`}
                                                onClick={() => isAccessible && handleTestClick(test)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <span className="text-sm text-gray-500 mr-3">
                                                                Test {index + 1}
                                                            </span>
                                                            {test.isFree && (
                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                    Free
                                                                </span>
                                                            )}
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                                test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                {test.difficulty}
                                                            </span>
                                                        </div>
                                                        <h4 className={`font-semibold mb-1 ${isAccessible ? 'text-gray-900' : 'text-gray-500'}`}>
                                                            {test.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm mb-2">{test.description}</p>
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <span className="mr-4">⏱️ {test.duration} min</span>
                                                            <span className="mr-4">❓ {test.totalQuestions} questions</span>
                                                            <span>📊 {test.totalMarks} marks</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-shrink-0">
                                                        {isAccessible ? (
                                                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                                                                Start Test
                                                            </button>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
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
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(testSeries.price)}
                                    </span>
                                    {testSeries.discountPercentage > 0 && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                                            {testSeries.discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                                {testSeries.originalPrice > testSeries.price && (
                                    <span className="text-gray-500 line-through">
                                        {formatPrice(testSeries.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {!testSeries.hasPurchased ? (
                                <button
                                    onClick={handlePurchase}
                                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold mb-4"
                                >
                                    Buy Test Series
                                </button>
                            ) : (
                                <div className="bg-green-50 border border-green-200 text-green-800 py-3 px-4 rounded-lg mb-4 text-center font-semibold">
                                    ✅ Test Series Purchased
                                </div>
                            )}

                            {/* Stats */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📝 Total Tests</span>
                                    <span className="font-semibold">{testSeries.totalTests}</span>
                                </div>
                                {testSeries.hasLiveTests && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">🔴 Live Tests</span>
                                        <span className="font-semibold">{testSeries.totalLiveTests}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">⏱️ Duration</span>
                                    <span className="font-semibold">{testSeries.duration}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📚 Level</span>
                                    <span className="font-semibold">{testSeries.level}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">🌐 Language</span>
                                    <span className="font-semibold">{testSeries.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">👥 Students</span>
                                    <span className="font-semibold">{testSeries.enrolledStudents}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">⏳ Validity</span>
                                    <span className="font-semibold">{testSeries.validityPeriod} days</span>
                                </div>
                                {testSeries.rating > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">⭐ Rating</span>
                                        <span className="font-semibold">
                                            {testSeries.rating.toFixed(1)} ({testSeries.totalRatings})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Live Test Schedule */}
                            {testSeries.hasLiveTests && testSeries.liveTestSchedule && (
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-semibold text-gray-900 mb-2">Live Test Schedule:</h4>
                                    <p className="text-sm text-gray-600 bg-red-50 p-2 rounded">
                                        🔴 {testSeries.liveTestSchedule}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {testSeries.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex flex-wrap gap-2">
                                        {testSeries.tags.map((tag, index) => (
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

                            {/* What's Included */}
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        All practice tests
                                    </li>
                                    {testSeries.hasLiveTests && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Live test sessions
                                        </li>
                                    )}
                                    {testSeries.solutionAvailable && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Detailed solutions
                                        </li>
                                    )}
                                    {testSeries.resultAnalysis && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Performance analytics
                                        </li>
                                    )}
                                    {testSeries.rankingSystem && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Ranking system
                                        </li>
                                    )}
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Progress tracking
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Mobile access
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && testSeries && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    product={{
                        id: testSeries._id,
                        title: testSeries.title,
                        price: testSeries.price,
                        type: 'testSeries',
                        image: testSeries.image,
                    }}
                    onSuccess={() => {
                        fetchTestSeries();
                        setShowPaymentModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default TestSeriesDetailPage;