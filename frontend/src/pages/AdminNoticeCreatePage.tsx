import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const AdminNoticeCreatePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(!!id);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        badge: 'new',
        category: 'general',
        priority: 1,
        targetAudience: 'all',
        publishDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        link: ''
    });

    useEffect(() => {
        if (id) {
            fetchNotice();
        }
    }, [id]);

    const fetchNotice = async () => {
        if (!user?.token) return;

        try {
            setInitialLoading(true);
            const { data } = await axios.get(
                `https://carrerpath-m48v.onrender.com/api/notices/admin/${id}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            if (data.success) {
                const notice = data.data;
                setFormData({
                    title: notice.title || '',
                    description: notice.description || '',
                    content: notice.content || '',
                    badge: notice.badge || 'new',
                    category: notice.category || 'general',
                    priority: notice.priority || 1,
                    targetAudience: notice.targetAudience || 'all',
                    publishDate: notice.publishDate ? new Date(notice.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : '',
                    link: notice.link || ''
                });
            }
        } catch (err: any) {
            console.error('Error fetching notice:', err);
            alert(err.response?.data?.message || 'Failed to fetch notice');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token) return;

        try {
            setLoading(true);

            if (id) {
                // Update existing notice
                const { data } = await axios.put(
                    `https://carrerpath-m48v.onrender.com/api/notices/admin/${id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );

                if (data.success) {
                    alert('Notice updated successfully!');
                    navigate('/admin/notices');
                }
            } else {
                // Create new notice
                const { data } = await axios.post(
                    'https://carrerpath-m48v.onrender.com/api/notices/admin',
                    formData,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );

                if (data.success) {
                    alert('Notice created successfully!');
                    navigate('/admin/notices');
                }
            }
        } catch (err: any) {
            console.error('Error saving notice:', err);
            alert(err.response?.data?.message || `Failed to ${id ? 'update' : 'create'} notice`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notice...</p>
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
                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin/notices"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{id ? 'Edit Notice' : 'Create Notice'}</h1>
                                <p className="text-gray-600 mt-1">{id ? 'Update the announcement or notification' : 'Add a new announcement or notification'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter notice title"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter brief description"
                                />
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter detailed content (optional)"
                                />
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Badge
                                </label>
                                <select
                                    name="badge"
                                    value={formData.badge}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="new">New</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="important">Important</option>
                                    <option value="live">Live</option>
                                    <option value="admission">Admission</option>
                                    <option value="exam">Exam</option>
                                    <option value="result">Result</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
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

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value={1}>Low</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>High</option>
                                </select>
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Audience
                                </label>
                                <select
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All</option>
                                    <option value="students">Students</option>
                                    <option value="instructors">Instructors</option>
                                    <option value="admins">Admins</option>
                                </select>
                            </div>

                            {/* Publish Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publish Date
                                </label>
                                <input
                                    type="date"
                                    name="publishDate"
                                    value={formData.publishDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Link */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                            <Link
                                to="/admin/notices"
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {id ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {id ? 'Update Notice' : 'Create Notice'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminNoticeCreatePage;