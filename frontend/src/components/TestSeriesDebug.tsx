import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestSeriesDebug: React.FC = () => {
    const [testSeries, setTestSeries] = useState<any[]>([]);
    const [selectedSeries, setSelectedSeries] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTestSeries();
    }, []);

    const fetchTestSeries = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://carrerpath-m48v.onrender.com/api/testseries');
            setTestSeries(data);
            console.log('Test series fetched:', data);
        } catch (err: any) {
            console.error('Error fetching test series:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSeriesDetail = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://carrerpath-m48v.onrender.com/api/testseries/${id}`);
            setSelectedSeries(data);
            console.log('Test series detail fetched:', data);
        } catch (err: any) {
            console.error('Error fetching test series detail:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Test Series Debug Tool</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {error}
                </div>
            )}

            {loading && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Test Series List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Test Series ({testSeries.length})</h2>
                    <div className="space-y-3">
                        {testSeries.map((series) => (
                            <div key={series._id} className="border rounded-lg p-4">
                                <h3 className="font-semibold">{series.title}</h3>
                                <p className="text-sm text-gray-600">{series.category}</p>
                                <p className="text-sm">Price: ₹{series.price}</p>
                                <p className="text-sm">Tests: {series.totalTests}</p>
                                <p className="text-sm">Level: {series.level}</p>
                                <div className="mt-2 space-x-2">
                                    <button
                                        onClick={() => fetchSeriesDetail(series._id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        View Details
                                    </button>
                                    <a
                                        href={`/test-series/${series._id}`}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 inline-block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Page
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Test Series Detail */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Test Series Detail</h2>
                    {selectedSeries ? (
                        <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                            <h3 className="font-semibold text-lg">{selectedSeries.title}</h3>
                            <div className="mt-4 space-y-2 text-sm">
                                <p><strong>ID:</strong> {selectedSeries._id}</p>
                                <p><strong>Description:</strong> {selectedSeries.description}</p>
                                <p><strong>Full Description:</strong> {selectedSeries.fullDescription}</p>
                                <p><strong>Price:</strong> ₹{selectedSeries.price}</p>
                                <p><strong>Original Price:</strong> ₹{selectedSeries.originalPrice}</p>
                                <p><strong>Category:</strong> {selectedSeries.category}</p>
                                <p><strong>Level:</strong> {selectedSeries.level}</p>
                                <p><strong>Duration:</strong> {selectedSeries.duration}</p>
                                <p><strong>Language:</strong> {selectedSeries.language}</p>
                                <p><strong>Total Tests:</strong> {selectedSeries.totalTests}</p>
                                <p><strong>Total Questions:</strong> {selectedSeries.totalQuestions}</p>
                                <p><strong>Enrolled Students:</strong> {selectedSeries.enrolledStudents}</p>
                                <p><strong>Rating:</strong> {selectedSeries.rating}</p>
                                <p><strong>Instructor:</strong> {selectedSeries.instructor?.name}</p>
                                <p><strong>Has Purchased:</strong> {selectedSeries.hasPurchased ? 'Yes' : 'No'}</p>
                                <p><strong>Access Type:</strong> {selectedSeries.accessType}</p>
                                <p><strong>Is Featured:</strong> {selectedSeries.isFeatured ? 'Yes' : 'No'}</p>
                                <p><strong>Tags:</strong> {selectedSeries.tags?.join(', ')}</p>

                                {selectedSeries.tests && (
                                    <div className="mt-4">
                                        <p><strong>Available Tests ({selectedSeries.tests.length}):</strong></p>
                                        <ul className="list-disc list-inside ml-4 space-y-1">
                                            {selectedSeries.tests.map((test: any, index: number) => (
                                                <li key={test._id || index} className="text-xs">
                                                    {test.title} - {test.isFree ? 'FREE' : 'PAID'}
                                                    ({test.totalQuestions} questions, {test.duration} min)
                                                </li>
                                            ))}
                                        </ul>
                                        {selectedSeries.totalLockedTests && (
                                            <p className="text-red-600 text-xs mt-2">
                                                {selectedSeries.totalLockedTests} tests are locked (purchase required)
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select a test series to view details</p>
                    )}
                </div>
            </div>

            {/* API Test Results */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
                <div className="bg-gray-100 p-4 rounded">
                    <p><strong>API Base URL:</strong> https://carrerpath-m48v.onrender.com/api/testseries</p>
                    <p><strong>Total Test Series:</strong> {testSeries.length}</p>
                    <p><strong>Current Route:</strong> {window.location.pathname}</p>
                    <p><strong>User Agent:</strong> {navigator.userAgent}</p>
                </div>
            </div>
        </div>
    );
};

export default TestSeriesDebug;