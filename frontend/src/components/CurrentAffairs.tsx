import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Calendar,
  Tag,
  Eye,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Bookmark,
  Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CurrentAffairData {
  _id: string;
  title: string;
  description: string;
  detailedContent: string;
  category: string;
  date: string;
  month: string;
  year: number;
  tags: string[];
  source?: string;
  importanceLevel: 'High' | 'Medium' | 'Low';
  views: number;
}

interface FilterOptions {
  years: number[];
  months: string[];
  categories: string[];
}

const CurrentAffairsPage: React.FC = () => {
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    year: '',
    month: '',
    search: '',
    importanceLevel: ''
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    years: [],
    months: [],
    categories: []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 12
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categoryColors: Record<string, string> = {
    'Polity': 'bg-blue-100 text-blue-800',
    'Economy': 'bg-green-100 text-green-800',
    'Environment': 'bg-emerald-100 text-emerald-800',
    'Science & Technology': 'bg-purple-100 text-purple-800',
    'International': 'bg-red-100 text-red-800',
    'National': 'bg-amber-100 text-amber-800',
    'State Affairs': 'bg-indigo-100 text-indigo-800',
    'Sports': 'bg-pink-100 text-pink-800',
    'Awards & Honors': 'bg-yellow-100 text-yellow-800',
    'Miscellaneous': 'bg-gray-100 text-gray-800'
  };

  const importanceColors: Record<string, string> = {
    'High': 'bg-red-50 text-red-700 border-red-200',
    'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Low': 'bg-green-50 text-green-700 border-green-200'
  };

  const fetchCurrentAffairs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.category) params.append('category', filters.category);
      if (filters.year) params.append('year', filters.year);
      if (filters.month) params.append('month', filters.month);
      if (filters.search) params.append('search', filters.search);
      if (filters.importanceLevel) params.append('importanceLevel', filters.importanceLevel);
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());

      const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/current-affairs/published?${params}`);

      if (response.data.success) {
        setCurrentAffairs(response.data.data);
        setFilterOptions(response.data.filters);
        setPagination(response.data.pagination);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch current affairs');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCurrentAffairs();
  }, [fetchCurrentAffairs]);

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
      importanceLevel: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleExpand = (id: string) => {
    console.log('Toggling expand for ID:', id);
    console.log('Current expandedId:', expandedId);
    setExpandedId(expandedId === id ? null : id);
    console.log('New expandedId will be:', expandedId === id ? null : id);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  if (loading && currentAffairs.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <div className="text-[#6B7280] font-inter">Loading current affairs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-inter">
      {/* Hero Section */}
      <div className="bg-[#0B1F33] text-white">
        <div className="container mx-auto px-4 py-16">

          {/* HEADING */}
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-center font-poppins leading-tight">
            Daily{" "}
            <span className="text-[#D4AF37]">
              Current Affairs
            </span>
          </h1>

          {/* SUBTEXT */}
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto text-[#E5E7EB] mb-10 leading-relaxed font-inter">
            Your one-stop source for <strong>exam-oriented daily news</strong>, curated
            specifically for UPSC, State PCS, SSC, Banking & other competitive examinations.
          </p>

          {/* GOLD DIVIDER */}
          <div className="h-[3px] w-24 bg-[#D4AF37] mx-auto mb-10"></div>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] w-5 h-5" />

              <input
                type="text"
                placeholder="Search by topic, keyword, exam (UPSC / PCS / SSC)…"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl
                     bg-white/5 backdrop-blur-md
                     border border-white/15
                     text-white placeholder-[#CBD5E1]
                     focus:outline-none focus:ring-2 focus:ring-[#D4AF37]
                     transition"
              />
            </div>

            {/* HELPER TEXT */}
            <p className="text-sm text-gray-400 text-center mt-4 font-inter">
              Updated daily • Exam-relevant • Easy to revise
            </p>
          </div>

        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0B1F33] font-poppins">
              Latest Updates
            </h2>
            <p className="text-[#6B7280] font-inter">
              {pagination.total} entries found • Page {pagination.page} of {pagination.pages}
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-gray-50 text-[#111827] font-inter font-medium"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow border border-[#E5E7EB] p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#111827] font-inter"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#111827] font-inter"
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Month
                </label>
                <select
                  value={filters.month}
                  onChange={(e) => handleFilterChange('month', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#111827] font-inter"
                >
                  <option value="">All Months</option>
                  {filterOptions.months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Importance Filter */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2 font-inter">
                  Importance Level
                </label>
                <select
                  value={filters.importanceLevel}
                  onChange={(e) => handleFilterChange('importanceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-[#111827] font-inter"
                >
                  <option value="">All Levels</option>
                  <option value="High">High Importance</option>
                  <option value="Medium">Medium Importance</option>
                  <option value="Low">Low Importance</option>
                </select>
              </div>
            </div>

            {/* Active Filters & Clear Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#E5E7EB]">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => (
                  value && key !== 'search' && (
                    <span
                      key={key}
                      className="px-3 py-1 bg-[#DBEAFE] text-[#1E3A8A] rounded-full text-sm font-inter"
                    >
                      {key}: {value}
                    </span>
                  )
                ))}
              </div>

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-[#B91C1C] bg-[#FEE2E2] rounded-lg hover:bg-[#FECACA] font-inter"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Current Affairs Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-[#B91C1C] mb-4">{error}</div>
            <button
              onClick={() => fetchCurrentAffairs()}
              className="px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] font-inter"
            >
              Try Again
            </button>
          </div>
        ) : currentAffairs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-[#E5E7EB]">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0B1F33] mb-2 font-poppins">No current affairs found</h3>
            <p className="text-[#6B7280] mb-6 font-inter">
              {filters.search ? 'Try a different search term' : 'No entries available for selected filters'}
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] font-inter font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {currentAffairs.map((affair) => (
                <div
                  key={affair._id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border border-[#E5E7EB]"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-[#0B1F33] mb-2 font-poppins line-clamp-2">
                          {affair.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] font-inter">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(affair.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {affair.views} views
                          </span>
                          {affair.source && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              Source: {affair.source}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[affair.category] || 'bg-gray-100 text-gray-800'} font-inter`}>
                          {affair.category}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${importanceColors[affair.importanceLevel]} font-inter`}>
                          {affair.importanceLevel}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#6B7280] mb-4 font-inter line-clamp-3">
                      {affair.description}
                    </p>

                    {/* Tags */}
                    {affair.tags && affair.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Tag className="w-4 h-4 text-[#6B7280] mt-1" />
                        {affair.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs font-inter"
                          >
                            {tag}
                          </span>
                        ))}
                        {affair.tags.length > 4 && (
                          <span className="px-2 py-1 bg-[#F3F4F6] text-[#6B7280] rounded text-xs font-inter">
                            +{affair.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                      <button
                        onClick={() => toggleExpand(affair._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] font-inter font-medium transition-colors"
                      >
                        {expandedId === affair._id ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-4 h-4" />
                            Read Details
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-3">
                        <button className="p-2 text-[#6B7280] hover:text-[#1E3A8A] hover:bg-blue-50 rounded">
                          <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-[#6B7280] hover:text-[#1E3A8A] hover:bg-blue-50 rounded">
                          <Share2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-[#6B7280] hover:text-[#1E3A8A] hover:bg-blue-50 rounded">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Content (Collapsible) */}
                    {expandedId === affair._id && (
                      <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                        <div className="prose prose-sm max-w-none text-[#111827] font-inter">
                          {/* Debug: Show raw content first */}
                          <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                            <strong>Debug - Raw Content:</strong>
                            <pre className="mt-2 whitespace-pre-wrap">{affair.detailedContent}</pre>
                          </div>

                          {/* Render with ReactMarkdown */}
                          <div className="mb-4">
                            <strong>Rendered Content:</strong>
                            <div className="mt-2">
                              <ReactMarkdown>{affair.detailedContent}</ReactMarkdown>
                            </div>
                          </div>

                          {/* Fallback: Render as HTML if ReactMarkdown fails */}
                          <div className="mb-4">
                            <strong>HTML Content:</strong>
                            <div
                              className="mt-2"
                              dangerouslySetInnerHTML={{ __html: affair.detailedContent }}
                            />
                          </div>
                        </div>

                        {/* Key Points */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-[#0B1F33] mb-2 flex items-center gap-2 font-poppins">
                            <Award className="w-5 h-5 text-[#D4AF37]" />
                            Key Takeaways for Exams
                          </h4>
                          <ul className="list-disc pl-5 text-[#111827] font-inter space-y-1">
                            {affair.description.split('. ').slice(0, 4).map((point, index) => (
                              <li key={index}>{point.trim()}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg border font-inter font-medium ${pagination.page === 1
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
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-inter font-medium ${pagination.page === pageNum
                        ? 'bg-[#1E3A8A] text-white'
                        : 'border border-[#E5E7EB] text-[#111827] hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-4 py-2 rounded-lg border font-inter font-medium ${pagination.page === pagination.pages
                    ? 'border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    : 'border-[#D1D5DB] text-[#111827] hover:bg-gray-50'
                    }`}
                >
                  Next
                </button>
              </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8 pt-8 border-t border-[#E5E7EB] text-center text-[#6B7280] text-sm font-inter">
              <p className="mb-2">
                Last updated: {format(new Date(), 'dd MMM yyyy, hh:mm a')}
              </p>
              <p>
                Data compiled from verified sources. For exam preparation only.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CurrentAffairsPage;