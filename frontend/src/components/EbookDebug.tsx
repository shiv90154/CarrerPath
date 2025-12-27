import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EbookDebug: React.FC = () => {
    const [ebooks, setEbooks] = useState<any[]>([]);
    const [selectedEbook, setSelectedEbook] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEbooks();
    }, []);

    const fetchEbooks = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://carrerpath-m48v.onrender.com/api/ebooks');
            setEbooks(data);
            console.log('Ebooks fetched:', data);
        } catch (err: any) {
            console.error('Error fetching ebooks:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchEbookDetail = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`https://carrerpath-m48v.onrender.com/api/ebooks/${id}`);
            setSelectedEbook(data);
            console.log('Ebook detail fetched:', data);
        } catch (err: any) {
            console.error('Error fetching ebook detail:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Ebook Debug Tool</h1>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ebooks List */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Available Ebooks ({ebooks.length})</h2>
                    <div className="space-y-3">
                        {ebooks.map((ebook) => (
                            <div key={ebook._id} className="border rounded-lg p-4">
                                <h3 className="font-semibold">{ebook.title}</h3>
                                <p className="text-sm text-gray-600">{ebook.category}</p>
                                <p className="text-sm">Price: ₹{ebook.price}</p>
                                <button
                                    onClick={() => fetchEbookDetail(ebook._id)}
                                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    View Details
                                </button>
                                <a
                                    href={`/e-books/${ebook._id}`}
                                    className="ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 inline-block"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open Page
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Ebook Detail */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Ebook Detail</h2>
                    {selectedEbook ? (
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg">{selectedEbook.title}</h3>
                            <div className="mt-4 space-y-2 text-sm">
                                <p><strong>ID:</strong> {selectedEbook._id}</p>
                                <p><strong>Description:</strong> {selectedEbook.description}</p>
                                <p><strong>Full Description:</strong> {selectedEbook.fullDescription}</p>
                                <p><strong>Price:</strong> ₹{selectedEbook.price}</p>
                                <p><strong>Original Price:</strong> ₹{selectedEbook.originalPrice}</p>
                                <p><strong>Category:</strong> {selectedEbook.category}</p>
                                <p><strong>Language:</strong> {selectedEbook.language}</p>
                                <p><strong>Pages:</strong> {selectedEbook.pages}</p>
                                <p><strong>File Size:</strong> {selectedEbook.fileSize}</p>
                                <p><strong>Format:</strong> {selectedEbook.format}</p>
                                <p><strong>Author:</strong> {selectedEbook.author?.name}</p>
                                <p><strong>Rating:</strong> {selectedEbook.rating}</p>
                                <p><strong>Downloads:</strong> {selectedEbook.totalDownloads}</p>
                                <p><strong>Has Purchased:</strong> {selectedEbook.hasPurchased ? 'Yes' : 'No'}</p>
                                <p><strong>Is Featured:</strong> {selectedEbook.isFeatured ? 'Yes' : 'No'}</p>
                                <p><strong>Tags:</strong> {selectedEbook.tags?.join(', ')}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Select an ebook to view details</p>
                    )}
                </div>
            </div>

            {/* API Test Results */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
                <div className="bg-gray-100 p-4 rounded">
                    <p><strong>API Base URL:</strong> https://carrerpath-m48v.onrender.com/api/ebooks</p>
                    <p><strong>Total Ebooks:</strong> {ebooks.length}</p>
                    <p><strong>Current Route:</strong> {window.location.pathname}</p>
                    <p><strong>Browser:</strong> {navigator.userAgent}</p>
                </div>
            </div>
        </div>
    );
};

export default EbookDebug;