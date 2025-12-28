import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface TestSeries {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  totalTests: number;
  totalLiveTests: number;
  enrolledStudents: number;
  rating: number;
  totalRatings: number;
  isActive: boolean;
  isFeatured: boolean;
  hasLiveTests: boolean;
  content?: Array<{
    categoryName: string;
    categoryDescription: string;
    subcategories: Array<{
      subcategoryName: string;
      tests: any[];
      liveTests: any[];
    }>;
    tests: any[];
    liveTests: any[];
  }>;
  createdAt: string;
  updatedAt: string;
}

const AdminTestSeriesListPage: React.FC = () => {
  const { user } = useAuth();
  const [testSeries, setTestSeries] = useState<TestSeries[]>([]);
  const [filteredTestSeries, setFilteredTestSeries] = useState<TestSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const categories = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Teaching', 'Other'];

  useEffect(() => {
    fetchTestSeries();
  }, []);

  useEffect(() => {
    filterTestSeries();
  }, [testSeries, searchTerm, selectedCategory, selectedStatus]);

  const fetchTestSeries = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      const { data } = await axios.get<TestSeries[]>('https://carrerpath-m48v.onrender.com/api/testseries/admin', config);
      setTestSeries(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch test series');
    } finally {
      setLoading(false);
    }
  };

  const filterTestSeries = () => {
    let filtered = [...testSeries];

    if (searchTerm) {
      filtered = filtered.filter(series =>
        series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        series.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(series => series.category === selectedCategory);
    }

    if (selectedStatus === 'active') {
      filtered = filtered.filter(series => series.isActive);
    } else if (selectedStatus === 'inactive') {
      filtered = filtered.filter(series => !series.isActive);
    } else if (selectedStatus === 'featured') {
      filtered = filtered.filter(series => series.isFeatured);
    }

    setFilteredTestSeries(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      await axios.delete(`https://carrerpath-m48v.onrender.com/api/testseries/admin/${id}`, config);
      setTestSeries(testSeries.filter(series => series._id !== id));
      alert('Test series deleted successfully');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete test series');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      await axios.put(`https://carrerpath-m48v.onrender.com/api/testseries/admin/${id}`,
        { isActive: !currentStatus }, config);

      setTestSeries(testSeries.map(series =>
        series._id === id ? { ...series, isActive: !currentStatus } : series
      ));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      await axios.put(`https://carrerpath-m48v.onrender.com/api/testseries/admin/${id}`,
        { isFeatured: !currentFeatured }, config);

      setTestSeries(testSeries.map(series =>
        series._id === id ? { ...series, isFeatured: !currentFeatured } : series
      ));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update featured status');
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

  const getContentSummary = (series: TestSeries) => {
    if (!series.content || series.content.length === 0) {
      return {
        categories: 0,
        subcategories: 0,
        hierarchicalTests: 0,
        hierarchicalLiveTests: 0,
        hasHierarchicalContent: false
      };
    }

    let subcategories = 0;
    let hierarchicalTests = 0;
    let hierarchicalLiveTests = 0;

    series.content.forEach(category => {
      subcategories += category.subcategories.length;
      hierarchicalTests += category.tests.length;
      hierarchicalLiveTests += category.liveTests.length;

      category.subcategories.forEach(subcategory => {
        hierarchicalTests += subcategory.tests.length;
        hierarchicalLiveTests += subcategory.liveTests.length;
      });
    });

    return {
      categories: series.content.length,
      subcategories,
      hierarchicalTests,
      hierarchicalLiveTests,
      hasHierarchicalContent: true
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test series...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchTestSeries}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
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
              <h1 className="text-3xl font-bold text-gray-900">
                Test Series Management 📝
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your test series and practice tests
              </p>
            </div>
            <Link
              to="/admin/testseries/new"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              + Create New Test Series
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search test series..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📝</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {testSeries.length}
                </div>
                <div className="text-sm text-gray-600">Total Test Series</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {testSeries.filter(s => s.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⭐</div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {testSeries.filter(s => s.isFeatured).length}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">👥</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {testSeries.reduce((sum, s) => sum + s.enrolledStudents, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Series List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Series ({filteredTestSeries.length})
            </h2>
          </div>

          {filteredTestSeries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No test series found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory || selectedStatus
                  ? 'Try adjusting your filters'
                  : 'Create your first test series to get started'
                }
              </p>
              <Link
                to="/admin/testseries/new"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Create Test Series
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Series
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content Structure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTestSeries.map((series) => (
                    <tr key={series._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={series.image}
                            alt={series.title}
                            className="w-12 h-12 object-cover rounded-lg mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {series.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {series.instructor.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              Created {formatDate(series.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {series.category}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {series.level} • {series.language}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(series.price)}
                        </div>
                        {series.originalPrice > series.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(series.originalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const contentSummary = getContentSummary(series);
                          if (contentSummary.hasHierarchicalContent) {
                            return (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  📁 {contentSummary.categories} Categories
                                </div>
                                <div className="text-xs text-gray-500">
                                  👉 {contentSummary.subcategories} Subcategories
                                </div>
                                <div className="text-xs text-gray-500">
                                  📝 {contentSummary.hierarchicalTests} Tests
                                  {contentSummary.hierarchicalLiveTests > 0 && (
                                    <span className="ml-2">🔴 {contentSummary.hierarchicalLiveTests} Live</span>
                                  )}
                                </div>
                                {series.hasLiveTests && (
                                  <div className="text-xs text-green-600 font-medium">
                                    ✅ Live Tests Enabled
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  📝 {series.totalTests} Tests (Legacy)
                                </div>
                                {series.totalLiveTests > 0 && (
                                  <div className="text-xs text-gray-500">
                                    🔴 {series.totalLiveTests} Live Tests
                                  </div>
                                )}
                                <div className="text-xs text-orange-600">
                                  ⚠️ No hierarchical structure
                                </div>
                              </div>
                            );
                          }
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {series.enrolledStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${series.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {series.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {series.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/testseries/${series._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleStatus(series._id, series.isActive)}
                            className={`${series.isActive
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                              }`}
                          >
                            {series.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => toggleFeatured(series._id, series.isFeatured)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            {series.isFeatured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDelete(series._id, series.title)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTestSeriesListPage;