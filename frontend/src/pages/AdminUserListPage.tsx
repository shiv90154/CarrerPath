import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    lastLogin?: string;
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    totalPurchasedCourses?: number;
    totalSpent?: number;
    bio?: string;
    dateOfBirth?: string;
    gender?: string;
    avatar?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    };
    education?: {
        qualification?: string;
        institution?: string;
        year?: string;
    };
    preferences?: {
        examTypes?: string[];
        subjects?: string[];
        language?: string;
    };
}

interface UsersResponse {
    users: User[];
    totalPages: number;
    currentPage: number;
    total: number;
    stats: {
        totalStudents: number;
        totalAdmins: number;
        totalInstructors: number;
        activeUsers: number;
        newUsersThisMonth: number;
    };
}

interface UserDetailModalProps {
    user: User;
    onClose: () => void;
    onUpdate: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose, onUpdate }) => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'activity', label: 'Activity', icon: '📊' },
        { id: 'purchases', label: 'Purchases', icon: '💳' },
        { id: 'actions', label: 'Actions', icon: '⚙️' }
    ];

    const handleStatusToggle = async () => {
        if (!currentUser?.token) return;

        setLoading(true);
        try {
            await axios.put(
                `https://carrerpath-m48v.onrender.com/api/admin/users/${user._id}/status`,
                { isActive: !user.isActive },
                { headers: { Authorization: `Bearer ${currentUser.token}` } }
            );
            onUpdate();
        } catch (error) {
            console.error('Error updating user status:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-blue-100">{user.email}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-500 text-white' :
                                            user.role === 'instructor' ? 'bg-yellow-500 text-white' :
                                                'bg-green-500 text-white'
                                        }`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-gray-300 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Full Name</label>
                                            <p className="text-gray-900">{user.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-gray-900 flex items-center">
                                                {user.email}
                                                {user.emailVerified && (
                                                    <span className="ml-2 text-green-600 text-sm">✓</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone</label>
                                            <p className="text-gray-900 flex items-center">
                                                {user.phone || 'Not provided'}
                                                {user.phoneVerified && (
                                                    <span className="ml-2 text-green-600 text-sm">✓</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                            <p className="text-gray-900">{user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Gender</label>
                                            <p className="text-gray-900">{user.gender || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Role</label>
                                            <p className="text-gray-900 capitalize">{user.role}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Status</label>
                                            <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Member Since</label>
                                            <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Login</label>
                                            <p className="text-gray-900">{formatDate(user.lastLogin)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {user.bio && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                    <p className="text-gray-700">{user.bio}</p>
                                </div>
                            )}

                            {user.address && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                                    <div className="text-gray-700">
                                        {user.address.street && <p>{user.address.street}</p>}
                                        <p>
                                            {[user.address.city, user.address.state, user.address.pincode]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>
                                        {user.address.country && <p>{user.address.country}</p>}
                                    </div>
                                </div>
                            )}

                            {user.education && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Education</h3>
                                    <div className="text-gray-700">
                                        {user.education.qualification && <p><strong>Qualification:</strong> {user.education.qualification}</p>}
                                        {user.education.institution && <p><strong>Institution:</strong> {user.education.institution}</p>}
                                        {user.education.year && <p><strong>Year:</strong> {user.education.year}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Recent Activity</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">Activity tracking will be implemented in future updates.</p>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Last Login:</span>
                                        <span className="text-sm font-medium">{formatDate(user.lastLogin)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Account Created:</span>
                                        <span className="text-sm font-medium">{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'purchases' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Purchase History</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600">Purchase history will be implemented in future updates.</p>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">{user.totalPurchasedCourses || 0}</div>
                                        <div className="text-sm text-gray-500">Courses Purchased</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">₹{user.totalSpent || 0}</div>
                                        <div className="text-sm text-gray-500">Total Spent</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'actions' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">User Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleStatusToggle}
                                    disabled={loading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium ${user.isActive
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        } disabled:opacity-50`}
                                >
                                    {loading ? 'Updating...' : (user.isActive ? 'Deactivate User' : 'Activate User')}
                                </button>

                                <button className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                                    Send Email
                                </button>

                                <button className="w-full px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">
                                    Reset Password
                                </button>

                                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                                    View Login History
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminUserListPage: React.FC = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalAdmins: 0,
        totalInstructors: 0,
        activeUsers: 0,
        newUsersThisMonth: 0
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        if (!user?.token) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                search: searchTerm,
                role: roleFilter,
                status: statusFilter
            });

            const { data } = await axios.get<UsersResponse>(
                `https://carrerpath-m48v.onrender.com/api/admin/users?${params}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setUsers(data.users);
            setTotalPages(data.totalPages);
            setStats(data.stats);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUserUpdate = () => {
        fetchUsers();
        setSelectedUser(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600 mt-1">Manage and monitor all users</p>
                        </div>
                        <Link
                            to="/admin/dashboard"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
                        <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-red-600">{stats.totalAdmins}</div>
                        <div className="text-sm text-gray-600">Admins</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-yellow-600">{stats.totalInstructors}</div>
                        <div className="text-sm text-gray-600">Instructors</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                        <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{stats.newUsersThisMonth}</div>
                        <div className="text-sm text-gray-600">New This Month</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="student">Students</option>
                                <option value="instructor">Instructors</option>
                                <option value="admin">Admins</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('all');
                                    setStatusFilter('all');
                                    setCurrentPage(1);
                                }}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading users...</p>
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
                            <p className="text-gray-600">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-6xl mb-4">👥</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                            <p className="text-gray-600">No users match your current filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Login
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((userData) => (
                                            <tr key={userData._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {userData.avatar ? (
                                                                <img
                                                                    src={userData.avatar}
                                                                    alt={userData.name}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                userData.name.charAt(0).toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {userData.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center">
                                                                {userData.email}
                                                                {userData.emailVerified && (
                                                                    <span className="ml-1 text-green-600">✓</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${userData.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                            userData.role === 'instructor' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                        }`}>
                                                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {userData.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(userData.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {userData.lastLogin ? formatDate(userData.lastLogin) : 'Never'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedUser(userData)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        View Details
                                                    </button>
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

            {/* User Detail Modal */}
            {selectedUser && (
                <UserDetailModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUserUpdate}
                />
            )}
        </div>
    );
};

export default AdminUserListPage;