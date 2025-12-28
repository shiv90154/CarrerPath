import React, { useState } from 'react';
import {
    Mail,
    Send,
    Megaphone,
    BookOpen,
    FileText,
    Settings,
    Users,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import axios from 'axios';

interface TabPanelProps {
    children?: React.ReactNode;
    isActive: boolean;
}

function TabPanel({ children, isActive }: TabPanelProps) {
    if (!isActive) return null;
    return <div className="mt-6">{children}</div>;
}

const AdminEmailManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('announcements');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Announcement form state
    const [announcement, setAnnouncement] = useState({
        subject: '',
        message: ''
    });

    // Course notification form state
    const [courseNotification, setCourseNotification] = useState({
        title: '',
        description: '',
        instructor: ''
    });

    // Test series notification form state
    const [testSeriesNotification, setTestSeriesNotification] = useState({
        title: '',
        testCount: 10,
        duration: 60
    });

    // Welcome email form state
    const [welcomeEmail, setWelcomeEmail] = useState({
        userEmail: '',
        userName: ''
    });

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    const sendAnnouncement = async () => {
        if (!announcement.subject || !announcement.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/email/announcement', {
                subject: announcement.subject,
                message: announcement.message,
                targetUsers: 'all'
            }, getAuthHeaders());

            showNotification(`Announcement sent to ${response.data.notifiedUsers} users!`);
            setAnnouncement({ subject: '', message: '' });
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to send announcement', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendCourseNotification = async () => {
        if (!courseNotification.title || !courseNotification.description || !courseNotification.instructor) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/email/new-course', courseNotification, getAuthHeaders());
            showNotification(`Course notification sent to ${response.data.notifiedUsers} users!`);
            setCourseNotification({ title: '', description: '', instructor: '' });
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to send course notification', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendTestSeriesNotification = async () => {
        if (!testSeriesNotification.title) {
            showNotification('Please enter test series title', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/email/new-test-series', testSeriesNotification, getAuthHeaders());
            showNotification(`Test series notification sent to ${response.data.notifiedUsers} users!`);
            setTestSeriesNotification({ title: '', testCount: 10, duration: 60 });
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to send test series notification', 'error');
        } finally {
            setLoading(false);
        }
    };

    const sendWelcomeEmail = async () => {
        if (!welcomeEmail.userEmail || !welcomeEmail.userName) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/api/email/welcome', welcomeEmail, getAuthHeaders());
            showNotification('Welcome email sent successfully!');
            setWelcomeEmail({ userEmail: '', userName: '' });
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to send welcome email', 'error');
        } finally {
            setLoading(false);
        }
    };

    const testEmailConfiguration = async () => {
        setLoading(true);
        try {
            await axios.post('/api/email/test', {}, getAuthHeaders());
            showNotification('Test email sent successfully!');
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to send test email', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getEmailStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/email/stats', getAuthHeaders());
            showNotification(`Total Active Users: ${response.data.stats.totalActiveUsers}`);
        } catch (error: any) {
            showNotification(error.response?.data?.message || 'Failed to get email stats', 'error');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
        { id: 'courses', label: 'Course Notifications', icon: BookOpen },
        { id: 'tests', label: 'Test Series', icon: FileText },
        { id: 'welcome', label: 'Welcome Emails', icon: Mail },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center space-x-3">
                        <Mail className="h-8 w-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Email Management System</h1>
                    </div>
                    <p className="text-blue-100 mt-2">Manage and send beautiful emails to your users</p>
                </div>

                {/* Notification */}
                {notification && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${notification.type === 'success'
                            ? 'bg-green-100 border border-green-400 text-green-700'
                            : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5" />
                        ) : (
                            <AlertCircle className="h-5 w-5" />
                        )}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Announcements Tab */}
                        <TabPanel isActive={activeTab === 'announcements'}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Megaphone className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Send Bulk Announcement</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={announcement.subject}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnnouncement({ ...announcement, subject: e.target.value })}
                                            placeholder="🎉 Exciting News from Career Pathway Institute!"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Message (HTML supported)</label>
                                        <textarea
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            value={announcement.message}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnnouncement({ ...announcement, message: e.target.value })}
                                            placeholder="<h2>Great news!</h2><p>We're excited to announce...</p>"
                                        />
                                    </div>

                                    <div>
                                        <button
                                            onClick={sendAnnouncement}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                            Send to All Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        {/* Course Notifications Tab */}
                        <TabPanel isActive={activeTab === 'courses'}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">New Course Notification</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            value={courseNotification.title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseNotification({ ...courseNotification, title: e.target.value })}
                                            placeholder="Advanced JavaScript Mastery"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            value={courseNotification.instructor}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseNotification({ ...courseNotification, instructor: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            value={courseNotification.description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCourseNotification({ ...courseNotification, description: e.target.value })}
                                            placeholder="Master advanced JavaScript concepts and modern ES6+ features..."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            onClick={sendCourseNotification}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                                            Notify All Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        {/* Test Series Tab */}
                        <TabPanel isActive={activeTab === 'tests'}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-6 w-6 text-orange-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">New Test Series Notification</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Test Series Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                            value={testSeriesNotification.title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestSeriesNotification({ ...testSeriesNotification, title: e.target.value })}
                                            placeholder="UPSC Prelims Mock Tests 2024"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tests</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                            value={testSeriesNotification.testCount}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestSeriesNotification({ ...testSeriesNotification, testCount: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                                            value={testSeriesNotification.duration}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestSeriesNotification({ ...testSeriesNotification, duration: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="md:col-span-3">
                                        <button
                                            onClick={sendTestSeriesNotification}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                                            Notify All Users
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        {/* Welcome Emails Tab */}
                        <TabPanel isActive={activeTab === 'welcome'}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-6 w-6 text-purple-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Send Welcome Email</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            value={welcomeEmail.userEmail}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWelcomeEmail({ ...welcomeEmail, userEmail: e.target.value })}
                                            placeholder="user@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            value={welcomeEmail.userName}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWelcomeEmail({ ...welcomeEmail, userName: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <button
                                            onClick={sendWelcomeEmail}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                                            Send Welcome Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>

                        {/* Settings Tab */}
                        <TabPanel isActive={activeTab === 'settings'}>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Settings className="h-6 w-6 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Email System Settings</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">🧪 Test Email Configuration</h3>
                                        <p className="text-gray-600 mb-4">Send a test email to verify your email configuration is working properly.</p>
                                        <button
                                            onClick={testEmailConfiguration}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
                                            Send Test Email
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Email Statistics</h3>
                                        <p className="text-gray-600 mb-4">Get information about your user base for email campaigns.</p>
                                        <button
                                            onClick={getEmailStats}
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Users className="h-4 w-4 mr-2" />}
                                            Get Email Stats
                                        </button>
                                    </div>

                                    <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">📧 Available Email Templates</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'Welcome Email',
                                                'Course Notifications',
                                                'Test Series Alerts',
                                                'Payment Confirmations',
                                                'Test Completion',
                                                'Course Certificates',
                                                'Password Reset',
                                                'Admin Notifications',
                                                'Bulk Announcements'
                                            ].map((template) => (
                                                <span
                                                    key={template}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {template}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailManagementPage;