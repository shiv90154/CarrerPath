import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboardDebug: React.FC = () => {
    const { user } = useAuth();
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const runTest = async (testName: string, url: string, method: string = 'GET') => {
        setLoading(true);
        const startTime = Date.now();

        try {
            console.log(`Running test: ${testName}`);
            console.log(`URL: ${url}`);
            console.log(`Method: ${method}`);
            console.log(`User:`, user);

            const config = {
                method,
                url,
                headers: user ? { Authorization: `Bearer ${user.token}` } : {}
            };

            const response = await axios(config);
            const endTime = Date.now();

            const result = {
                test: testName,
                status: 'SUCCESS',
                statusCode: response.status,
                data: response.data,
                time: `${endTime - startTime}ms`,
                timestamp: new Date().toISOString()
            };

            console.log(`✅ ${testName} - SUCCESS:`, result);
            setTestResults(prev => [...prev, result]);

        } catch (error: any) {
            const endTime = Date.now();

            const result = {
                test: testName,
                status: 'ERROR',
                statusCode: error.response?.status || 'No Response',
                error: error.message,
                errorData: error.response?.data,
                time: `${endTime - startTime}ms`,
                timestamp: new Date().toISOString()
            };

            console.error(`❌ ${testName} - ERROR:`, result);
            setTestResults(prev => [...prev, result]);
        }

        setLoading(false);
    };

    const runAllTests = async () => {
        setTestResults([]);

        // Test 1: Basic API health
        await runTest('API Health Check', 'http://localhost:5000/health');

        // Test 2: Admin routes health
        await runTest('Admin Routes Health', 'http://localhost:5000/api/admin/health');

        // Test 3: Admin test route (requires auth)
        await runTest('Admin Test Route', 'http://localhost:5000/api/admin/test');

        // Test 4: Admin stats (the failing one)
        await runTest('Admin Stats', 'http://localhost:5000/api/admin/stats');
    };

    const clearResults = () => {
        setTestResults([]);
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Admin debugging tool - Admins only.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        🔧 Admin Dashboard Debug Tool
                    </h1>
                    <p className="text-gray-600 mb-6">
                        This tool helps debug admin dashboard API issues. Current user: <strong>{user?.name}</strong> ({user?.role})
                    </p>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={runAllTests}
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Running Tests...' : 'Run All Tests'}
                        </button>

                        <button
                            onClick={clearResults}
                            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Clear Results
                        </button>
                    </div>
                </div>

                {/* Test Results */}
                <div className="space-y-4">
                    {testResults.map((result, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${result.status === 'SUCCESS' ? 'border-green-500' : 'border-red-500'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {result.status === 'SUCCESS' ? '✅' : '❌'} {result.test}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>Status: {result.statusCode}</span>
                                    <span>Time: {result.time}</span>
                                    <span>{result.timestamp}</span>
                                </div>
                            </div>

                            {result.status === 'SUCCESS' ? (
                                <div>
                                    <h4 className="font-medium text-green-800 mb-2">Response Data:</h4>
                                    <pre className="bg-green-50 p-4 rounded text-sm overflow-x-auto">
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                                    <div className="bg-red-50 p-4 rounded text-sm">
                                        <p><strong>Error:</strong> {result.error}</p>
                                        {result.errorData && (
                                            <div className="mt-2">
                                                <strong>Server Response:</strong>
                                                <pre className="mt-1 overflow-x-auto">
                                                    {JSON.stringify(result.errorData, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {testResults.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">🧪</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tests Run Yet</h3>
                        <p className="text-gray-600">Click "Run All Tests" to start debugging the admin dashboard issues.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardDebug;