import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GooglePayModal from '../components/GooglePayModal';

interface Ebook {
    _id: string;
    title: string;
    description: string;
    fullDescription: string;
    price: number;
    originalPrice: number;
    coverImage: string;
    category: string;
    language: string;
    pages: number;
    fileSize: string;
    format: string;
    tags: string[];
    author: {
        _id: string;
        name: string;
        bio: string;
        avatar: string;
    };
    publishedDate: string;
    isbn: string;
    rating: number;
    totalRatings: number;
    discountPercentage: number;
    hasPurchased: boolean;
    downloadUrl?: string;
    previewUrl?: string;
    totalDownloads: number;
}

const EbookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEbook();
        }
    }, [id, user]);

    const fetchEbook = async () => {
        try {
            setLoading(true);
            const config = user ? {
                headers: { Authorization: `Bearer ${user.token}` }
            } : {};

            const { data } = await axios.get<Ebook>(
                `https://carrerpath-m48v.onrender.com/api/ebooks/${id}`,
                config
            );

            setEbook(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to fetch ebook');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowPaymentModal(true);
    };

    const handleDownload = async () => {
        if (!ebook?.hasPurchased || !ebook.downloadUrl) {
            alert('Please purchase the ebook to download');
            return;
        }

        try {
            setDownloading(true);
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` },
                responseType: 'blob' as const,
            };

            const response = await axios.get(ebook.downloadUrl, config);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${ebook.title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error(err);
            alert('Failed to download ebook');
        } finally {
            setDownloading(false);
        }
    };

    const handlePreview = () => {
        if (ebook?.previewUrl) {
            window.open(ebook.previewUrl, '_blank');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading ebook...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !ebook) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ebook Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/e-books')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to E-Books
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
                                <div className="flex-shrink-0">
                                    <img
                                        src={ebook.coverImage}
                                        alt={ebook.title}
                                        className="w-48 h-64 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium mr-2">
                                            {ebook.category}
                                        </span>
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                            {ebook.format}
                                        </span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {ebook.title}
                                    </h1>
                                    <p className="text-lg text-gray-600 mb-4">
                                        by {ebook.author.name}
                                    </p>
                                    <p className="text-gray-600 mb-4">{ebook.description}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                        <div>
                                            <span className="font-medium">Pages:</span> {ebook.pages}
                                        </div>
                                        <div>
                                            <span className="font-medium">Language:</span> {ebook.language}
                                        </div>
                                        <div>
                                            <span className="font-medium">File Size:</span> {ebook.fileSize}
                                        </div>
                                        <div>
                                            <span className="font-medium">Published:</span> {formatDate(ebook.publishedDate)}
                                        </div>
                                        {ebook.isbn && (
                                            <div className="col-span-2">
                                                <span className="font-medium">ISBN:</span> {ebook.isbn}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-3 mt-6">
                                        {ebook.previewUrl && (
                                            <button
                                                onClick={handlePreview}
                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                                            >
                                                📖 Preview
                                            </button>
                                        )}
                                        {ebook.hasPurchased && (
                                            <button
                                                onClick={handleDownload}
                                                disabled={downloading}
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            >
                                                {downloading ? 'Downloading...' : '📥 Download'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About This Book</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 mb-6">{ebook.fullDescription}</p>

                                {/* Author Info */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">About the Author</h4>
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                            {ebook.author.avatar ? (
                                                <img
                                                    src={ebook.author.avatar}
                                                    alt={ebook.author.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">✍️</span>
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{ebook.author.name}</h5>
                                            {ebook.author.bio && (
                                                <p className="text-gray-600 text-sm mt-1">{ebook.author.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Reviews & Ratings
                            </h3>
                            {ebook.rating > 0 ? (
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center">
                                        <span className="text-3xl font-bold text-gray-900 mr-2">
                                            {ebook.rating.toFixed(1)}
                                        </span>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-5 h-5 ${i < Math.floor(ebook.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-gray-600">
                                            ({ebook.totalRatings} reviews)
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No reviews yet. Be the first to review this book!</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(ebook.price)}
                                    </span>
                                    {ebook.discountPercentage > 0 && (
                                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                                            {ebook.discountPercentage}% OFF
                                        </span>
                                    )}
                                </div>
                                {ebook.originalPrice > ebook.price && (
                                    <span className="text-gray-500 line-through">
                                        {formatPrice(ebook.originalPrice)}
                                    </span>
                                )}
                            </div>

                            {!ebook.hasPurchased ? (
                                <button
                                    onClick={handlePurchase}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold mb-4"
                                >
                                    Buy E-Book
                                </button>
                            ) : (
                                <div className="bg-green-50 border border-green-200 text-green-800 py-3 px-4 rounded-lg mb-4 text-center font-semibold">
                                    ✅ E-Book Purchased
                                </div>
                            )}

                            {/* Book Details */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📄 Pages</span>
                                    <span className="font-semibold">{ebook.pages}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📁 Format</span>
                                    <span className="font-semibold">{ebook.format}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">💾 File Size</span>
                                    <span className="font-semibold">{ebook.fileSize}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">🌐 Language</span>
                                    <span className="font-semibold">{ebook.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📥 Downloads</span>
                                    <span className="font-semibold">{ebook.totalDownloads}</span>
                                </div>
                                {ebook.rating > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">⭐ Rating</span>
                                        <span className="font-semibold">
                                            {ebook.rating.toFixed(1)} ({ebook.totalRatings})
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {ebook.tags.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex flex-wrap gap-2">
                                        {ebook.tags.map((tag, index) => (
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
                                        Digital book access
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Offline reading
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Multiple device access
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Search & bookmark
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Lifetime access
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Pay Modal */}
            {showPaymentModal && ebook && (
                <GooglePayModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    product={{
                        id: ebook._id,
                        title: ebook.title,
                        price: ebook.price,
                        type: 'ebook',
                        image: ebook.coverImage,
                    }}
                    onSuccess={() => {
                        fetchEbook();
                        setShowPaymentModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default EbookDetailPage;