import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Video {
    _id: string;
    title: string;
    description: string;
    youtubeVideoId: string;
    duration: string;
    order: number;
    course: {
        _id: string;
        title: string;
    };
    views: number;
    isActive: boolean;
    isFree: boolean;
    createdAt: string;
}

interface Course {
    _id: string;
    title: string;
}

const AdminVideoManagementPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [videos, setVideos] = useState<Video[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingVideo, setEditingVideo] = useState<Video | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeVideoId: '',
        duration: '',
        order: 1,
        courseId: '',
        isFree: false,
        isActive: true
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        fetchVideos();
        fetchCourses();
    }, [user, navigate]);

    const fetchVideos = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.get('/api/admin/videos', config);
            setVideos(data);
        } catch (err) {
            setError('Failed to fetch videos');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            const { data } = await axios.get('/api/courses/admin', config);
            setCourses(data);
        } catch (err) {
            console.error('Failed to fetch courses');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };

        try {
            if (editingVideo) {
                // Update video
                await axios.put(`/api/admin/videos/${editingVideo._id}`, formData, config);
                alert('Video updated successfully');
            } else {
                // Create video
                await axios.post('/api/admin/videos', formData, config);
                alert('Video created successfully');
            }

            resetForm();
            fetchVideos();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save video');
        }
    };

    const handleDelete = async (videoId: string) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.delete(`/api/admin/videos/${videoId}`, config);
            alert('Video deleted successfully');
            fetchVideos();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete video');
        }
    };

    const handleEdit = (video: Video) => {
        setEditingVideo(video);
        setFormData({
            title: video.title,
            description: video.description,
            youtubeVideoId: video.youtubeVideoId,
            duration: video.duration,
            order: video.order,
            courseId: video.course._id,
            isFree: video.isFree,
            isActive: video.isActive
        });
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            youtubeVideoId: '',
            duration: '',
            order: 1,
            courseId: '',
            isFree: false,
            isActive: true
        });
        setEditingVideo(null);
        setShowAddModal(false);
    };

    const extractYouTubeId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : url;
    };

    const handleYouTubeUrlChange = (value: string) => {
        const videoId = extractYouTubeId(value);
        setFormData({ ...formData, youtubeVideoId: videoId });
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Video Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add New Video
                </button>
            </div>

            {/* Videos Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Video
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Views
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {videos.map((video) => (
                            <tr key={video._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{video.title}</div>
                                        <div className="text-sm text-gray-500">{video.description}</div>
                                        <div className="text-xs text-gray-400">Order: {video.order}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{video.course.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{video.duration}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{video.views}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${video.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {video.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        {video.isFree && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(video)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingVideo ? 'Edit Video' : 'Add New Video'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Video Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        YouTube URL or Video ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.youtubeVideoId}
                                        onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="https://www.youtube.com/watch?v=... or just the video ID"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter full YouTube URL or just the 11-character video ID
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="e.g., 15:30"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Course
                                    </label>
                                    <select
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFree}
                                            onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Free Video</span>
                                    </label>

                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 space-x-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {editingVideo ? 'Update Video' : 'Create Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVideoManagementPage;