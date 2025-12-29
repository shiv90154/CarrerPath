import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import SecureVideoPlayer from '../components/SecureVideoPlayer';

interface Video {
    _id: string;
    title: string;
    description: string;
    duration: string;
    order: number;
    views: number;
}

interface Course {
    _id: string;
    title: string;
    description: string;
    instructor: {
        name: string;
    };
}

const CourseVideoPage: React.FC = () => {
    const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState<Course | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCourseData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                // Fetch course details
                const courseResponse = await axios.get(`/api/courses/${courseId}`, config);
                setCourse(courseResponse.data);

                // Fetch course videos list
                const videosResponse = await axios.get(`/api/videos/course/${courseId}`, config);
                if (videosResponse.data.success) {
                    setVideos(videosResponse.data.videos);

                    // Find current video
                    const current = videosResponse.data.videos.find((v: Video) => v._id === videoId);
                    setCurrentVideo(current || null);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load course data');
            } finally {
                setLoading(false);
            }
        };

        if (courseId && videoId) {
            fetchCourseData();
        }
    }, [courseId, videoId, user, navigate]);

    // Security measures
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 's') ||
                (e.ctrlKey && e.shiftKey && e.key === 'I')
            ) {
                e.preventDefault();
                return false;
            }
            return true;
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleVideoSelect = (video: Video) => {
        navigate(`/courses/${courseId}/videos/${video._id}`);
    };

    const handleNextVideo = () => {
        if (!currentVideo) return;

        const currentIndex = videos.findIndex(v => v._id === currentVideo._id);
        if (currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            navigate(`/courses/${courseId}/videos/${nextVideo._id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-red-800 mb-4">Access Denied</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/courses')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ userSelect: 'none' }}>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Video Player Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            {course && (
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                                    <p className="text-gray-600">Instructor: {course.instructor.name}</p>
                                </div>
                            )}

                            {videoId && courseId && (
                                <SecureVideoPlayer
                                    videoId={videoId}
                                    courseId={courseId}
                                    onVideoEnd={handleNextVideo}
                                    className="mb-6"
                                />
                            )}
                        </div>
                    </div>

                    {/* Video List Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Videos</h3>
                            <div className="space-y-3">
                                {videos.map((video, index) => (
                                    <div
                                        key={video._id}
                                        onClick={() => handleVideoSelect(video)}
                                        className={`p-3 rounded-lg cursor-pointer transition-colors ${currentVideo?._id === video._id
                                            ? 'bg-blue-100 border-2 border-blue-500'
                                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                    {index + 1}. {video.title}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                                            </div>
                                            {currentVideo?._id === video._id && (
                                                <div className="ml-2">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseVideoPage;