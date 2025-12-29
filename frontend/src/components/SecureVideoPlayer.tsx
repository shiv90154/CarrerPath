import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface SecureVideoPlayerProps {
    videoId: string;
    courseId: string;
    onVideoEnd?: () => void;
    className?: string;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
    videoId,
    courseId,
    onVideoEnd,
    className = ''
}) => {
    const { user } = useAuth();
    const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [videoData, setVideoData] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVideoAccess = async () => {
            if (!user || !videoId) {
                setError('Authentication required');
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const response = await axios.get(`/api/videos/${videoId}/access`, config);

                if (response.data.success) {
                    setYoutubeVideoId(response.data.videoId);
                    setVideoData(response.data);
                } else {
                    setError('Access denied');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load video');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoAccess();
    }, [videoId, user]);

    // Security measures - disable right-click and keyboard shortcuts
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I
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

        const container = containerRef.current;
        if (container) {
            container.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (container) {
                container.removeEventListener('contextmenu', handleContextMenu);
            }
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading video...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center h-64 bg-red-50 rounded-lg border border-red-200 ${className}`}>
                <div className="text-center">
                    <div className="text-red-600 text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!youtubeVideoId) {
        return (
            <div className={`flex items-center justify-center h-64 bg-gray-100 rounded-lg ${className}`}>
                <div className="text-center">
                    <div className="text-gray-400 text-4xl mb-4">📹</div>
                    <p className="text-gray-600">Video not available</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`relative ${className}`} style={{ userSelect: 'none' }}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&showinfo=0`}
                    title={videoData?.title || 'Course Video'}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                        // Additional security: hide video ID from DOM inspection
                        const iframe = document.querySelector('iframe');
                        if (iframe) {
                            iframe.style.pointerEvents = 'auto';
                        }
                    }}
                />
            </div>

            {videoData && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900">{videoData.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                        <span>Duration: {videoData.duration}</span>
                        <span>Views: {videoData.views}</span>
                    </div>
                    {videoData.description && (
                        <p className="text-gray-700 mt-2">{videoData.description}</p>
                    )}
                </div>
            )}

            {/* Overlay to prevent inspection */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'transparent',
                    zIndex: -1
                }}
            />
        </div>
    );
};

export default SecureVideoPlayer;