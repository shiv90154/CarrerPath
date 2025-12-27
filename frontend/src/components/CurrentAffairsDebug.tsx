import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrentAffairsDebug: React.FC = () => {
    const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<any>(null);

    useEffect(() => {
        fetchCurrentAffairs();
    }, []);

    const fetchCurrentAffairs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://carrerpath-m48v.onrender.com/api/current-affairs/published');
            console.log('Current Affairs API Response:', response.data);

            if (response.data.success) {
                setCurrentAffairs(response.data.data);
                setFilters(response.data.filters);
            }
        } catch (err: any) {
            console.error('Error fetching current affairs:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const testSingleCurrentAffair = async (id: string) => {
        try {
            const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/current-affairs/${id}`);
            console.log('Single Current Affair:', response.data);
        } catch (err: any) {
            console.error('Error fetching single current affair:', err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Current Affairs Debug Tool</h1>

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
                {/* Current Affairs List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Current Affairs ({currentAffairs.length})</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {currentAffairs.map((affair) => (
                            <div key={affair._id} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-sm">{affair.title}</h3>
                                <p className="text-xs text-gray-600 mt-1">{affair.category} - {affair.importanceLevel}</p>
                                <p className="text-xs text-gray-500">Views: {affair.views} | Date: {new Date(affair.date).toLocaleDateString()}</p>
                                <div className="mt-2 space-x-2">
                                    <button
                                        onClick={() => testSingleCurrentAffair(affair._id)}
                                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                                    >
                                        Test Detail API
                                    </button>
                                    <a
                                        href={`/current-affairs`}
                                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 inline-block"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open Page
                                    </a>
                                </div>
                                {affair.tags && affair.tags.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-500">Tags: {affair.tags.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters and Stats */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Filters</h2>
                    {filters ? (
                        <div className="border rounded-lg p-4">
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-sm">Categories:</p>
                                    <p className="text-xs text-gray-600">{filters.categories?.join(', ') || 'None'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Years:</p>
                                    <p className="text-xs text-gray-600">{filters.years?.join(', ') || 'None'}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Months:</p>
                                    <p className="text-xs text-gray-600">{filters.months?.join(', ') || 'None'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No filter data available</p>
                    )}

                    <h2 className="text-xl font-semibold mb-4 mt-6">Debug Info</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        <p><strong>API Endpoint:</strong> https://carrerpath-m48v.onrender.com/api/current-affairs/published</p>
                        <p><strong>Total Items:</strong> {currentAffairs.length}</p>
                        <p><strong>Current Route:</strong> {window.location.pathname}</p>
                        <p><strong>Loading State:</strong> {loading ? 'Loading' : 'Loaded'}</p>
                        <p><strong>Error State:</strong> {error || 'None'}</p>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={fetchCurrentAffairs}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Sample Current Affair Detail */}
            {currentAffairs.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Sample Current Affair Detail</h2>
                    <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
                        <pre className="text-xs">{JSON.stringify(currentAffairs[0], null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentAffairsDebug;