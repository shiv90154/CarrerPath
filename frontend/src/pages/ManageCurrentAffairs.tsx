import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Calendar,
  Tag,
  Download,
  BarChart3,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
// Removed ReactQuill import

interface CurrentAffair {
  _id: string;
  title: string;
  description: string;
  detailedContent: string;
  category: string;
  date: string;
  month: string;
  year: number;
  isPublished: boolean;
  tags: string[];
  relatedExams: string[];
  source?: string;
  importanceLevel: 'High' | 'Medium' | 'Low';
  views: number;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface Statistics {
  total: number;
  published: number;
  unpublished: number;
  categoryStats: Array<{
    _id: string;
    count: number;
    published: number;
  }>;
  monthlyStats: Array<{
    _id: string;
    count: number;
  }>;
  currentYear: number;
}

const ManageCurrentAffairs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffair[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedContent: '',
    category: 'Miscellaneous',
    date: format(new Date(), 'yyyy-MM-dd'),
    tags: [] as string[],
    relatedExams: [] as string[],
    source: '',
    importanceLevel: 'Medium' as 'High' | 'Medium' | 'Low'
  });
  const [tagInput, setTagInput] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    year: '',
    month: '',
    search: '',
    isPublished: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 20
  });

  const categories = [
    'Polity', 'Economy', 'Environment', 'Science & Technology',
    'International', 'National', 'State Affairs', 'Sports',
    'Awards & Honors', 'Miscellaneous'
  ];

  const exams = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Defense', 'Teaching', 'Others'];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCurrentAffairs();
    fetchStatistics();
  }, [user, navigate, filters, pagination.page]);

  const fetchCurrentAffairs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      if (filters.search) params.append('search', filters.search);
      if (filters.isPublished) params.append('isPublished', filters.isPublished);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/current-affairs/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (response.data.success) {
        setCurrentAffairs(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to fetch current affairs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('https://carrerpath-m48v.onrender.com/api/current-affairs/stats/summary', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
    fetchStatistics();
  }, [filters, pagination.page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Removed handleEditorChange function - no longer needed

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleExamToggle = (exam: string) => {
    setFormData(prev => ({
      ...prev,
      relatedExams: prev.relatedExams.includes(exam)
        ? prev.relatedExams.filter(e => e !== exam)
        : [...prev.relatedExams, exam]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `https://carrerpath-m48v.onrender.com/api/current-affairs/${editingId}`
        : 'https://carrerpath-m48v.onrender.com/api/current-affairs';

      const method = editingId ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      if (response.data.success) {
        alert(`Current affair ${editingId ? 'updated' : 'created'} successfully`);
        resetForm();
        fetchCurrentAffairs();
        fetchStatistics();
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      alert(error.response?.data?.message || 'Failed to save current affair');
    }
  };

  const handleEdit = (affair: CurrentAffair) => {
    setFormData({
      title: affair.title,
      description: affair.description,
      detailedContent: affair.detailedContent,
      category: affair.category,
      date: format(new Date(affair.date), 'yyyy-MM-dd'),
      tags: affair.tags || [],
      relatedExams: affair.relatedExams || [],
      source: affair.source || '',
      importanceLevel: affair.importanceLevel
    });
    setEditingId(affair._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this current affair?')) {
      return;
    }

    try {
      await axios.delete(`https://carrerpath-m48v.onrender.com/api/current-affairs/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      alert('Current affair deleted successfully');
      fetchCurrentAffairs();
      fetchStatistics();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete current affair');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`https://carrerpath-m48v.onrender.com/api/current-affairs/toggle-publish/${id}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      alert(`Current affair ${currentStatus ? 'unpublished' : 'published'} successfully`);
      fetchCurrentAffairs();
      fetchStatistics();
    } catch (error) {
      console.error('Toggle publish error:', error);
      alert('Failed to update publish status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailedContent: '',
      category: 'Miscellaneous',
      date: format(new Date(), 'yyyy-MM-dd'),
      tags: [],
      relatedExams: [],
      source: '',
      importanceLevel: 'Medium'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      year: '',
      month: '',
      search: '',
      isPublished: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1F33] font-poppins mb-2">
            Manage Current Affairs
          </h1>
          <p className="text-[#6B7280]">
            Add, edit, and manage current affairs for student access
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={fetchStatistics}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-[#111827]"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Stats
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33]"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Cancel' : 'Add New'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] font-inter">Total Entries</p>
                <p className="text-2xl font-bold text-[#0B1F33] font-poppins">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#1E3A8A]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] font-inter">Published</p>
                <p className="text-2xl font-bold text-[#0B1F33] font-poppins">{stats.published}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] font-inter">Unpublished</p>
                <p className="text-2xl font-bold text-[#0B1F33] font-poppins">{stats.unpublished}</p>
              </div>
              <EyeOff className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] font-inter">Current Year</p>
                <p className="text-2xl font-bold text-[#0B1F33] font-poppins">{stats.currentYear}</p>
              </div>
              <Calendar className="w-8 h-8 text-[#D4AF37]" />
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-6 mb-8">
          <h2 className="text-xl font-bold text-[#0B1F33] mb-4 font-poppins">
            {editingId ? 'Edit Current Affair' : 'Add New Current Affair'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                  placeholder="Enter current affair title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Importance Level
                </label>
                <select
                  name="importanceLevel"
                  value={formData.importanceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                placeholder="Brief summary (2-3 lines)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                Detailed Content *
              </label>
              <textarea
                value={formData.detailedContent}
                onChange={(e) => setFormData(prev => ({ ...prev, detailedContent: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] font-inter"
                placeholder="Enter detailed content..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Source
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
                  placeholder="e.g., The Hindu, PIB, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                Related Exams
              </label>
              <div className="flex flex-wrap gap-2">
                {exams.map(exam => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => handleExamToggle(exam)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${formData.relatedExams.includes(exam)
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 font-inter font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] font-inter font-medium"
              >
                {editingId ? 'Update' : 'Create'} Current Affair
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-[#0B1F33] font-poppins">
            All Current Affairs
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] w-64"
              />
            </div>

            <select
              value={filters.isPublished}
              onChange={(e) => handleFilterChange('isPublished', e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            >
              <option value="">All Status</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A]"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {(filters.category || filters.search || filters.isPublished) && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-[#B91C1C] bg-[#FEE2E2] rounded-lg hover:bg-[#FECACA] font-inter"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
            <div className="text-[#6B7280]">Loading current affairs...</div>
          </div>
        ) : currentAffairs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6B7280]">No current affairs found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Views</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#111827] font-inter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAffairs.map((affair) => (
                    <tr key={affair._id} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-[#111827] font-inter line-clamp-1">{affair.title}</p>
                          <p className="text-sm text-[#6B7280] font-inter line-clamp-1">{affair.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${affair.category === 'Polity' ? 'bg-blue-100 text-blue-800' :
                          affair.category === 'Economy' ? 'bg-green-100 text-green-800' :
                            affair.category === 'Environment' ? 'bg-emerald-100 text-emerald-800' :
                              affair.category === 'Science & Technology' ? 'bg-purple-100 text-purple-800' :
                                affair.category === 'International' ? 'bg-red-100 text-red-800' :
                                  affair.category === 'National' ? 'bg-amber-100 text-amber-800' :
                                    affair.category === 'State Affairs' ? 'bg-indigo-100 text-indigo-800' :
                                      affair.category === 'Sports' ? 'bg-pink-100 text-pink-800' :
                                        affair.category === 'Awards & Honors' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                          }`}>
                          {affair.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] font-inter">
                        {formatDate(affair.date)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${affair.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {affair.isPublished ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Unpublished
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] font-inter">
                        {affair.views}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(affair)}
                            className="p-1.5 text-[#1E3A8A] hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleTogglePublish(affair._id, affair.isPublished)}
                            className="p-1.5 text-[#D4AF37] hover:bg-yellow-50 rounded"
                            title={affair.isPublished ? 'Unpublish' : 'Publish'}
                          >
                            {affair.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(affair._id)}
                            className="p-1.5 text-[#B91C1C] hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg border font-inter ${pagination.page === 1
                    ? 'border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    : 'border-[#D1D5DB] text-[#111827] hover:bg-gray-50'
                    }`}
                >
                  Previous
                </button>

                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`px-4 py-2 rounded-lg font-inter ${pagination.page === pageNum
                        ? 'bg-[#1E3A8A] text-white'
                        : 'border border-[#E5E7EB] text-[#111827] hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className={`px-4 py-2 rounded-lg border font-inter ${pagination.page === pagination.pages
                    ? 'border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    : 'border-[#D1D5DB] text-[#111827] hover:bg-gray-50'
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats Summary */}
      {stats && stats.categoryStats.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-6">
          <h3 className="text-lg font-semibold text-[#0B1F33] mb-4 font-poppins">
            Category-wise Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.categoryStats.slice(0, 5).map((stat) => (
              <div key={stat._id} className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-[#111827] font-inter mb-2">{stat._id}</p>
                <div className="flex justify-between text-sm text-[#6B7280] font-inter">
                  <span>Total: {stat.count}</span>
                  <span>Published: {stat.published}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCurrentAffairs;