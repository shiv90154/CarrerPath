import React from 'react';

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
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">YouTube Video Upload Not Available</h2>
                <p className="text-gray-600 mb-6">
                    YouTube video uploads for courses are no longer supported.
                    Videos are now managed through a separate video management system.
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default YouTubeVideoModal;