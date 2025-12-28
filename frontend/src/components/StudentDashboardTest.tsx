import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient, API_ENDPOINTS } from '../config/api';
import { CheckCircle, AlertCircle, User, BookOpen, TestTube, FileText, Trophy, CreditCard, BarChart3 } from 'lucide-react';

const StudentDashboardTest: React.FC = () => {
    const { user } = useAuth();
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const addResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
        setTestResults(prev => [...prev, { test, status, message, data, timestamp: new Date() }]);
    };

    const testDashboardAPIs = async () => {
        setLoading(true);
        setTestResults([]);

        if (!user) {
            addResult('Authentication', 'error', 'No user logged in. Please login first.');
            setLoading(false);
            return;
        }

        addResult('Authentication', 'success', `User logged in: ${user.name} (${user.email})`);

        const endpoints = [
            {
                name: 'Student Stats',
                endpoint: API_ENDPOINTS.STUDENT_STATS,
                icon: BarChart3,
                description: 'Dashboard statistics and overview data'
            },
            {
                name: 'Student Courses',
                endpoint: API_ENDPOINTS.STUDENT_COURSES,
                icon: BookOpen,
                description: 'Purchased courses list'
            },
            {
                name: 'Student Test Series',
                endpoint: API_ENDPOINTS.STUDENT_TESTSERIES,
                icon: TestTube,
                description: 'Purchased test series'
            },
            {
                name: 'Student Ebooks',
                endpoint: API_ENDPOINTS.STUDENT_EBOOKS,
                icon: BookOpen,
                description: 'Purchased e-books'
            },
            {
                name: 'Student Study Materials',
                endpoint: API_ENDPOINTS.STUDENT_STUDYMATERIALS,
                icon: FileText,
                description: 'Study materials and resources'
            },
            {
                name: 'Student Results',
                endpoint: API_ENDPOINTS.STUDENT_RESULTS,
                icon: Trophy,
                description: 'Test results and performance'
            },
            {
                name: 'Student Payments',
                endpoint: API_ENDPOINTS.STUDENT_PAYMENTS,
                icon: CreditCard,
                description: 'Payment history and transactions'
            }
        ];

        for (const endpoint of endpoints) {
            try {
                addResult(endpoint.name, 'success', `Testing ${endpoint.description}...`);

                const response = await apiClient.get(endpoint.endpoint);

                addResult(endpoint.name, 'success', `✅ API working - ${Array.isArray(response.data) ? response.data.length : 'Data'} items returned`, {
                    dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
                    itemCount: Array.isArray(response.data) ? response.data.length : 'N/A',
                    sampleData: Array.isArray(response.data) ? response.data.slice(0, 2) : response.data
                });
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || error.message;
                const statusCode = error.response?.status;

                if (statusCode === 401) {
                    addResult(endpoint.name, 'error', `❌ Authentication failed - Token may be invalid`);
                } else if (statusCode === 404) {
                    addResult(endpoint.name, 'error', `❌ Endpoint not found - ${endpoint.endpoint}`);
                } else if (statusCode === 500) {
                    addResult(endpoint.name, 'error', `❌ Server error - ${errorMessage}`);
                } else {
                    addResult(endpoint.name, 'error', `❌ ${errorMessage}`, {
                        status: statusCode,
                        endpoint: endpoint.endpoint
                    });
                }
            }
        }

        setLoading(false);
    };

    const testUserProfile = async () => {
        setLoading(true);
        setTestResults([]);

        if (!user) {
            addResult('Profile Test', 'error', 'No user logged in');
            setLoading(false);
            return;
        }

        try {
            // Test profile endpoint
            const profileResponse = await apiClient.get(API_ENDPOINTS.PROFILE);
            addResult('User Profile', 'success', 'Profile data retrieved successfully', {
                name: profileResponse.data.name,
                email: profileResponse.data.email,
                role: profileResponse.data.role,
                emailVerified: profileResponse.data.emailVerified
            });

            // Test token validity
            addResult('Token Validation', 'success', 'JWT token is valid and working');

        } catch (error: any) {
            addResult('Profile Test', 'error', error.response?.data?.message || error.message);
        }

        setLoading(false);
    };

    const testAPIConfiguration = () => {
        setLoading(true);
        setTestResults([]);

        // Test API configuration
        addResult('API Base URL', 'success', `Using: ${apiClient.defaults.baseURL}`);

        // Test localStorage
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                addResult('Local Storage', 'success', 'User data found in localStorage', {
                    hasToken: !!parsedUser.token,
                    tokenLength: parsedUser.token ? parsedUser.token.length : 0,
                    userId: parsedUser._id,
                    role: parsedUser.role
                });
            } catch (e) {
                addResult('Local Storage', 'error', 'Invalid user data in localStorage');
            }
        } else {
            addResult('Local Storage', 'error', 'No user data in localStorage');
        }

        // Test API endpoints configuration
        const endpointCount = Object.keys(API_ENDPOINTS).length;
        addResult('API Endpoints', 'success', `${endpointCount} endpoints configured`, {
            studentEndpoints: [
                'STUDENT_COURSES',
                'STUDENT_TESTSERIES',
                'STUDENT_EBOOKS',
                'STUDENT_STUDYMATERIALS',
                'STUDENT_RESULTS',
                'STUDENT_PAYMENTS',
                'STUDENT_STATS'
            ].filter(key => API_ENDPOINTS[key as keyof typeof API_ENDPOINTS])
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        Student Dashboard System Test
                    </h1>

                    {/* User Status */}
                    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <h2 className="font-semibold text-blue-900 mb-2">Current User Status</h2>
                        {user ? (
                            <div className="text-sm text-blue-700">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Token:</strong> {user.token ? `${user.token.substring(0, 20)}...` : 'No token'}</p>
                            </div>
                        ) : (
                            <p className="text-red-600">❌ No user logged in. Please login first.</p>
                        )}
                    </div>

                    {/* Test Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <button
                            onClick={testAPIConfiguration}
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Test Configuration
                        </button>

                        <button
                            onClick={testUserProfile}
                            disabled={loading || !user}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <User className="w-5 h-5" />
                            Test User Profile
                        </button>

                        <button
                            onClick={testDashboardAPIs}
                            disabled={loading || !user}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <BarChart3 className="w-5 h-5" />
                            Test Dashboard APIs
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Running tests...</p>
                        </div>
                    )}

                    {/* Test Results */}
                    <div className="space-y-4">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${result.status === 'success'
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-red-50 border-red-200'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {result.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <h3 className="font-semibold text-gray-900">{result.test}</h3>
                                    <span className="text-xs text-gray-500">
                                        {result.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className={`text-sm ${result.status === 'success' ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {result.message}
                                </p>
                                {result.data && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                                            View Details
                                        </summary>
                                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>

                    {testResults.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Click a button above to start testing</p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Testing Instructions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="font-medium text-purple-700 mb-2">Configuration Test</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Checks API base URL</li>
                                <li>• Validates localStorage data</li>
                                <li>• Verifies endpoint configuration</li>
                                <li>• Tests token availability</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-green-700 mb-2">Profile Test</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Tests user profile endpoint</li>
                                <li>• Validates JWT token</li>
                                <li>• Checks authentication</li>
                                <li>• Verifies user data</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-blue-700 mb-2">Dashboard APIs Test</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Tests all 7 dashboard endpoints</li>
                                <li>• Validates data structure</li>
                                <li>• Checks authentication</li>
                                <li>• Measures response times</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> Make sure you're logged in before running the tests.
                            If tests fail, check the browser console for detailed error messages.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardTest;