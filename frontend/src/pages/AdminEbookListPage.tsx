import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Ebook {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  coverImage: string;
  category: string;
  language: string;
  pages: number;
  fileSize: string;
  format: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  totalRatings: number;
  totalDownloads: number;
  isFree: boolean;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminEbookListPage: React.FC = () => {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  const categories = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Teaching', 'General Knowledge', 'Other'];
  const formats = ['PDF', 'EPUB', 'MOBI'];

  useEffect(() => {
    fetchEbooks();
  }, []);

  useEffect(() => {
    filterEbooks();
  }, [ebooks, searchTerm, selectedCategory, selectedStatus, selectedFormat]);

  const fetchEbooks = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      const { data } = await axios.get<Ebook[]>('https://carrerpath-m48v.onrender.com/api/ebooks/admin', config);
      setEbooks(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch ebooks');
    } finally {
      setLoading(false);
    }
  };

  const filterEbooks = () => {
    let filtered = [...ebooks];

    if (searchTerm) {
      filtered = filtered.filter(ebook =>
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }

    if (selectedFormat) {
      filtered = filtered.filter(ebook => ebook.format === selectedFormat);
    }

    if (selectedStatus === 'active') {
      filtered = filtered.filter(ebook => ebook.isActive);
    } else if (selectedStatus === 'inactive') {
      filtered = filtered.filter(ebook => !ebook.isActive);
    } else if (selectedStatus === 'featured') {
      filtered = filtered.filter(ebook => ebook.isFeatured);
    } else if (selectedStatus === 'free') {
      filtered = filtered.filter(ebook => ebook.isFree);
    } else if (selectedStatus === 'paid') {
      filtered = filtered.filter(ebook => !ebook.isFree);
    }

    setFilteredEbooks(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      await axios.delete(`https://carrerpath-m48v.onrender.com/api/ebooks/admin/${id}`, config);
      setEbooks(ebooks.filter(ebook => ebook._id !== id));
      alert('Ebook deleted successfully');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete ebook');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      await axios.put(`https://carrerpath-m48v.onrender.com/api/ebooks/admin/${id}`,
        { isActive: !currentStatus }, config);

      setEbooks(ebooks.map(ebook =>
        ebook._id === id ? { ...ebook, isActive: !currentStatus } : ebook
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
      await axios.put(`https://carrerpath-m48v.onrender.com/api/ebooks/admin/${id}`,
        { isFeatured: !currentFeatured }, config);

      setEbooks(ebooks.map(ebook =>
        ebook._id === id ? { ...ebook, isFeatured: !currentFeatured } : ebook
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ebooks...</p>
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
              onClick={fetchEbooks}
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
                E-Books Management 📚
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your digital library and publications
              </p>
            </div>
            <Link
              to="/admin/ebooks/new"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
            >
              + Create New E-Book
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ebooks..."
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
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Formats</option>
                {formats.map(format => (
                  <option key={format} value={format}>{format}</option>
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
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSelectedFormat('');
                }}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📚</div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {ebooks.length}
                </div>
                <div className="text-sm text-gray-600">Total E-Books</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {ebooks.filter(e => e.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🆓</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {ebooks.filter(e => e.isFree).length}
                </div>
                <div className="text-sm text-gray-600">Free</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⭐</div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {ebooks.filter(e => e.isFeatured).length}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📥</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {ebooks.reduce((sum, e) => sum + e.totalDownloads, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ebooks List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              E-Books ({filteredEbooks.length})
            </h2>
          </div>

          {filteredEbooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No ebooks found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory || selectedStatus || selectedFormat
                  ? 'Try adjusting your filters'
                  : 'Create your first ebook to get started'
                }
              </p>
              <Link
                to="/admin/ebooks/new"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Create E-Book
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
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
                  {filteredEbooks.map((ebook) => (
                    <tr key={ebook._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={ebook.coverImage}
                            alt={ebook.title}
                            className="w-12 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ebook.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {ebook.author.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              Created {formatDate(ebook.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {ebook.category}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {ebook.format} • {ebook.language}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ebook.isFree ? (
                          <span className="text-sm font-medium text-green-600">FREE</span>
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatPrice(ebook.price)}
                            </div>
                            {ebook.originalPrice > ebook.price && (
                              <div className="text-xs text-gray-500 line-through">
                                {formatPrice(ebook.originalPrice)}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{ebook.pages} pages</div>
                        <div className="text-xs text-gray-500">{ebook.fileSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ebook.totalDownloads}</div>
                        {ebook.rating > 0 && (
                          <div className="text-xs text-gray-500">
                            ⭐ {ebook.rating.toFixed(1)} ({ebook.totalRatings})
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ebook.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {ebook.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {ebook.isFeatured && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                          {ebook.isFree && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Free
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/ebooks/${ebook._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleStatus(ebook._id, ebook.isActive)}
                            className={`${ebook.isActive
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-green-600 hover:text-green-900'
                              }`}
                          >
                            {ebook.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => toggleFeatured(ebook._id, ebook.isFeatured)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            {ebook.isFeatured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDelete(ebook._id, ebook.title)}
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

export default AdminEbookListPage;