import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Download, DollarSign, Calendar, Filter, BarChart } from 'lucide-react';

interface StudyMaterial {
  _id: string;
  title: string;
  year: string;
  examType: string;
  subject: string;
  type: 'Free' | 'Paid';
  price: number;
  downloads: number;
  isActive: boolean;
  author: { name: string; email: string };
  createdAt: string;
}

const AdminStudyMaterialListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    examType: '',
    type: '',
    isActive: '',
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchMaterials();
    fetchStats();
  }, [user, navigate, filters]);

  const fetchMaterials = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        params: filters,
      };

      const { data } = await axios.get('http://localhost:5000/api/studymaterials/admin', config);
      setMaterials(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch study materials');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get('http://localhost:5000/api/studymaterials/admin/stats', config);
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const deleteMaterialHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };

        await axios.delete(`http://localhost:5000/api/studymaterials/admin/${id}`, config);
        setMaterials(materials.filter((material) => material._id !== id));
        fetchStats(); // Refresh stats
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete material');
      }
    }
  };

  const toggleActiveHandler = async (id: string, currentStatus: boolean) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        `http://localhost:5000/api/studymaterials/admin/${id}`,
        { isActive: !currentStatus },
        config
      );

      // Update local state
      setMaterials(
        materials.map((material) =>
          material._id === id
            ? { ...material, isActive: !currentStatus }
            : material
        )
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={fetchMaterials}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials Management</h1>
        <p className="text-gray-600">Manage previous year papers and study materials</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{stats.stats.totalMaterials}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Free Materials</p>
                <p className="text-2xl font-bold text-green-600">{stats.stats.freeMaterials}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paid Materials</p>
                <p className="text-2xl font-bold text-amber-600">{stats.stats.paidMaterials}</p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-purple-600">{stats.stats.totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={filters.examType}
              onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
            >
              <option value="">All Exams</option>
              <option value="UPSC">UPSC</option>
              <option value="SSC">SSC</option>
              <option value="Banking">Banking</option>
              <option value="State Exams">State Exams</option>
            </select>

            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilters({ examType: '', type: '', isActive: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear Filters
            </button>
            <Link
              to="/admin/studymaterials/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Add New Material
            </Link>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam & Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Price
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
              {materials.map((material) => (
                <tr key={material._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{material.title}</p>
                      <p className="text-xs text-gray-500">{material.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-900">{material.examType}</span>
                        <span className="text-xs text-gray-500 ml-2">({material.year})</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        material.type === 'Free'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {material.type}
                    </span>
                    {material.type === 'Paid' && (
                      <p className="text-sm text-gray-900 mt-1">₹{material.price}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{material.downloads}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActiveHandler(material._id, material.isActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        material.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          material.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-sm text-gray-500">
                      {material.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <Link
                      to={`/admin/studymaterials/${material._id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteMaterialHandler(material._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {materials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No study materials found</h3>
            <p className="text-gray-500 mt-1">Get started by adding a new study material</p>
            <Link
              to="/admin/studymaterials/new"
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Material
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudyMaterialListPage;