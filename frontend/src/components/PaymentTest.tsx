import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PaymentTest: React.FC = () => {
    const { user } = useAuth();
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const runTests = () => {
        setTestResults([]);

        // Test 1: Check if user is logged in
        if (user) {
            addResult('✅ User is logged in');
        } else {
            addResult('❌ User not logged in');
            return;
        }

        // Test 2: Check if Razorpay script is loaded
        if (window.Razorpay) {
            addResult('✅ Razorpay SDK is loaded');
        } else {
            addResult('❌ Razorpay SDK not loaded');
        }

        // Test 3: Check environment variables
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (razorpayKey && razorpayKey !== 'your_razorpay_key_id_here') {
            addResult('✅ Razorpay key is configured');
        } else {
            addResult('❌ Razorpay key not configured');
        }

        // Test 4: Check API endpoint
        fetch('http://localhost:5000/api/payments/test', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    addResult('✅ Payment API endpoint is accessible');
                } else {
                    addResult('❌ Payment API endpoint not accessible');
                }
            })
            .catch(() => {
                addResult('❌ Cannot connect to payment API');
            });
    };

    const testPayment = async () => {
        if (!user) {
            addResult('❌ Please login first');
            return;
        }

        try {
            addResult('🔄 Testing payment creation...');

            const response = await fetch('http://localhost:5000/api/payments/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    amount: 100, // ₹100 for testing
                    courseId: '507f1f77bcf86cd799439011' // Dummy course ID
                })
            });

            if (response.ok) {
                const data = await response.json();
                addResult('✅ Payment order created successfully');
                addResult(`Order ID: ${data.razorpayOrderId}`);
            } else {
                const error = await response.text();
                addResult(`❌ Payment order creation failed: ${error}`);
            }
        } catch (error) {
            addResult(`❌ Payment test failed: ${error}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Payment System Test</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Environment Check</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Razorpay Key:</strong>
                            <span className="ml-2 font-mono">
                                {import.meta.env.VITE_RAZORPAY_KEY_ID || 'Not set'}
                            </span>
                        </div>
                        <div>
                            <strong>Razorpay SDK:</strong>
                            <span className="ml-2">
                                {window.Razorpay ? '✅ Loaded' : '❌ Not loaded'}
                            </span>
                        </div>
                        <div>
                            <strong>User:</strong>
                            <span className="ml-2">
                                {user ? `✅ ${user.name}` : '❌ Not logged in'}
                            </span>
                        </div>
                        <div>
                            <strong>API URL:</strong>
                            <span className="ml-2 font-mono">
                                {import.meta.env.VITE_API_URL || 'http://localhost:5000'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={runTests}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Run System Tests
                    </button>
                    <button
                        onClick={testPayment}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={!user}
                    >
                        Test Payment Creation
                    </button>
                </div>

                {testResults.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                        <div className="bg-gray-100 p-4 rounded max-h-64 overflow-y-auto">
                            {testResults.map((result, index) => (
                                <div key={index} className="text-sm font-mono mb-1">
                                    {result}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <h4 className="font-semibold text-yellow-800">Setup Instructions:</h4>
                    <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
                        <li>Create <code>frontend/.env</code> with <code>VITE_RAZORPAY_KEY_ID=your_test_key</code></li>
                        <li>Create <code>backend/.env</code> with Razorpay credentials</li>
                        <li>Restart both frontend and backend servers</li>
                        <li>Login to test the payment system</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default PaymentTest;