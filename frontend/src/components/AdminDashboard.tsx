import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Users, BookOpen, DollarSign, ShoppingCart, Bell, TrendingUp,
  Activity, Settings, Plus, Eye, Calendar, Award, Target,
  BarChart3, PieChart, LineChart, Zap, Shield, Database,
  Globe, Wifi, Server, AlertCircle, CheckCircle, Clock,
  Star, Sparkles, Crown, Gem, Rocket
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [noticeStats, setNoticeStats] = useState<NoticeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      console.log('Fetching admin stats with user:', user);

      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };

      console.log('Making request to:', 'https://carrerpath-m48v.onrender.com/api/admin/stats');
      console.log('With config:', config);

      const { data } = await axios.get<DashboardStats>(
        'https://carrerpath-m48v.onrender.com/api/admin/stats',
        config
      );

      console.log('Received data:', data);
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch dashboard statistics';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-2">
                  Premium Admin Dashboard
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h1>
                <p className="text-blue-100 mt-1 text-lg">
                  Complete control over your educational platform
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm">Welcome back</div>
              <div className="font-semibold text-white text-xl flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300" />
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Students Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats?.totalStudents.toLocaleString() || 0}
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Students</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Users className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to="/admin/users"
                className="text-blue-100 hover:text-white text-sm font-medium flex items-center gap-1"
              >
                View all <Rocket className="w-4 h-4" />
              </Link>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                +12% this month
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats?.totalCourses || 0}
                </div>
                <div className="text-emerald-100 text-sm font-medium">Total Courses</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to="/admin/courses"
                className="text-emerald-100 hover:text-white text-sm font-medium flex items-center gap-1"
              >
                Manage <BookOpen className="w-4 h-4" />
              </Link>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                Active
              </div>
            </div>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {formatPrice(stats?.totalRevenue || 0)}
                </div>
                <div className="text-purple-100 text-sm font-medium">Total Revenue</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to="/admin/payments"
                className="text-purple-100 hover:text-white text-sm font-medium flex items-center gap-1"
              >
                View payments <Gem className="w-4 h-4" />
              </Link>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                +8% growth
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {stats?.totalOrders || 0}
                </div>
                <div className="text-orange-100 text-sm font-medium">Total Orders</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <ShoppingCart className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-orange-100 text-sm font-medium flex items-center gap-1">
                Active platform <CheckCircle className="w-4 h-4" />
              </span>
              <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
                Live
              </div>
            </div>
          </div>
        </div>

        {/* Notice Management Section */}
        {noticeStats && (
          <div className="bg-white rounded-2xl p-8 shadow-xl mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-3">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Notice Management</h3>
                  <p className="text-gray-600">Manage announcements and notifications</p>
                </div>
              </div>
              <Link
                to="/admin/notices"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Manage Notices
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{noticeStats.total}</div>
                    <div className="text-blue-700 text-sm font-medium">Total Notices</div>
                  </div>
                  <Bell className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-900">{noticeStats.published}</div>
                    <div className="text-green-700 text-sm font-medium">Published</div>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-900">{noticeStats.unpublished}</div>
                    <div className="text-yellow-700 text-sm font-medium">Draft</div>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-900">{noticeStats.expired}</div>
                    <div className="text-red-700 text-sm font-medium">Expired</div>
                  </div>
                  <Calendar className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Quick Notice Actions */}
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/admin/notices/new"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Notice
              </Link>
              <Link
                to="/admin/notices"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View All
              </Link>
            </div>
          </div>
        )}

        {/* Premium Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Content Management */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Content Management</h3>
            </div>
            <div className="space-y-4">
              <Link
                to="/admin/courses"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Courses</div>
                    <div className="text-sm text-gray-600">Manage video courses</div>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.totalCourses || 0}
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/testseries"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-gray-100 hover:border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Test Series</div>
                    <div className="text-sm text-gray-600">Manage practice tests</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.totalTestSeries || 0}
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/ebooks"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">E-Books</div>
                    <div className="text-sm text-gray-600">Manage digital books</div>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.totalEbooks || 0}
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/studymaterial"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 border border-gray-100 hover:border-orange-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Study Materials</div>
                    <div className="text-sm text-gray-600">Manage study resources</div>
                  </div>
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">User Management</h3>
            </div>
            <div className="space-y-4">
              <Link
                to="/admin/users"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 border border-gray-100 hover:border-emerald-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">All Users</div>
                    <div className="text-sm text-gray-600">View and manage users</div>
                  </div>
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.totalStudents || 0}
                  </div>
                </div>
              </Link>
              <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Recent Registrations</div>
                    <div className="text-sm text-gray-600">New users this week</div>
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.recentRegistrations?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Management */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Assessment</h3>
            </div>
            <div className="space-y-4">
              <Link
                to="/admin/livetests"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Live Tests</div>
                    <div className="text-sm text-gray-600">Schedule live exams</div>
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    Live
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/current-affairs"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Current Affairs</div>
                    <div className="text-sm text-gray-600">Manage daily updates</div>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    Daily
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Financial & Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Financial Management */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Financial Management</h3>
            </div>
            <div className="space-y-4">
              <Link
                to="/admin/payments"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-gray-100 hover:border-green-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Payments</div>
                    <div className="text-sm text-gray-600">View all transactions</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.totalOrders || 0}
                  </div>
                </div>
              </Link>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Monthly Revenue</div>
                    <div className="text-sm text-gray-600">Current month earnings</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {stats?.monthlyRevenue?.length ?
                      formatPrice(stats.monthlyRevenue[stats.monthlyRevenue.length - 1]?.revenue || 0) :
                      'No data'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="space-y-4">
              <Link
                to="/admin/courses/new"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border-2 border-blue-200 hover:border-blue-300"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">Create New Course</div>
                    <div className="text-sm text-blue-600">Add a new video course</div>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/testseries/new"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border-2 border-green-200 hover:border-green-300"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-lg p-2">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">Create Test Series</div>
                    <div className="text-sm text-green-600">Add new practice tests</div>
                  </div>
                </div>
              </Link>
              <Link
                to="/admin/notices/new"
                className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border-2 border-purple-200 hover:border-purple-300"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-lg p-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900">Create Notice</div>
                    <div className="text-sm text-purple-600">Add new announcement</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">System Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-3">
                <Server className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-900">Server Status</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-medium text-green-900">Payment Gateway</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-center gap-3">
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

        {/* Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-3">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            </div>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100 hover:border-blue-200 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.productName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {formatPrice(order.totalPrice)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No recent orders</p>
                <p className="text-sm">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Top Selling Courses</h3>
            </div>
            {stats?.topCourses && stats.topCourses.length > 0 ? (
              <div className="space-y-4">
                {stats.topCourses.map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100 hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 rounded-lg p-2">
                        <div className="text-lg">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📚'}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {course.sales} sales
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">
                        {formatPrice(course.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No course sales data</p>
                <p className="text-sm">Course performance will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;