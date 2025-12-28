import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

interface Book {
    title: string;
    description: string;
    fileUrl: string;
    previewUrl?: string;
    coverImage?: string;
    pages: number;
    fileSize: string;
    format: string;
    isFree: boolean;
    hasPreview: boolean;
    previewPages: number;
    order: number;
    downloadUrl?: string;
    canDownload?: boolean;
    isPreviewOnly?: boolean;
}

interface Subcategory {
    subcategoryName: string;
    subcategoryDescription?: string;
    books: Book[];
}

interface Category {
    categoryName: string;
    categoryDescription?: string;
    subcategories: Subcategory[];
    books: Book[]; // Direct books without subcategories
}

interface Ebook {
    _id: string;
    title: string;
    description: string;
    fullDescription: string;
    price: number;
    originalPrice: number;
    coverImage: string;
    fileUrl?: string; // Legacy support
    previewUrl?: string; // Legacy support
    isFree: boolean;
    category: string;
    language: string;
    pages?: number; // Legacy support
    fileSize?: string; // Legacy support
    format: string;
    isbn?: string;
    publishedDate: string;
    tags: string[];
    author: {
        _id: string;
        name: string;
        bio: string;
        avatar: string;
    };
    rating: number;
    totalRatings: number;
    totalDownloads: number;
    totalBooks: number;
    discountPercentage: number;
    isFeatured: boolean;
    hasPreviewSample: boolean;
    previewPages: number;
    downloadLimit: number;
    watermarkEnabled: boolean;
    printingAllowed: boolean;
    offlineAccess: boolean;
    validityPeriod: number;
    hasPurchased: boolean;
    accessType: 'full' | 'limited';
    totalLockedBooks?: number;
    content: Category[]; // New hierarchical structure
}

const SingleEbookPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
            setError(err.response?.data?.message || 'Failed to fetch e-book');
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

    const handleDownload = (book?: Book) => {
        if (!user) {
            alert('Please log in to download this e-book.');
            return;
        }

        const downloadUrl = book?.downloadUrl || ebook?.fileUrl;
        const canDownload = book?.canDownload || ebook?.isFree || ebook?.hasPurchased;

        if (downloadUrl && canDownload) {
            window.open(downloadUrl, '_blank');
        } else {
            alert('Please purchase the e-book to download it.');
        }
    };

    const handlePreview = (book?: Book) => {
        const previewUrl = book?.previewUrl || ebook?.previewUrl;
        if (previewUrl) {
            window.open(previewUrl, '_blank');
        } else {
            alert('Preview not available for this book.');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading e-book...</p>
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
                        <div className="text-red-500 text-xl mb-4">📚</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">E-book Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/ebooks')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to E-books
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
                                <img
                                    src={ebook.coverImage}
                                    alt={ebook.title}
                                    className="w-32 h-40 object-cover rounded-lg shadow-md"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-medium mr-2">
                                            {ebook.category}
                                        </span>
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                            {ebook.format}
                                        </span>
                                        {ebook.isFree && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium ml-2">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {ebook.title}
                                    </h1>
                                    <p className="text-gray-600 mb-4">{ebook.description}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="mr-4">📚 {ebook.totalBooks || 1} Books</span>
                                        <span className="mr-4">🌐 {ebook.language}</span>
                                        <span className="mr-4">📥 {ebook.totalDownloads} Downloads</span>
                                        {ebook.validityPeriod > 0 && (
                                            <span>⏳ {ebook.validityPeriod} days access</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About This E-book Collection</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-600 mb-6">{ebook.fullDescription}</p>

                                {/* Author Info */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Author</h4>
                                    <div className="flex items-start">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                            {ebook.author.avatar ? (
                                                <img
                                                    src={ebook.author.avatar}
                                                    alt={ebook.author.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl">👨‍💼</span>
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

                        {/* E-book Content - Hierarchical Structure */}
                        <div className="bg-white rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                E-book Collection Content
                            </h3>

                            {!ebook.hasPurchased && ebook.totalLockedBooks && (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg mb-4 text-sm">
                                    🔒 {ebook.totalLockedBooks} books are locked. Purchase the collection to unlock all books.
                                </div>
                            )}

                            {/* New Hierarchical Content Structure */}
                            {ebook.content && ebook.content.length > 0 ? (
                                <div className="space-y-6">
                                    {ebook.content.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Category Header */}
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                                    <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                                                        {categoryIndex + 1}
                                                    </span>
                                                    {category.categoryName}
                                                </h3>
                                                {category.categoryDescription && (
                                                    <p className="text-gray-600 mt-2 ml-11">{category.categoryDescription}</p>
                                                )}
                                            </div>

                                            {/* Category Content */}
                                            <div className="p-6">
                                                {/* Subcategories */}
                                                {category.subcategories && category.subcategories.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {category.subcategories.map((subcategory, subIndex) => (
                                                            <div key={subIndex} className="ml-4">
                                                                {/* Subcategory Header */}
                                                                <div className="flex items-center mb-3">
                                                                    <span className="text-purple-600 mr-2 text-lg">👉</span>
                                                                    <h4 className="text-lg font-semibold text-gray-700">
                                                                        {subcategory.subcategoryName}
                                                                    </h4>
                                                                    <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                        {subcategory.books.length} books
                                                                    </span>
                                                                </div>

                                                                {/* Subcategory Description */}
                                                                {subcategory.subcategoryDescription && (
                                                                    <p className="text-gray-600 mb-3 ml-6">{subcategory.subcategoryDescription}</p>
                                                                )}

                                                                {/* Books in Subcategory */}
                                                                <div className="ml-6 space-y-3">
                                                                    {subcategory.books.map((book, bookIndex) => (
                                                                        <div key={bookIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                            <div className="flex items-start justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center mb-2">
                                                                                        {book.isFree && (
                                                                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                                Free
                                                                                            </span>
                                                                                        )}
                                                                                        {book.hasPreview && (
                                                                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                                Preview Available
                                                                                            </span>
                                                                                        )}
                                                                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                                                            {book.format}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h5 className="font-medium text-gray-800 mb-1">
                                                                                        {book.title}
                                                                                    </h5>
                                                                                    <p className="text-gray-600 text-sm mb-2">{book.description}</p>
                                                                                    <div className="flex items-center text-xs text-gray-500">
                                                                                        <span className="mr-4">📄 {book.pages} pages</span>
                                                                                        <span className="mr-4">💾 {book.fileSize}</span>
                                                                                        {book.hasPreview && (
                                                                                            <span>👁️ {book.previewPages} preview pages</span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="ml-4 flex-shrink-0 space-x-2">
                                                                                    {book.hasPreview && book.previewUrl && (
                                                                                        <button
                                                                                            onClick={() => handlePreview(book)}
                                                                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                                                        >
                                                                                            Preview
                                                                                        </button>
                                                                                    )}
                                                                                    {book.canDownload ? (
                                                                                        <button
                                                                                            onClick={() => handleDownload(book)}
                                                                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                                                        >
                                                                                            Download
                                                                                        </button>
                                                                                    ) : (
                                                                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    /* Direct books in category (no subcategories) */
                                                    <div className="space-y-3">
                                                        {category.books.map((book, bookIndex) => (
                                                            <div key={bookIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center mb-2">
                                                                            {book.isFree && (
                                                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                    Free
                                                                                </span>
                                                                            )}
                                                                            {book.hasPreview && (
                                                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                                                    Preview Available
                                                                                </span>
                                                                            )}
                                                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                                                {book.format}
                                                                            </span>
                                                                        </div>
                                                                        <h5 className="font-medium text-gray-800 mb-1">
                                                                            {book.title}
                                                                        </h5>
                                                                        <p className="text-gray-600 text-sm mb-2">{book.description}</p>
                                                                        <div className="flex items-center text-xs text-gray-500">
                                                                            <span className="mr-4">📄 {book.pages} pages</span>
                                                                            <span className="mr-4">💾 {book.fileSize}</span>
                                                                            {book.hasPreview && (
                                                                                <span>👁️ {book.previewPages} preview pages</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4 flex-shrink-0 space-x-2">
                                                                        {book.hasPreview && book.previewUrl && (
                                                                            <button
                                                                                onClick={() => handlePreview(book)}
                                                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                                            >
                                                                                Preview
                                                                            </button>
                                                                        )}
                                                                        {book.canDownload ? (
                                                                            <button
                                                                                onClick={() => handleDownload(book)}
                                                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                                            >
                                                                                Download
                                                                            </button>
                                                                        ) : (
                                                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Fallback to Legacy Single Book Structure */
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                {ebook.isFree && (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                        Free
                                                    </span>
                                                )}
                                                {ebook.hasPreviewSample && (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2">
                                                        Preview Available
                                                    </span>
                                                )}
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                    {ebook.format}
                                                </span>
                                            </div>
                                            <h5 className="font-medium text-gray-800 mb-1">
                                                {ebook.title}
                                            </h5>
                                            <p className="text-gray-600 text-sm mb-2">{ebook.description}</p>
                                            <div className="flex items-center text-xs text-gray-500">
                                                {ebook.pages && <span className="mr-4">📄 {ebook.pages} pages</span>}
                                                {ebook.fileSize && <span className="mr-4">💾 {ebook.fileSize}</span>}
                                                {ebook.hasPreviewSample && (
                                                    <span>👁️ {ebook.previewPages} preview pages</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-shrink-0 space-x-2">
                                            {ebook.hasPreviewSample && ebook.previewUrl && (
                                                <button
                                                    onClick={() => handlePreview()}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                >
                                                    Preview
                                                </button>
                                            )}
                                            {(ebook.isFree || ebook.hasPurchased) ? (
                                                <button
                                                    onClick={() => handleDownload()}
                                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                >
                                                    Download
                                                </button>
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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

                            {!ebook.hasPurchased && !ebook.isFree ? (
                                <button
                                    onClick={handlePurchase}
                                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold mb-4"
                                >
                                    Buy E-book Collection
                                </button>
                            ) : (
                                <div className="bg-green-50 border border-green-200 text-green-800 py-3 px-4 rounded-lg mb-4 text-center font-semibold">
                                    ✅ {ebook.isFree ? 'Free E-book' : 'E-book Purchased'}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📚 Total Books</span>
                                    <span className="font-semibold">{ebook.totalBooks || 1}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📄 Format</span>
                                    <span className="font-semibold">{ebook.format}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">🌐 Language</span>
                                    <span className="font-semibold">{ebook.language}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">📥 Downloads</span>
                                    <span className="font-semibold">{ebook.totalDownloads}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">💾 Download Limit</span>
                                    <span className="font-semibold">{ebook.downloadLimit}</span>
                                </div>
                                {ebook.validityPeriod > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">⏳ Access Period</span>
                                        <span className="font-semibold">{ebook.validityPeriod} days</span>
                                    </div>
                                )}
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

                            {/* Features */}
                            <div className="mt-6 pt-4 border-t">
                                <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    {ebook.hasPreviewSample && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Preview samples available
                                        </li>
                                    )}
                                    {ebook.offlineAccess && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Offline access
                                        </li>
                                    )}
                                    <li className="flex items-center">
                                        <svg className={`w-4 h-4 mr-2 ${ebook.printingAllowed ? 'text-green-500' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {ebook.printingAllowed ? 'Printing allowed' : 'Printing restricted'}
                                    </li>
                                    {ebook.watermarkEnabled && (
                                        <li className="flex items-center">
                                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Watermarked for security
                                        </li>
                                    )}
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Mobile compatible
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && ebook && (
                <PaymentModal
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

export default SingleEbookPage;

