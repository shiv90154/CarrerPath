import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FileText, Download, Calendar, Filter, Search, BookOpen, Tag, Award, Globe, Lock, Eye } from 'lucide-react';

interface StudyMaterial {
  _id: string;
  title: string;
  description: string;
  year: string;
  examType: string;
  subject: string;
  type: 'Free' | 'Paid';
  price: number;
  coverImage: string;
  pages: number;
  language: string;
  downloads: number;
  author: { name: string };
  createdAt: string;
}

interface Filters {
  examTypes: string[];
  years: string[];
  subjects: string[];
  types: string[];
}

const StudyMaterialPage: React.FC = () => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filters, setFilters] = useState<Filters>({
    examTypes: [],
    years: [],
    subjects: [],
    types: ['Free', 'Paid'],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    examType: '',
    year: '',
    subject: '',
    type: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    paid: 0,
  });

  useEffect(() => {
    fetchMaterials();
  }, [selectedFilters]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFilters.examType) params.append('examType', selectedFilters.examType);
      if (selectedFilters.year) params.append('year', selectedFilters.year);
      if (selectedFilters.subject) params.append('subject', selectedFilters.subject);
      if (selectedFilters.type) params.append('type', selectedFilters.type);

      const { data } = await axios.get(
        `https://carrerpath-m48v.onrender.com/api/studymaterials?${params.toString()}`
      );

      setMaterials(data.materials);
      setFilters(data.filters);

      const total = data.materials.length;
      const free = data.materials.filter((m: StudyMaterial) => m.type === 'Free').length;
      const paid = total - free;

      setStats({ total, free, paid });
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch study materials');
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      examType: '',
      year: '',
      subject: '',
      type: '',
    });
    setSearchTerm('');
  };

  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
          <div className="text-[#6B7280] font-['Inter'] font-medium">Loading study materials...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#B91C1C] mb-4 font-['Inter']">{error}</div>
          <button
            onClick={fetchMaterials}
            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] transition-colors font-['Inter'] font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">
      {/* Hero Section */}
      <div className="bg-[#0B1F33] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">

          {/* HEADING */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center font-poppins leading-tight">
            Previous Year Question Papers{" "}
            <span className="text-[#D4AF37]">
              & Study Materials
            </span>
          </h1>

          {/* SUBTEXT */}
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto text-[#E5E7EB] leading-relaxed mb-10 font-inter">
            Strengthen your preparation with <strong>exam-relevant previous year papers</strong>
            and detailed PDF study material. Explore free samples and unlock complete
            premium papers for in-depth practice.
          </p>

          {/* GOLD DIVIDER */}
          <div className="h-0.75 w-32 bg-[#D4AF37] mx-auto mb-12"></div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-center border border-white/10 shadow-sm">
              <div className="text-3xl font-bold font-poppins text-[#D4AF37]">
                {stats.total}
              </div>
              <div className="text-sm text-gray-300 mt-1 font-inter">
                Total Papers
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-center border border-white/10 shadow-sm">
              <div className="text-3xl font-bold font-poppins text-[#D4AF37]">
                {stats.free}
              </div>
              <div className="text-sm text-gray-300 mt-1 font-inter">
                Free Papers
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 text-center border border-white/10 shadow-sm">
              <div className="text-3xl font-bold font-poppins text-[#D4AF37]">
                {stats.paid}
              </div>
              <div className="text-sm text-gray-300 mt-1 font-inter">
                Premium Papers
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-10 border border-[#E5E7EB]">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] w-5 h-5" />
              <input
                type="text"
                placeholder="Search papers by title, subject, or exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] outline-none transition-all font-['Inter']"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#6B7280]" />
              <span className="font-medium text-[#0B1F33] font-['Inter']">Filter by:</span>
            </div>

            <div className="space-y-4">
              {/* Exam Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-[#6B7280] mb-2 font-['Inter']">Exam Type</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.examTypes.map((exam) => (
                    <button
                      key={exam}
                      onClick={() => handleFilterChange('examType', exam)}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all font-['Inter'] text-sm ${selectedFilters.examType === exam
                          ? 'bg-[#1E3A8A] text-white shadow-sm'
                          : 'bg-gray-50 text-[#111827] hover:bg-gray-100 border border-[#E5E7EB]'
                        }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year Filter */}
              <div>
                <h4 className="text-sm font-medium text-[#6B7280] mb-2 font-['Inter']">Year</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.years.slice(0, 10).map((year) => (
                    <button
                      key={year}
                      onClick={() => handleFilterChange('year', year)}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all font-['Inter'] text-sm ${selectedFilters.year === year
                          ? 'bg-[#1E3A8A] text-white shadow-sm'
                          : 'bg-gray-50 text-[#111827] hover:bg-gray-100 border border-[#E5E7EB]'
                        }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-[#6B7280] mb-2 font-['Inter']">Access Type</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('type', type)}
                      className={`px-4 py-2.5 rounded-lg font-medium transition-all font-['Inter'] text-sm flex items-center gap-2 ${selectedFilters.type === type
                          ? type === 'Free'
                            ? 'bg-[#D4AF37] text-white shadow-sm'
                            : 'bg-[#B91C1C] text-white shadow-sm'
                          : type === 'Free'
                            ? 'bg-gray-50 text-[#111827] hover:bg-gray-100 border border-[#E5E7EB]'
                            : 'bg-gray-50 text-[#111827] hover:bg-gray-100 border border-[#E5E7EB]'
                        }`}
                    >
                      {type === 'Paid' && <Lock className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedFilters.examType || selectedFilters.year || selectedFilters.subject || selectedFilters.type) && (
                <div className="pt-4">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-[#6B7280] hover:bg-gray-200 transition-colors font-['Inter'] border border-[#E5E7EB]"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {Object.values(selectedFilters).some(Boolean) && (
            <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2 font-['Inter']">
                <span>Active filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.examType && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] px-3 py-1.5 rounded-lg text-sm font-['Inter'] border border-blue-100">
                    Exam: {selectedFilters.examType}
                  </span>
                )}
                {selectedFilters.year && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] px-3 py-1.5 rounded-lg text-sm font-['Inter'] border border-blue-100">
                    Year: {selectedFilters.year}
                  </span>
                )}
                {selectedFilters.type && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] px-3 py-1.5 rounded-lg text-sm font-['Inter'] border border-blue-100">
                    Type: {selectedFilters.type}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-[#6B7280] font-['Inter']">
            Showing <span className="font-semibold text-[#0B1F33]">{filteredMaterials.length}</span> of{' '}
            <span className="font-semibold text-[#0B1F33]">{materials.length}</span> papers
          </p>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-[#0B1F33] mb-3 font-['Poppins']">No papers found</h3>
            <p className="text-[#6B7280] mb-8 font-['Inter'] max-w-md mx-auto leading-relaxed">
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#0B1F33] transition-colors font-['Inter'] font-medium"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMaterials.map((material) => (
              <div
                key={material._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#E5E7EB] hover:border-[#1E3A8A] group"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <img
                    src={material.coverImage || '/images/default-paper-cover.jpg'}
                    alt={material.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-paper-cover.jpg';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Inter'] ${material.type === 'Free'
                          ? 'bg-[#D4AF37] text-white'
                          : 'bg-[#B91C1C] text-white'
                        }`}
                    >
                      {material.type === 'Free' ? 'FREE' : 'PREMIUM'}
                    </span>
                    <span className="px-3 py-1.5 bg-white/95 text-[#0B1F33] rounded-lg text-xs font-semibold font-['Inter'] border border-white/20">
                      {material.examType}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Subject */}
                  <div className="mb-3">
                    <span className="text-sm font-semibold text-[#0B1F33] font-['Inter'] uppercase tracking-wide">
                      {material.subject}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-[#111827] mb-3 line-clamp-2 leading-snug font-['Poppins']">
                    {material.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-sm text-[#6B7280] mb-4 font-['Inter']">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {material.year}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      {material.pages} pages
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[#6B7280] text-sm mb-6 line-clamp-2 leading-relaxed font-['Inter']">
                    {material.description || `Previous year ${material.examType} question paper for ${material.subject}`}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-[#6B7280] mb-6 font-['Inter']">
                    <span className="flex items-center gap-1.5">
                      <Download className="w-4 h-4" />
                      {material.downloads} downloads
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4" />
                      {material.language}
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                    <div>
                      {material.type === 'Paid' ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#0B1F33] font-['Poppins']">
                            ₹{material.price}
                          </span>
                          <span className="text-sm text-[#6B7280] font-['Inter']">/paper</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-[#D4AF37] font-['Poppins']">
                          Free Access
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/study-materials/${material._id}`}
                      className={`px-5 py-2.5 rounded-lg font-medium transition-colors font-['Inter'] flex items-center gap-2 ${material.type === 'Free'
                          ? 'bg-[#D4AF37] text-white hover:bg-amber-600'
                          : 'bg-[#1E3A8A] text-white hover:bg-[#0B1F33]'
                        }`}
                    >
                      {material.type === 'Free' ? (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          View Details
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 pt-12 border-t border-[#E5E7EB]">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0B1F33] mb-12 font-['Poppins']">
            Why Choose Our Study Materials?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#1E3A8A] transition-colors">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-[#1E3A8A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0B1F33] mb-3 font-['Poppins']">Authentic Papers</h3>
              <p className="text-[#6B7280] leading-relaxed font-['Inter']">
                100% authentic previous year papers directly from official sources with verified answers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#1E3A8A] transition-colors">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#0B1F33] mb-3 font-['Poppins']">Detailed Solutions</h3>
              <p className="text-[#6B7280] leading-relaxed font-['Inter']">
                Step-by-step solutions with explanations and alternative methods for better understanding.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#E5E7EB] hover:border-[#1E3A8A] transition-colors">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-5">
                <Tag className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#0B1F33] mb-3 font-['Poppins']">Free Samples</h3>
              <p className="text-[#6B7280] leading-relaxed font-['Inter']">
                Try before you buy - comprehensive free samples available for all premium papers.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-[#6B7280] text-sm font-['Inter'] leading-relaxed max-w-3xl mx-auto">
          <p className="mb-4">
            <span className="font-semibold text-[#0B1F33]">Note:</span> Free papers include complete question papers.
            Premium papers include detailed solutions, answer keys, and expert analysis.
          </p>
          <p>
            New papers added regularly. Subscribe to get notified about updates and new materials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterialPage;