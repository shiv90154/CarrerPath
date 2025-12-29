import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface YouTubeVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    categoryIndex?: number;
    subcategoryIndex?: number;
    onUploadSuccess: (video: any) => void;
}

const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
    isOpen,
    onClose,
    courseId,
    categoryIndex,
    subcategoryIndex,
    onUploadSuccess
}) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeVideoId: '',
        duration: '',
        order: 1,
        isFree: false,
        isPreview: false
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const extractYouTubeVideoId = (url: string): string => {
        // Handle various YouTube URL formats
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        return url; // Return as-is if no pattern matches
    };

    const handleYouTubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        const videoId = extractYouTubeVideoId(url);
        setFormData(prev => ({
            ...prev,
            youtubeVideoId: videoId
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.youtubeVideoId.trim()) {
            setError('Please enter a YouTube video URL or ID');
            return;
        }

        if (!formData.title.trim()) {
            setError('Please enter a video title');
            return;
        }

        setUploading(true);
        setError(null);

        const videoData = {
            title: formData.title,
            description: formData.description,
            youtubeVideoId: formData.youtubeVideoId,
            duration: formData.duration,
            order: formData.order,
            isFree: formData.isFree,
            isPreview: formData.isPreview
        };

        // Add hierarchical content structure info if provided
        if (categoryIndex !== undefined && categoryIndex !== null) {
            const validCategoryIndex = parseInt(categoryIndex.toString());
            if (!isNaN(validCategoryIndex) && validCategoryIndex >= 0) {
                (videoData as any).categoryIndex = validCategoryIndex;

                if (subcategoryIndex !== undefined && subcategoryIndex !== null) {
                    const validSubcategoryIndex = parseInt(subcategoryIndex.toString());
                    if (!isNaN(validSubcategoryIndex) && validSubcategoryIndex >= 0) {
                        (videoData as any).subcategoryIndex = validSubcategoryIndex;
                    }
                }
            }
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                },
            };

            // Choose endpoint based on whether it's hierarchical content or legacy
            const endpoint = categoryIndex !== undefined
                ? `https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}/content/youtube-videos`
                : `https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}/youtube-videos`;

            const response = await axios.post(endpoint, videoData, config);

            onUploadSuccess(response.data.video);

            // Reset form
            setFormData({
                title: '',
                description: '',
                youtubeVideoId: '',
                duration: '',
                order: 1,
                isFree: false,
                isPreview: false
            });
            onClose();

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to add YouTube video');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add YouTube Video</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={uploading}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            YouTube Video URL or ID *
                        </label>
                        <input
                            type="text"
                            onChange={handleYouTubeUrlChange}
                            placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploading}
                            required
                        />
                        {formData.youtubeVideoId && (
                            <p className="text-xs text-green-600 mt-1">
                                Video ID: {formData.youtubeVideoId}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploading}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={uploading}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                placeholder="e.g., 15:30"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={uploading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isFree"
                                checked={formData.isFree}
                                onChange={handleInputChange}
                                className="mr-2"
                                disabled={uploading}
                            />
                            <span className="text-sm text-gray-700">Free Sample Video</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="isPreview"
                                checked={formData.isPreview}
                                onChange={handleInputChange}
                                className="mr-2"
                                disabled={uploading}
                            />
                            <span className="text-sm text-gray-700">Preview Video</span>
                        </label>
                    </div>

                    {formData.youtubeVideoId && (
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600 mb-2">Preview:</p>
                            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                                <iframe
                                    src={`https://www.youtube.com/embed/${formData.youtubeVideoId}`}
                                    className="w-full h-full rounded"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={uploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            disabled={uploading || !formData.youtubeVideoId || !formData.title}
                        >
                            {uploading ? 'Adding...' : 'Add Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default YouTubeVideoModal;