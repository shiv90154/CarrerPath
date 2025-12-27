import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Plus, Search, Filter, Eye, Edit, Trash2, ToggleLeft, ToggleRight,
    Calendar, Bell, AlertCircle, Users, Tag, ArrowUpDown
} from 'lucide-react';

interface Notice {
    _id: string;
    title: string;
    description: string;
    badge: string;
    category: string;
    priority: number;
    targetAudience: string;
    publishDate: string;
    expiryDate?: string;
    isPublished: boolean;
    isActive: boolean;
    views: number;
    author: {
        name: string;
        email: string;
    };
}

interface NoticesResponse {
    success: boolean;
    data: Notice[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

interface Stats {
    total: number;
    published: number;
    unpublished: number;
    expired: number;
    categoryStats: Array<{
        _id: string;
        count: number;
        published: number;
    }>;
    badgeStats: Array<{
        _id: string;
        count: number;
    }>;
}

const AdminNoticeListPage: React.FC = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        badge: '',
        targetAudience: '',
        isPublished: ''
    });

    useEffect(() => {
        fetchNotices();
        fetchStats();
    }, [currentPage, searchTerm, filters]);

    const fetchNotices = async () => {
        if (!user?.token) return;

        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                search: searchTerm,
                ...filters
            });

            const { data } = await axios.get<NoticesResponse>(
                `https://carrerpath-m48v.onrender.com/api/notices/admin/all?${params}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (data.success) {
                setNotices(data.data);
                setTotalPages(data.pagination.pages);
            }
            setError(null);
        } catch (err: any) {
            console.error('Error fetching notices:', err);
            setError('Failed to fetch notices');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        if (!user?.token) return;

        try {
            const { data } = await axios.get(
                'https://carrerpath-m48v.onrender.com/api/notices/admin/stats',
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const handleTogglePublish = async (id: string) => {
        if (!user?.token) return;

        try {
            await axios.patch(
                `https://carrerpath-m48v.onrender.com/api/notices/admin/toggle-publish/${id}`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            fetchNotices();
            fetchStats();
        } catch (err) {
            console.error('Error toggling publish status:', err);
            alert('Failed to update publish status');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!user?.token) return;

        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await axios.delete(
                `https://carrerpath-m48v.onrender.com/api/notices/admin/${id}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            fetchNotices();
            fetchStats();
            alert('Notice deleted successfully');
        } catch (err) {
            console.error('Error deleting notice:', err);
            alert('Failed to delete notice');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getBadgeColor = (badge: string) => {
        const colors: Record<string, string> = {
            'new': 'bg-green-100 text-green-800',
            'urgent': 'bg-red-100 text-red-800',
            'important': 'bg-orange-100 text-orange-800',
            'live': 'bg-blue-100 text-blue-800',
            'admission': 'bg-purple-100 text-purple-800',
            'exam': 'bg-indigo-100 text-indigo-800',
            'result': 'bg-yellow-100 text-yellow-800'
        };
        return colors[badge] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityColor = (priority: number) => {
        if (priority === 3) return 'text-red-600';
        if (priority === 2) return 'text-orange-600';
        return 'text-green-600';
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Notice Management</h1>
                            <p className="text-gray-600 mt-1">Manage announcements and notices</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/admin/notices/new"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Notice
                            </Link>
                            <Link
                                to="/admin/dashboard"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <Bell className="w-8 h-8 text-blue-600 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                                    <div className="text-sm text-gray-600">Total Notices</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <Eye className="w-8 h-8 text-green-600 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
                                    <div className="text-sm text-gray-600">Published</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <AlertCircle className="w-8 h-8 text-orange-600 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.unpublished}</div>
                                    <div className="text-sm text-gray-600">Draft</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <Calendar className="w-8 h-8 text-red-600 mr-3" />
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.expired}</div>
                                    <div className="text-sm text-gray-600">Expired</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search notices..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="general">General</option>
                                <option value="admission">Admission</option>
                                <option value="exam">Exam</option>
                                <option value="result">Result</option>
                                <option value="holiday">Holiday</option>
                                <option value="event">Event</option>
                                <option value="scholarship">Scholarship</option>
                                <option value="course">Course</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                            <select
                                value={filters.badge}
                                onChange={(e) => setFilters(prev => ({ ...prev, badge: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Badges</option>
                                <option value="new">New</option>
                                <option value="urgent">Urgent</option>
                                <option value="important">Important</option>
                                <option value="live">Live</option>
                                <option value="admission">Admission</option>
                                <option value="exam">Exam</option>
                                <option value="result">Result</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                            <select
                                value={filters.targetAudience}
                                onChange={(e) => setFilters(prev => ({ ...prev, targetAudience: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Audiences</option>
                                <option value="all">All</option>
                                <option value="students">Students</option>
                                <option value="instructors">Instructors</option>
                                <option value="admins">Admins</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.isPublished}
                                onChange={(e) => setFilters(prev => ({ ...prev, isPublished: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="true">Published</option>
                                <option value="false">Draft</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notices Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading notices...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                            <p className="text-gray-600">{error}</p>
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-6xl mb-4">📢</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notices Found</h3>
                            <p className="text-gray-600 mb-4">No notices match your current filters.</p>
                            <Link
                                to="/admin/notices/new"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Create First Notice
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Notice
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category & Badge
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Views
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {notices.map((notice) => (
                                            <tr key={notice._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {notice.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500 line-clamp-2">
                                                            {notice.description}
                                                        </div>
                                                        <div className="flex items-center mt-1 text-xs text-gray-400">
                                                            <Users className="w-3 h-3 mr-1" />
                                                            {notice.targetAudience}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(notice.badge)}`}>
                                                            {notice.badge.toUpperCase()}
                                                        </span>
                                                        <div className="text-xs text-gray-500 capitalize">
                                                            {notice.category}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`flex items-center text-sm font-medium ${getPriorityColor(notice.priority)}`}>
                                                        <ArrowUpDown className="w-4 h-4 mr-1" />
                                                        {notice.priority === 3 ? 'High' : notice.priority === 2 ? 'Medium' : 'Low'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${notice.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {notice.isPublished ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                                                        {notice.views}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div>
                                                        <div>{formatDate(notice.publishDate)}</div>
                                                        {notice.expiryDate && (
                                                            <div className="text-xs text-red-500">
                                                                Expires: {formatDate(notice.expiryDate)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleTogglePublish(notice._id)}
                                                            className={`p-1 rounded ${notice.isPublished ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'
                                                                }`}
                                                            title={notice.isPublished ? 'Unpublish' : 'Publish'}
                                                        >
                                                            {notice.isPublished ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                                        </button>
                                                        <Link
                                                            to={`/admin/notices/${notice._id}/edit`}
                                                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(notice._id, notice.title)}
                                                            className="text-red-600 hover:text-red-800 p-1 rounded"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                                <span className="font-medium">{totalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Previous
                                                </button>
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    const page = i + 1;
                                                    return (
                                                        <button
                                                            key={page}
                                                            onClick={() => setCurrentPage(page)}
                                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                })}
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNoticeListPage;