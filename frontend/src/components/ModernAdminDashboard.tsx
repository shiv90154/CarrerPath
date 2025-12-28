import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
    Users, BookOpen, DollarSign, ShoppingCart, Bell, TrendingUp,
    Activity, Settings, Plus, Eye, Calendar, Award, Target,
    BarChart3, PieChart, LineChart, Zap, Shield, Database,
    Globe, Wifi, Server, AlertCircle, CheckCircle, Clock,
    Star, Sparkles, Crown, Gem, Rocket, Menu, X, Home,
    FileText, TestTube, BookOpenCheck, GraduationCap,
    CreditCard, LogOut, User, ChevronRight, Newspaper,
    ChevronDown, Search, Filter, Download, Upload
} from 'lucide-react';

interface DashboardStats {
    totalStudents: number;
    totalCourses: number;
    totalTestSeries: number;
    totalEbooks: number;
    totalRevenue: number;
    totalOrders: number;
    recentOrders: Array<{
        _id: string;
        user: { name: string; email: string };
        totalPrice: number;
        createdAt: string;
        productName: string;
    }>;
    monthlyRevenue: Array<{
        month: string;
        revenue: number;
        orders: number;
    }>;
    recentRegistrations: Array<{
        _id: string;
        name: string;
        email: string;
        createdAt: string;
    }>;
    topCourses: Array<{
        _id: string;
        title: string;
        sales: number;
        revenue: number;
    }>;
}

interface NoticeStats {
    total: number;
    published: number;
    unpublished: number;
    expired: number;
    categoryStats: Array<{
        _id: string;
        count: number;
        published: number;
    }>;
    badgeStats: Array<{
        _id: string;
        count: number;
    }>;
}

const ModernAdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [noticeStats, setNoticeStats] = useState<NoticeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['content']);

    const sidebarItems = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: Home,
            path: '/admin/dashboard'
        },
        {
            id: 'users',
            name: 'User Management',
            icon: Users,
            path: '/admin/users',
            badge: stats?.totalStudents
        },
        {
            id: 'content',
            name: 'Content Management',
            icon: BookOpen,
            children: [
                { id: 'courses', name: 'Courses', icon: BookOpen, path: '/admin/courses', badge: stats?.totalCourses },
                { id: 'testseries', name: 'Test Series', icon: TestTube, path: '/admin/testseries', badge: stats?.totalTestSeries },
                { id: 'ebooks', name: 'E-Books', icon: BookOpenCheck, path: '/admin/ebooks', badge: stats?.totalEbooks },
                { id: 'studymaterials', name: 'Study Materials', icon: FileText, path: '/admin/studymaterial' },
                { id: 'livetests', name: 'Live Tests', icon: GraduationCap, path: '/admin/livetests' }
            ]
        },
        {
            id: 'notices',
            name: 'Notices',
            icon: Bell,
            path: '/admin/notices',
            badge: noticeStats?.total
        },
        {
            id: 'current-affairs',
            name: 'Current Affairs',
            icon: Newspaper,
            path: '/admin/current-affairs'
        },
        {
            id: 'payments',
            name: 'Payments',
            icon: CreditCard,
            path: '/admin/payments',
            badge: stats?.totalOrders
        }
    ];

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchDashboardStats();
            fetchNoticeStats();
        }
    }, [user]);

    const fetchNoticeStats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };

            const { data } = await axios.get(
                'https://carrerpath-m48v.onrender.com/api/notices/admin/stats',
                config
            );

            if (data.success) {
                setNoticeStats(data.data);
            }
        } catch (err) {
            console.error('Error fetching notice stats:', err);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };

            const { data } = await axios.get<DashboardStats>(
                'https://carrerpath-m48v.onrender.com/api/admin/stats',
                config
            );

            setStats(data);
            setError(null);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to fetch dashboard statistics';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = (menuId: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">Admins only.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                            <p className="text-blue-100 text-xs">Career Pathway</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:bg-white/20 rounded-lg p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <div key={item.id}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleMenu(item.id)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} />
                                    </button>
                                    {expandedMenus.includes(item.id) && (
                                        <div className="ml-6 mt-2 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    to={child.path}
                                                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <child.icon className="w-4 h-4" />
                                                        <span>{child.name}</span>
                                                    </div>
                                                    {child.badge && (
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                                            {child.badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === item.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => setActiveSection(item.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-blue-600" />
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600">Manage your educational platform</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="relative p-2 text-gray-400 hover:text-gray-600">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                                <div>
                                    <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
                                    <p className="text-red-600 text-sm mt-1">{error}</p>
                                    <button
                                        onClick={fetchDashboardStats}
                                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100 text-sm">Total Students</p>
                                            <p className="text-3xl font-bold">{stats?.totalStudents?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <Users className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Link to="/admin/users" className="text-blue-100 hover:text-white text-sm flex items-center gap-1">
                                            View all <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <span className="bg-white/20 rounded-full px-2 py-1 text-xs">+12% this month</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-emerald-100 text-sm">Total Courses</p>
                                            <p className="text-3xl font-bold">{stats?.totalCourses || 0}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Link to="/admin/courses" className="text-emerald-100 hover:text-white text-sm flex items-center gap-1">
                                            Manage <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <span className="bg-white/20 rounded-full px-2 py-1 text-xs">Active</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100 text-sm">Total Revenue</p>
                                            <p className="text-3xl font-bold">{formatPrice(stats?.totalRevenue || 0)}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <DollarSign className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Link to="/admin/payments" className="text-purple-100 hover:text-white text-sm flex items-center gap-1">
                                            View payments <ChevronRight className="w-4 h-4" />
                                        </Link>
                                        <span className="bg-white/20 rounded-full px-2 py-1 text-xs">+8% growth</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-orange-100 text-sm">Total Orders</p>
                                            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-3">
                                            <ShoppingCart className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-orange-100 text-sm flex items-center gap-1">
                                            Active platform <CheckCircle className="w-4 h-4" />
                                        </span>
                                        <span className="bg-white/20 rounded-full px-2 py-1 text-xs">Live</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Link
                                    to="/admin/courses/new"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <Plus className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Create Course</h3>
                                            <p className="text-sm text-gray-600">Add new video course</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/testseries/new"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 rounded-lg p-3">
                                            <TestTube className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Create Test Series</h3>
                                            <p className="text-sm text-gray-600">Add practice tests</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/notices/new"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-purple-100 rounded-lg p-3">
                                            <Bell className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Create Notice</h3>
                                            <p className="text-sm text-gray-600">Add announcement</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    to="/admin/ebooks/new"
                                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-orange-100 rounded-lg p-3">
                                            <BookOpenCheck className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Create E-Book</h3>
                                            <p className="text-sm text-gray-600">Add digital book</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Recent Orders */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                        <Link to="/admin/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            View all
                                        </Link>
                                    </div>
                                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {stats.recentOrders.slice(0, 5).map((order) => (
                                                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="bg-blue-100 rounded-lg p-2">
                                                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{order.user.name}</p>
                                                            <p className="text-sm text-gray-600">{order.productName}</p>
                                                            <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No recent orders</p>
                                        </div>
                                    )}
                                </div>

                                {/* System Status */}
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">System Status</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Server className="w-6 h-6 text-green-600" />
                                                <span className="font-medium text-green-900">Server Status</span>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                                Online
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <DollarSign className="w-6 h-6 text-green-600" />
                                                <span className="font-medium text-green-900">Payment Gateway</span>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                                Active
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Database className="w-6 h-6 text-green-600" />
                                                <span className="font-medium text-green-900">Database</span>
                                            </div>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                                Connected
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default ModernAdminDashboard;