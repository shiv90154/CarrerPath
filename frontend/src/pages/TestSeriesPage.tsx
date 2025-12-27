import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface TestSeries {
    createdAt: string;
    _id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    level: string;
    duration: string;
    language: string;
    tags: string[];
    instructor: {
        _id: string;
        name: string;
    };
    totalTests: number;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    discountPercentage: number;
    isFeatured: boolean;
}

const TestSeriesPage: React.FC = () => {
    const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
    const [filteredTestSeries, setFilteredTestSeries] = useState<TestSeries[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

    const categories = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Teaching', 'Other'];
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchTestSeries();
    }, []);

    useEffect(() => {
        filterAndSortTestSeries();
    }, [testSeries, searchTerm, selectedCategory, selectedLevel, sortBy, priceRange]);

    const fetchTestSeries = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<TestSeries[]>('http://localhost:5000/api/testseries');
            setTestSeries(data);
            setError(null);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch test series');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortTestSeries = () => {
        let filtered = [...testSeries];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(series =>
                series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                series.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                series.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(series => series.category === selectedCategory);
        }

        // Level filter
        if (selectedLevel) {
            filtered = filtered.filter(series => series.level === selectedLevel);
        }

        // Price range filter
        filtered = filtered.filter(series =>
            series.price >= priceRange[0] && series.price <= priceRange[1]
        );

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
                filtered.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
                break;
            case 'newest':
            default:
                filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
                break;
        }

        setFilteredTestSeries(filtered);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedLevel('');
        setSortBy('newest');
        setPriceRange([0, 10000]);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading test series...</p>
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
                            onClick={fetchTestSeries}
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
                            Test Series 📝
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Practice with comprehensive test series designed by experts to help you excel in your exams
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
                                    placeholder="Search test series..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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

                            {/* Level */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Level
                                </label>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Levels</option>
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
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
                                    <option value="popular">Most Popular</option>
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
                                    Test Series ({filteredTestSeries.length})
                                </h2>
                                <p className="text-gray-600">
                                    {searchTerm && `Results for "${searchTerm}"`}
                                </p>
                            </div>
                        </div>

                        {/* Featured Test Series */}
                        {filteredTestSeries.some(series => series.isFeatured) && (
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    ⭐ Featured Test Series
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {filteredTestSeries
                                        .filter(series => series.isFeatured)
                                        .slice(0, 2)
                                        .map((series) => (
                                            <div key={series._id} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                                                <div className="flex items-start space-x-4">
                                                    <img
                                                        src={series.image}
                                                        alt={series.title}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm mr-2">
                                                                {series.category}
                                                            </span>
                                                            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
                                                                FEATURED
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-bold mb-2">{series.title}</h4>
                                                        <p className="text-blue-100 mb-3 line-clamp-2">{series.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4 text-sm">
                                                                <span>📝 {series.totalTests} Tests</span>
                                                                <span>👥 {series.enrolledStudents}</span>
                                                                {series.rating > 0 && (
                                                                    <span>⭐ {series.rating.toFixed(1)}</span>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold">
                                                                    {formatPrice(series.price)}
                                                                </div>
                                                                {series.discountPercentage > 0 && (
                                                                    <div className="text-blue-200 line-through text-sm">
                                                                        {formatPrice(series.originalPrice)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Link
                                                            to={`/test-series/${series._id}`}
                                                            className="inline-block mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
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

                        {/* Test Series Grid */}
                        {filteredTestSeries.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📝</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No test series found
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTestSeries
                                    .filter(series => !series.isFeatured)
                                    .map((series) => (
                                        <div key={series._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="relative">
                                                <img
                                                    src={series.image}
                                                    alt={series.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                                {series.discountPercentage > 0 && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                                                        {series.discountPercentage}% OFF
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                                                    {series.category}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {series.level}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {series.language}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {series.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {series.description}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                                    <span className="mr-4">📝 {series.totalTests} Tests</span>
                                                    <span className="mr-4">⏱️ {series.duration}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                                    <span className="mr-4">👥 {series.enrolledStudents} students</span>
                                                    {series.rating > 0 && (
                                                        <span className="flex items-center">
                                                            ⭐ {series.rating.toFixed(1)} ({series.totalRatings})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <span className="text-2xl font-bold text-gray-900">
                                                            {formatPrice(series.price)}
                                                        </span>
                                                        {series.discountPercentage > 0 && (
                                                            <span className="text-gray-500 line-through text-sm ml-2">
                                                                {formatPrice(series.originalPrice)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/test-series/${series._id}`}
                                                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    By {series.instructor.name}
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

export default TestSeriesPage;