import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseVideoPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to courses page since courses no longer contain videos
        navigate('/courses', { replace: true });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Videos Not Available</h2>
                <p className="text-gray-600 mb-6">
                    Course videos are no longer available through this page.
                    Videos are now managed through a separate video system.
                </p>
                <button
                    onClick={() => navigate('/courses')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    Back to Courses
                </button>
            </div>
        </div>
    );
};

export default CourseVideoPage;