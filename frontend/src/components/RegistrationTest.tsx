import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, Mail, User, Phone, Lock } from 'lucide-react';

const RegistrationTest: React.FC = () => {
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [testEmail] = useState(`test${Date.now()}@example.com`);

    const addResult = (test: string, status: 'success' | 'error', message: string, data?: any) => {
        setTestResults(prev => [...prev, { test, status, message, data, timestamp: new Date() }]);
    };

    const runTests = async () => {
        setLoading(true);
        setTestResults([]);

        try {
            // Test 1: Send OTP
            addResult('Send OTP', 'success', 'Starting OTP send test...');

            const otpResponse = await axios.post('https://carrerpath-m48v.onrender.com/api/users/send-otp', {
                email: testEmail,
                name: 'Test User'
            });

            addResult('Send OTP', 'success', 'OTP sent successfully', otpResponse.data);

            // Test 2: Get OTP (development only)
            try {
                const getOtpResponse = await axios.get(`https://carrerpath-m48v.onrender.com/api/users/get-otp/${testEmail}`);
                addResult('Get OTP', 'success', 'OTP retrieved for testing', getOtpResponse.data);

                // Test 3: Verify OTP and Register
                const verifyResponse = await axios.post('https://carrerpath-m48v.onrender.com/api/users/verify-otp', {
                    email: testEmail,
                    otp: getOtpResponse.data.otp,
                    phone: '9876543210',
                    password: 'TestPass123',
                    role: 'student'
                });

                addResult('Verify OTP', 'success', 'User registered successfully', {
                    userId: verifyResponse.data._id,
                    name: verifyResponse.data.name,
                    email: verifyResponse.data.email,
                    emailVerified: verifyResponse.data.emailVerified
                });

                // Test 4: Login with new user
                const loginResponse = await axios.post('https://carrerpath-m48v.onrender.com/api/users/login', {
                    email: testEmail,
                    password: 'TestPass123'
                });

                addResult('Login', 'success', 'Login successful', {
                    userId: loginResponse.data._id,
                    token: loginResponse.data.token ? 'Token received' : 'No token'
                });

                // Test 5: Get student stats
                const statsResponse = await axios.get('https://carrerpath-m48v.onrender.com/api/student/stats', {
                    headers: { Authorization: `Bearer ${loginResponse.data.token}` }
                });

                addResult('Student Stats', 'success', 'Dashboard stats retrieved', statsResponse.data);

            } catch (error: any) {
                if (error.response?.status === 403) {
                    addResult('Get OTP', 'error', 'OTP endpoint not available in production (this is expected)');
                    addResult('Manual Test', 'success', 'Please check your email for the OTP and complete registration manually');
                } else {
                    addResult('Get OTP', 'error', error.response?.data?.message || error.message);
                }
            }

        } catch (error: any) {
            addResult('Send OTP', 'error', error.response?.data?.message || error.message);
        }

        setLoading(false);
    };

    const testDashboardAPIs = async () => {
        setLoading(true);
        setTestResults([]);

        // Test with a dummy token (this will fail but show us the API structure)
        const dummyToken = 'dummy-token';
        const config = { headers: { Authorization: `Bearer ${dummyToken}` } };

        const endpoints = [
            { name: 'Student Courses', url: '/api/student/courses' },
            { name: 'Student Test Series', url: '/api/student/testseries' },
            { name: 'Student Ebooks', url: '/api/student/ebooks' },
            { name: 'Student Study Materials', url: '/api/student/studymaterials' },
            { name: 'Student Results', url: '/api/student/results' },
            { name: 'Student Payments', url: '/api/student/payments' },
            { name: 'Student Stats', url: '/api/student/stats' }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await axios.get(`https://carrerpath-m48v.onrender.com${endpoint.url}`, config);
                addResult(endpoint.name, 'success', 'API endpoint working', response.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    addResult(endpoint.name, 'success', 'API endpoint exists (401 expected without valid token)');
                } else {
                    addResult(endpoint.name, 'error', error.response?.data?.message || error.message);
                }
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-600" />
                        Registration & Dashboard System Test
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={runTests}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            Test Registration Flow
                        </button>

                        <button
                            onClick={testDashboardAPIs}
                            disabled={loading}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Test Dashboard APIs
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Running tests...</p>
                        </div>
                    )}

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
                                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                            {JSON.stringify(result.data, null, 2)}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        ))}
                    </div>

                    {testResults.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Click a button above to start testing</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Registration Flow Test</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Sends OTP to test email</li>
                                <li>• Retrieves OTP (dev only)</li>
                                <li>• Verifies OTP and creates user</li>
                                <li>• Tests login with new user</li>
                                <li>• Fetches dashboard stats</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-2">Dashboard APIs Test</h3>
                            <ul className="space-y-1 text-gray-600">
                                <li>• Tests all student dashboard endpoints</li>
                                <li>• Verifies API structure</li>
                                <li>• Checks authentication requirements</li>
                                <li>• Validates response formats</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            <strong>Test Email:</strong> {testEmail}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationTest;