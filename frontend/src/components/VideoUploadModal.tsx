import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface VideoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
    categoryIndex?: number;
    subcategoryIndex?: number;
    onUploadSuccess: (video: any) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
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
        duration: '',
        order: 1,
        isFree: false,
        isPreview: false
    });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('video/')) {
                setError('Please select a valid video file');
                return;
            }

            // Validate file size (100MB limit)
            if (file.size > 100 * 1024 * 1024) {
                setError('Video file size must be less than 100MB');
                return;
            }

            setVideoFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!videoFile) {
            setError('Please select a video file');
            return;
        }

        if (!formData.title.trim()) {
            setError('Please enter a video title');
            return;
        }

        setUploading(true);
        setError(null);
        setUploadProgress(0);

        const uploadFormData = new FormData();
        uploadFormData.append('video', videoFile);
        uploadFormData.append('title', formData.title);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('duration', formData.duration);
        uploadFormData.append('order', formData.order.toString());
        uploadFormData.append('isFree', formData.isFree.toString());
        uploadFormData.append('isPreview', formData.isPreview.toString());

        // Add hierarchical content structure info if provided
        if (categoryIndex !== undefined) {
            uploadFormData.append('categoryIndex', categoryIndex.toString());
            if (subcategoryIndex !== undefined) {
                uploadFormData.append('subcategoryIndex', subcategoryIndex.toString());
            }
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user?.token}`,
                },
                onUploadProgress: (progressEvent: any) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            };

            // Choose endpoint based on whether it's hierarchical content or legacy
            const endpoint = categoryIndex !== undefined
                ? `https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}/content/videos`
                : `https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}/videos`;

            const response = await axios.post(endpoint, uploadFormData, config);

            onUploadSuccess(response.data.video);

            // Reset form
            setFormData({
                title: '',
                description: '',
                duration: '',
                order: 1,
                isFree: false,
                isPreview: false
            });
            setVideoFile(null);
            setUploadProgress(0);
            onClose();

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upload Video</h2>
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
                            Video File *
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            disabled={uploading}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Max size: 100MB</p>
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

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
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
                            disabled={uploading || !videoFile}
                        >
                            {uploading ? 'Uploading...' : 'Upload Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VideoUploadModal;