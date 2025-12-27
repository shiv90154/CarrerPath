import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import axios from 'axios';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

interface TestResult {
    name: string;
    status: 'pending' | 'success' | 'error';
    message: string;
}

const PaymentSystemTest: React.FC = () => {
    const { user } = useAuth();
    const [tests, setTests] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const updateTest = (name: string, status: 'pending' | 'success' | 'error', message: string) => {
        setTests(prev => {
            const existing = prev.find(t => t.name === name);
            if (existing) {
                existing.status = status;
                existing.message = message;
                return [...prev];
            }
            return [...prev, { name, status, message }];
        });
    };

    const runTests = async () => {
        if (!user) {
            alert('Please login first to run payment tests');
            return;
        }

        setIsRunning(true);
        setTests([]);

        // Test 1: Check Razorpay Key Configuration
        updateTest('Razorpay Configuration', 'pending', 'Checking environment variables...');
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (razorpayKey && razorpayKey !== 'your_razorpay_key_id_here') {
            updateTest('Razorpay Configuration', 'success', `Key configured: ${razorpayKey.substring(0, 10)}...`);
        } else {
            updateTest('Razorpay Configuration', 'error', 'Razorpay key not configured properly');
        }

        // Test 2: Check API URL Configuration
        updateTest('API Configuration', 'pending', 'Checking API URL...');
        const apiUrl = import.meta.env.VITE_API_URL || 'https://carrerpath-m48v.onrender.com';
        updateTest('API Configuration', 'success', `API URL: ${apiUrl}`);

        // Test 3: Test Payment Order Creation
        updateTest('Payment Order Creation', 'pending', 'Testing order creation...');
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            const testOrderData = {
                amount: 100, // ₹1 for testing
                courseId: 'test-course-id',
                productType: 'course'
            };

            const response = await axios.post(
                buildApiUrl(API_ENDPOINTS.PAYMENT_ORDERS),
                testOrderData,
                config
            );

            if (response.data.razorpayOrderId) {
                updateTest('Payment Order Creation', 'success', `Order created: ${response.data.razorpayOrderId}`);
            } else {
                updateTest('Payment Order Creation', 'error', 'Order creation failed - no order ID returned');
            }
        } catch (error: any) {
            updateTest('Payment Order Creation', 'error', `Error: ${error.response?.data?.message || error.message}`);
        }

        // Test 4: Check Razorpay Script Loading
        updateTest('Razorpay Script', 'pending', 'Checking Razorpay script...');
        if (window.Razorpay) {
            updateTest('Razorpay Script', 'success', 'Razorpay SDK loaded successfully');
        } else {
            updateTest('Razorpay Script', 'error', 'Razorpay SDK not loaded');
        }

        // Test 5: Test Course Access Check
        updateTest('Course Access Check', 'pending', 'Testing course access...');
        try {
            const response = await axios.get(
                buildApiUrl('/api/courses'),
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (response.data && Array.isArray(response.data.courses)) {
                updateTest('Course Access Check', 'success', `Found ${response.data.courses.length} courses`);
            } else {
                updateTest('Course Access Check', 'error', 'Invalid course data structure');
            }
        } catch (error: any) {
            updateTest('Course Access Check', 'error', `Error: ${error.response?.data?.message || error.message}`);
        }

        // Test 6: Test Payment History
        updateTest('Payment History', 'pending', 'Testing payment history...');
        try {
            const response = await axios.get(
                buildApiUrl(API_ENDPOINTS.MY_ORDERS),
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            updateTest('Payment History', 'success', `Found ${response.data.length || 0} orders`);
        } catch (error: any) {
            updateTest('Payment History', 'error', `Error: ${error.response?.data?.message || error.message}`);
        }

        setIsRunning(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Loader className="w-5 h-5 text-yellow-500 animate-spin" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'border-yellow-200 bg-yellow-50';
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Payment System Test Suite
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Comprehensive testing of payment integration and course access
                    </p>

                    {!user ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
                            Please login to run payment system tests
                        </div>
                    ) : (
                        <button
                            onClick={runTests}
                            disabled={isRunning}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                        >
                            {isRunning ? (
                                <>
                                    <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                                    Running Tests...
                                </>
                            ) : (
                                'Run Payment Tests'
                            )}
                        </button>
                    )}
                </div>

                {tests.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Results:</h3>
                        {tests.map((test, index) => (
                            <div
                                key={index}
                                className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {getStatusIcon(test.status)}
                                        <span className="ml-3 font-medium text-gray-900">
                                            {test.name}
                                        </span>
                                    </div>
                                    <span className={`text-sm ${test.status === 'success' ? 'text-green-700' :
                                            test.status === 'error' ? 'text-red-700' :
                                                'text-yellow-700'
                                        }`}>
                                        {test.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600 ml-8">
                                    {test.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {tests.length > 0 && !isRunning && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Summary:</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-600">
                                    {tests.filter(t => t.status === 'success').length}
                                </div>
                                <div className="text-sm text-gray-600">Passed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    {tests.filter(t => t.status === 'error').length}
                                </div>
                                <div className="text-sm text-gray-600">Failed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {tests.filter(t => t.status === 'pending').length}
                                </div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSystemTest;