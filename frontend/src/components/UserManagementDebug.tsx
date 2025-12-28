import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserManagementDebug: React.FC = () => {
    const { user } = useAuth();
    const [debugInfo, setDebugInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const runDiagnostics = async () => {
        setLoading(true);
        const results: any = {
            timestamp: new Date().toISOString(),
            userContext: null,
            serverHealth: null,
            adminHealth: null,
            authTest: null,
            usersTest: null,
            errors: []
        };

        try {
            // 1. Check user context
            results.userContext = {
                isLoggedIn: !!user,
                role: user?.role,
                hasToken: !!user?.token,
                tokenLength: user?.token?.length,
                userName: user?.name
            };

            // 2. Test server health
            try {
                const healthResponse = await axios.get('https://carrerpath-m48v.onrender.com/health');
                results.serverHealth = {
                    status: 'OK',
                    data: healthResponse.data
                };
            } catch (error: any) {
                results.serverHealth = {
                    status: 'ERROR',
                    error: error.message,
                    code: error.response?.status
                };
                results.errors.push('Server health check failed');
            }

            // 3. Test admin routes health
            try {
                const adminHealthResponse = await axios.get('https://carrerpath-m48v.onrender.com/api/admin/health');
                results.adminHealth = {
                    status: 'OK',
                    data: adminHealthResponse.data
                };
            } catch (error: any) {
                results.adminHealth = {
                    status: 'ERROR',
                    error: error.message,
                    code: error.response?.status
                };
                results.errors.push('Admin routes health check failed');
            }

            // 4. Test authentication
            if (user?.token) {
                try {
                    const authTestResponse = await axios.get('https://carrerpath-m48v.onrender.com/api/admin/test', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    results.authTest = {
                        status: 'OK',
                        data: authTestResponse.data
                    };
                } catch (error: any) {
                    results.authTest = {
                        status: 'ERROR',
                        error: error.message,
                        code: error.response?.status,
                        responseData: error.response?.data
                    };
                    results.errors.push('Authentication test failed');
                }

                // 5. Test users endpoint
                try {
                    const usersResponse = await axios.get('https://carrerpath-m48v.onrender.com/api/admin/users?page=1&limit=5', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    results.usersTest = {
                        status: 'OK',
                        userCount: usersResponse.data.users?.length || 0,
                        totalUsers: usersResponse.data.total,
                        stats: usersResponse.data.stats,
                        sampleUser: usersResponse.data.users?.[0] ? {
                            name: usersResponse.data.users[0].name,
                            email: usersResponse.data.users[0].email,
                            role: usersResponse.data.users[0].role
                        } : null
                    };
                } catch (error: any) {
                    results.usersTest = {
                        status: 'ERROR',
                        error: error.message,
                        code: error.response?.status,
                        responseData: error.response?.data
                    };
                    results.errors.push('Users API test failed');
                }
            } else {
                results.errors.push('No authentication token available');
            }

        } catch (error: any) {
            results.errors.push(`Unexpected error: ${error.message}`);
        }

        setDebugInfo(results);
        setLoading(false);
    };

    useEffect(() => {
        runDiagnostics();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OK': return 'text-green-600';
            case 'ERROR': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OK': return '✅';
            case 'ERROR': return '❌';
            default: return '⚪';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Management Debug Panel</h2>
                <button
                    onClick={runDiagnostics}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Running...' : 'Run Diagnostics'}
                </button>
            </div>

            {debugInfo.timestamp && (
                <div className="space-y-6">
                    <div className="text-sm text-gray-500">
                        Last run: {new Date(debugInfo.timestamp).toLocaleString()}
                    </div>

                    {/* Errors Summary */}
                    {debugInfo.errors?.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-red-800 mb-2">Issues Found:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {debugInfo.errors.map((error: string, index: number) => (
                                    <li key={index} className="text-red-700">{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* User Context */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">User Context</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>Logged In: {debugInfo.userContext?.isLoggedIn ? '✅ Yes' : '❌ No'}</div>
                            <div>Role: {debugInfo.userContext?.role || 'N/A'}</div>
                            <div>Has Token: {debugInfo.userContext?.hasToken ? '✅ Yes' : '❌ No'}</div>
                            <div>Token Length: {debugInfo.userContext?.tokenLength || 'N/A'}</div>
                            <div className="col-span-2">User: {debugInfo.userContext?.userName || 'N/A'}</div>
                        </div>
                    </div>

                    {/* Server Health */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Server Health</h3>
                        <div className={`flex items-center space-x-2 ${getStatusColor(debugInfo.serverHealth?.status)}`}>
                            <span>{getStatusIcon(debugInfo.serverHealth?.status)}</span>
                            <span>Status: {debugInfo.serverHealth?.status}</span>
                        </div>
                        {debugInfo.serverHealth?.error && (
                            <div className="mt-2 text-sm text-red-600">
                                Error: {debugInfo.serverHealth.error}
                            </div>
                        )}
                    </div>

                    {/* Admin Routes Health */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Admin Routes Health</h3>
                        <div className={`flex items-center space-x-2 ${getStatusColor(debugInfo.adminHealth?.status)}`}>
                            <span>{getStatusIcon(debugInfo.adminHealth?.status)}</span>
                            <span>Status: {debugInfo.adminHealth?.status}</span>
                        </div>
                        {debugInfo.adminHealth?.error && (
                            <div className="mt-2 text-sm text-red-600">
                                Error: {debugInfo.adminHealth.error}
                            </div>
                        )}
                    </div>

                    {/* Authentication Test */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Authentication Test</h3>
                        <div className={`flex items-center space-x-2 ${getStatusColor(debugInfo.authTest?.status)}`}>
                            <span>{getStatusIcon(debugInfo.authTest?.status)}</span>
                            <span>Status: {debugInfo.authTest?.status}</span>
                        </div>
                        {debugInfo.authTest?.error && (
                            <div className="mt-2 text-sm text-red-600">
                                Error: {debugInfo.authTest.error} (Code: {debugInfo.authTest.code})
                            </div>
                        )}
                        {debugInfo.authTest?.data && (
                            <div className="mt-2 text-sm text-green-600">
                                Authenticated as: {debugInfo.authTest.data.user?.name} ({debugInfo.authTest.data.user?.role})
                            </div>
                        )}
                    </div>

                    {/* Users API Test */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-3">Users API Test</h3>
                        <div className={`flex items-center space-x-2 ${getStatusColor(debugInfo.usersTest?.status)}`}>
                            <span>{getStatusIcon(debugInfo.usersTest?.status)}</span>
                            <span>Status: {debugInfo.usersTest?.status}</span>
                        </div>
                        {debugInfo.usersTest?.error && (
                            <div className="mt-2 text-sm text-red-600">
                                Error: {debugInfo.usersTest.error} (Code: {debugInfo.usersTest.code})
                            </div>
                        )}
                        {debugInfo.usersTest?.status === 'OK' && (
                            <div className="mt-2 space-y-1 text-sm">
                                <div>Users Found: {debugInfo.usersTest.userCount}</div>
                                <div>Total Users: {debugInfo.usersTest.totalUsers}</div>
                                {debugInfo.usersTest.stats && (
                                    <div>Stats: {JSON.stringify(debugInfo.usersTest.stats)}</div>
                                )}
                                {debugInfo.usersTest.sampleUser && (
                                    <div>Sample User: {debugInfo.usersTest.sampleUser.name} ({debugInfo.usersTest.sampleUser.role})</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Raw Debug Data */}
                    <details className="bg-gray-50 rounded-lg p-4">
                        <summary className="text-lg font-semibold cursor-pointer">Raw Debug Data</summary>
                        <pre className="mt-3 text-xs bg-gray-100 p-3 rounded overflow-auto">
                            {JSON.stringify(debugInfo, null, 2)}
                        </pre>
                    </details>
                </div>
            )}
        </div>
    );
};

export default UserManagementDebug;