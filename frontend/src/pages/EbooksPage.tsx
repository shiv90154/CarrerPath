import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Ebook {
    _id: string;
    title: string;
    description: string;
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
    };
    rating: number;
    totalRatings: number;
    totalDownloads: number;
    discountPercentage: number;
    isFeatured: boolean;
    isFree: boolean;
    publishedDate: string;
}

const EbooksPage: React.FC = () => {
    const [ebooks, setEbooks] = useState<Ebook[]>([]);
    const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [showFreeOnly, setShowFreeOnly] = useState(false);

    const categories = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Teaching', 'General Knowledge', 'Other'];
    const formats = ['PDF', 'EPUB', 'MOBI'];

    useEffect(() => {
        fetchEbooks();
    }, []);

    useEffect(() => {
        filterAndSortEbooks();
    }, [ebooks, searchTerm, selectedCategory, selectedFormat, sortBy, priceRange, showFreeOnly]);

    const fetchEbooks = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<Ebook[]>('https://carrerpath-m48v.onrender.com/api/ebooks');
            setEbooks(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch ebooks');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortEbooks = () => {
        let filtered = [...ebooks];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(ebook =>
                ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ebook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ebook.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ebook.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(ebook => ebook.category === selectedCategory);
        }

        // Format filter
        if (selectedFormat) {
            filtered = filtered.filter(ebook => ebook.format === selectedFormat);
        }

        // Free only filter
        if (showFreeOnly) {
            filtered = filtered.filter(ebook => ebook.isFree);
        }

        // Price range filter (only for paid books)
        if (!showFreeOnly) {
            filtered = filtered.filter(ebook =>
                ebook.isFree || (ebook.price >= priceRange[0] && ebook.price <= priceRange[1])
            );
        }

        // Sort
        switch (sortBy) {
            case 'price_low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                filtered.sort((a, b) => b.totalDownloads - a.totalDownloads);
                break;
            case 'pages':
                filtered.sort((a, b) => b.pages - a.pages);
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
                break;
        }

        setFilteredEbooks(filtered);
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
            month: 'short'
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedFormat('');
        setSortBy('newest');
        setPriceRange([0, 5000]);
        setShowFreeOnly(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading ebooks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchEbooks}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Digital Library 📚
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Expand your knowledge with our comprehensive collection of digital books and study materials
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search books, authors..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Free Books Toggle */}
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={showFreeOnly}
                                        onChange={(e) => setShowFreeOnly(e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Free books only</span>
                                </label>
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Format */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Format
                                </label>
                                <select
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Formats</option>
                                    {formats.map(format => (
                                        <option key={format} value={format}>{format}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            {!showFreeOnly && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            step="50"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>₹0</span>
                                            <span>{formatPrice(priceRange[1])}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sort */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="popular">Most Downloaded</option>
                                    <option value="pages">Most Pages</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    E-Books ({filteredEbooks.length})
                                </h2>
                                <p className="text-gray-600">
                                    {searchTerm && `Results for "${searchTerm}"`}
                                    {showFreeOnly && " • Free books only"}
                                </p>
                            </div>
                        </div>

                        {/* Featured Ebooks */}
                        {filteredEbooks.some(ebook => ebook.isFeatured) && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    ⭐ Featured Books
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {filteredEbooks
                                        .filter(ebook => ebook.isFeatured)
                                        .slice(0, 2)
                                        .map((ebook) => (
                                            <div key={ebook._id} className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                                                <div className="flex items-start space-x-4">
                                                    <img
                                                        src={ebook.coverImage}
                                                        alt={ebook.title}
                                                        className="w-20 h-28 object-cover rounded-lg shadow-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm mr-2">
                                                                {ebook.category}
                                                            </span>
                                                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                                                                FEATURED
                                                            </span>
                                                            {ebook.isFree && (
                                                                <span className="bg-green-400 text-green-900 px-2 py-1 rounded text-xs font-semibold ml-1">
                                                                    FREE
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="text-xl font-bold mb-2">{ebook.title}</h4>
                                                        <p className="text-purple-100 mb-3 line-clamp-2">{ebook.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4 text-sm">
                                                                <span>📄 {ebook.pages} pages</span>
                                                                <span>📥 {ebook.totalDownloads}</span>
                                                                {ebook.rating > 0 && (
                                                                    <span>⭐ {ebook.rating.toFixed(1)}</span>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                {ebook.isFree ? (
                                                                    <div className="text-2xl font-bold">FREE</div>
                                                                ) : (
                                                                    <>
                                                                        <div className="text-2xl font-bold">
                                                                            {formatPrice(ebook.price)}
                                                                        </div>
                                                                        {ebook.discountPercentage > 0 && (
                                                                            <div className="text-purple-200 line-through text-sm">
                                                                                {formatPrice(ebook.originalPrice)}
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            to={`/e-books/${ebook._id}`}
                                                            className="inline-block mt-4 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Ebooks Grid */}
                        {filteredEbooks.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No books found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredEbooks
                                    .filter(ebook => !ebook.isFeatured)
                                    .map((ebook) => (
                                        <div key={ebook._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="relative">
                                                <img
                                                    src={ebook.coverImage}
                                                    alt={ebook.title}
                                                    className="w-full h-64 object-cover"
                                                />
                                                {ebook.isFree && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                                        FREE
                                                    </div>
                                                )}
                                                {!ebook.isFree && ebook.discountPercentage > 0 && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                                        {ebook.discountPercentage}% OFF
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    {ebook.format}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {ebook.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {ebook.language}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                                                    {ebook.title}
                                                </h3>
                                                <p className="text-xs text-gray-600 mb-2">
                                                    by {ebook.author.name}
                                                </p>
                                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                                    <span className="mr-3">📄 {ebook.pages}p</span>
                                                    <span className="mr-3">💾 {ebook.fileSize}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                                    <span className="mr-3">📥 {ebook.totalDownloads}</span>
                                                    {ebook.rating > 0 && (
                                                        <span className="flex items-center">
                                                            ⭐ {ebook.rating.toFixed(1)} ({ebook.totalRatings})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        {ebook.isFree ? (
                                                            <span className="text-lg font-bold text-green-600">FREE</span>
                                                        ) : (
                                                            <>
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {formatPrice(ebook.price)}
                                                                </span>
                                                                {ebook.discountPercentage > 0 && (
                                                                    <span className="text-gray-500 line-through text-xs ml-1">
                                                                        {formatPrice(ebook.originalPrice)}
                                                                    </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/e-books/${ebook._id}`}
                                                    className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-center font-medium text-sm block"
                                                >
                                                    {ebook.isFree ? 'Download Free' : 'View Details'}
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Published {formatDate(ebook.publishedDate)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EbooksPage;