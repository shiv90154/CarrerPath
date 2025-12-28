import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface TestData {
  _id?: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  difficulty: string;
  isFree: boolean;
  isPreview: boolean;
  order: number;
}

interface LiveTestData {
  _id?: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  maxParticipants: number;
  order: number;
}

interface SubcategoryData {
  subcategoryName: string;
  subcategoryDescription: string;
  tests: TestData[];
  liveTests: LiveTestData[];
}

interface CategoryData {
  categoryName: string;
  categoryDescription: string;
  subcategories: SubcategoryData[];
  tests: TestData[]; // Direct tests without subcategories
  liveTests: LiveTestData[]; // Direct live tests without subcategories
}

interface TestSeriesData {
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  tags: string;
  requirements: string;
  whatYouWillLearn: string;
  validityPeriod: number;
  hasLiveTests: boolean;
  liveTestSchedule: string;
  resultAnalysis: boolean;
  rankingSystem: boolean;
  solutionAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  content: CategoryData[]; // Hierarchical content structure
}

const AdminTestSeriesEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<TestSeriesData>({
    title: '',
    description: '',
    fullDescription: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: '',
    level: 'Beginner',
    duration: '',
    language: 'English',
    tags: '',
    requirements: '',
    whatYouWillLearn: '',
    validityPeriod: 365,
    hasLiveTests: false,
    liveTestSchedule: '',
    resultAnalysis: true,
    rankingSystem: true,
    solutionAvailable: true,
    isActive: true,
    isFeatured: false,
    content: [], // Initialize with hierarchical content structure
  });

  const [tests, setTests] = useState<TestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content'>('basic');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      fetchTestSeries();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const fetchTestSeries = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`https://carrerpath-m48v.onrender.com/api/testseries/admin/${id}`, config);

      setFormData({
        title: data.title,
        description: data.description,
        fullDescription: data.fullDescription || '',
        price: data.price,
        originalPrice: data.originalPrice || data.price,
        image: data.image,
        category: data.category,
        level: data.level || 'Beginner',
        duration: data.duration || '',
        language: data.language || 'English',
        tags: data.tags ? data.tags.join(', ') : '',
        requirements: data.requirements ? data.requirements.join(', ') : '',
        whatYouWillLearn: data.whatYouWillLearn ? data.whatYouWillLearn.join(', ') : '',
        validityPeriod: data.validityPeriod || 365,
        hasLiveTests: data.hasLiveTests || false,
        liveTestSchedule: data.liveTestSchedule || '',
        resultAnalysis: data.resultAnalysis !== undefined ? data.resultAnalysis : true,
        rankingSystem: data.rankingSystem !== undefined ? data.rankingSystem : true,
        solutionAvailable: data.solutionAvailable !== undefined ? data.solutionAvailable : true,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured || false,
        content: data.content || [], // Load hierarchical content structure
      });

      setTests(data.tests || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch test series details');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
        whatYouWillLearn: formData.whatYouWillLearn.split(',').map(item => item.trim()).filter(item => item),
      };

      if (id) {
        await axios.put(`https://carrerpath-m48v.onrender.com/api/testseries/admin/${id}`, submitData, config);
        alert('Test series updated successfully');
      } else {
        await axios.post('https://carrerpath-m48v.onrender.com/api/testseries/admin', submitData, config);
        alert('Test series created successfully');
      }
      navigate('/admin/testseries');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save test series');
    } finally {
      setSaving(false);
    }
  };

  const addTest = () => {
    setTests([...tests, {
      title: '',
      description: '',
      duration: 60,
      totalQuestions: 50,
      totalMarks: 100,
      difficulty: 'Medium',
      isFree: false,
      isPreview: false,
      order: tests.length + 1,
    }]);
  };

  const updateTest = (index: number, field: keyof TestData, value: any) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setTests(updatedTests);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  // Hierarchical Content Management Functions
  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, {
        categoryName: '',
        categoryDescription: '',
        subcategories: [],
        tests: [],
        liveTests: []
      }]
    }));
  };

  const updateCategory = (categoryIndex: number, field: keyof CategoryData, value: string) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const removeCategory = (categoryIndex: number) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, index) => index !== categoryIndex)
    }));
  };

  const addSubcategory = (categoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories.push({
        subcategoryName: '',
        subcategoryDescription: '',
        tests: [],
        liveTests: []
      });
      return { ...prev, content: newContent };
    });
  };

  const updateSubcategory = (categoryIndex: number, subcategoryIndex: number, field: keyof SubcategoryData, value: string) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].subcategories[subcategoryIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const removeSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories = newContent[categoryIndex].subcategories.filter((_, index) => index !== subcategoryIndex);
      return { ...prev, content: newContent };
    });
  };

  const addTestToCategory = (categoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].tests.push({
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 50,
        totalMarks: 100,
        difficulty: 'Medium',
        isFree: false,
        isPreview: false,
        order: newContent[categoryIndex].tests.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const addLiveTestToCategory = (categoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].liveTests.push({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 120,
        totalQuestions: 100,
        totalMarks: 200,
        maxParticipants: 1000,
        order: newContent[categoryIndex].liveTests.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const addTestToSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].tests.push({
        title: '',
        description: '',
        duration: 60,
        totalQuestions: 50,
        totalMarks: 100,
        difficulty: 'Medium',
        isFree: false,
        isPreview: false,
        order: newContent[categoryIndex].subcategories[subcategoryIndex].tests.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const addLiveTestToSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].liveTests.push({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 120,
        totalQuestions: 100,
        totalMarks: 200,
        maxParticipants: 1000,
        order: newContent[categoryIndex].subcategories[subcategoryIndex].liveTests.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const updateCategoryTest = (categoryIndex: number, testIndex: number, field: keyof TestData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].tests[testIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const updateCategoryLiveTest = (categoryIndex: number, liveTestIndex: number, field: keyof LiveTestData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].liveTests[liveTestIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const updateSubcategoryTest = (categoryIndex: number, subcategoryIndex: number, testIndex: number, field: keyof TestData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].subcategories[subcategoryIndex].tests[testIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const updateSubcategoryLiveTest = (categoryIndex: number, subcategoryIndex: number, liveTestIndex: number, field: keyof LiveTestData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].subcategories[subcategoryIndex].liveTests[liveTestIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const removeCategoryTest = (categoryIndex: number, testIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].tests = newContent[categoryIndex].tests.filter((_, index) => index !== testIndex);
      return { ...prev, content: newContent };
    });
  };

  const removeCategoryLiveTest = (categoryIndex: number, liveTestIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].liveTests = newContent[categoryIndex].liveTests.filter((_, index) => index !== liveTestIndex);
      return { ...prev, content: newContent };
    });
  };

  const removeSubcategoryTest = (categoryIndex: number, subcategoryIndex: number, testIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].tests =
        newContent[categoryIndex].subcategories[subcategoryIndex].tests.filter((_, index) => index !== testIndex);
      return { ...prev, content: newContent };
    });
  };

  const removeSubcategoryLiveTest = (categoryIndex: number, subcategoryIndex: number, liveTestIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].liveTests =
        newContent[categoryIndex].subcategories[subcategoryIndex].liveTests.filter((_, index) => index !== liveTestIndex);
      return { ...prev, content: newContent };
    });
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">
        {id ? 'Edit Test Series' : 'Create New Test Series'}
      </h1>

      {/* Tab Navigation */}
      <div className="bg-white shadow-lg rounded-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Test Series Content Structure
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="UPSC">UPSC</option>
                    <option value="SSC">SSC</option>
                    <option value="Banking">Banking</option>
                    <option value="Railway">Railway</option>
                    <option value="State PSC">State PSC</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Both">Both (English & Hindi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 30 days, 2 months"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Validity Period (days)</label>
                  <input
                    type="number"
                    name="validityPeriod"
                    value={formData.validityPeriod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Short Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description for test series cards"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Full Description *</label>
                  <textarea
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed test series description"
                    required
                  />
                </div>

                {/* Pricing */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Pricing</h3>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    placeholder="Leave empty if same as price"
                  />
                </div>

                {/* Media */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Media</h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Image URL *</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Additional Information */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Additional Information</h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., UPSC, Mock Tests, Practice"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Requirements (comma separated)</label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Basic knowledge of syllabus, Internet connection"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">What You Will Learn (comma separated)</label>
                  <textarea
                    name="whatYouWillLearn"
                    value={formData.whatYouWillLearn}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Complete test practice, Time management, Performance analysis"
                  />
                </div>

                {/* Live Test Features */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Live Test Features</h3>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      name="hasLiveTests"
                      checked={formData.hasLiveTests}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 font-medium">This test series includes live tests</span>
                  </label>
                </div>

                {formData.hasLiveTests && (
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Live Test Schedule</label>
                    <input
                      type="text"
                      name="liveTestSchedule"
                      value={formData.liveTestSchedule}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Every Sunday 10 AM, Weekly on Saturdays"
                    />
                  </div>
                )}

                {/* Settings */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Settings</h3>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="resultAnalysis"
                      checked={formData.resultAnalysis}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Result Analysis</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rankingSystem"
                      checked={formData.rankingSystem}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Ranking System</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="solutionAvailable"
                      checked={formData.solutionAvailable}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Solutions Available</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => navigate('/admin/testseries')}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (id ? 'Update Test Series' : 'Create Test Series')}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'content' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Test Series Content Structure</h2>
                <button
                  onClick={addCategory}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  + Add Category
                </button>
              </div>

              {formData.content.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-lg mb-4">No categories added yet</p>
                  <p className="text-gray-400 text-sm">Click "Add Category" to start building your test series structure</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.content.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-300 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                              {categoryIndex + 1}
                            </span>
                            Category {categoryIndex + 1}
                          </h3>
                          <button
                            onClick={() => removeCategory(categoryIndex)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                          >
                            Remove Category
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
                            <input
                              type="text"
                              value={category.categoryName}
                              onChange={(e) => updateCategory(categoryIndex, 'categoryName', e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="e.g., General Studies, Mathematics, Reasoning"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category Description</label>
                            <input
                              type="text"
                              value={category.categoryDescription}
                              onChange={(e) => updateCategory(categoryIndex, 'categoryDescription', e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Brief description of this category"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Category Content */}
                      <div className="p-4">
                        {/* Subcategories Section */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-700">Subcategories</h4>
                            <button
                              onClick={() => addSubcategory(categoryIndex)}
                              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                              + Add Subcategory
                            </button>
                          </div>

                          {category.subcategories.map((subcategory, subcategoryIndex) => (
                            <div key={subcategoryIndex} className="border border-gray-200 rounded-lg p-4 mb-4 ml-4">
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="font-medium text-gray-600 flex items-center">
                                  <span className="text-purple-600 mr-2">👉</span>
                                  Subcategory {subcategoryIndex + 1}
                                </h5>
                                <button
                                  onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)}
                                  className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div>
                                  <label className="block text-gray-600 text-sm font-bold mb-1">Subcategory Name</label>
                                  <input
                                    type="text"
                                    value={subcategory.subcategoryName}
                                    onChange={(e) => updateSubcategory(categoryIndex, subcategoryIndex, 'subcategoryName', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g., History, Geography, Current Affairs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-600 text-sm font-bold mb-1">Subcategory Description</label>
                                  <input
                                    type="text"
                                    value={subcategory.subcategoryDescription}
                                    onChange={(e) => updateSubcategory(categoryIndex, subcategoryIndex, 'subcategoryDescription', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Brief description"
                                  />
                                </div>
                              </div>

                              {/* Tests and Live Tests in Subcategory */}
                              <div className="ml-4 space-y-4">
                                {/* Regular Tests */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <h6 className="text-sm font-medium text-gray-600">Tests in this Subcategory</h6>
                                    <button
                                      onClick={() => addTestToSubcategory(categoryIndex, subcategoryIndex)}
                                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded text-xs"
                                    >
                                      + Add Test
                                    </button>
                                  </div>

                                  {subcategory.tests.map((test, testIndex) => (
                                    <div key={testIndex} className="border border-gray-100 rounded p-3 mb-2 bg-gray-50">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-gray-500">Test {testIndex + 1}</span>
                                        <button
                                          onClick={() => removeSubcategoryTest(categoryIndex, subcategoryIndex, testIndex)}
                                          className="bg-red-300 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-xs"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={test.title}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'title', e.target.value)}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Test title"
                                        />
                                        <input
                                          type="text"
                                          value={test.description}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'description', e.target.value)}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Test description"
                                        />
                                        <select
                                          value={test.difficulty}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'difficulty', e.target.value)}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        >
                                          <option value="Easy">Easy</option>
                                          <option value="Medium">Medium</option>
                                          <option value="Hard">Hard</option>
                                        </select>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                                        <input
                                          type="number"
                                          value={test.duration}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'duration', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Duration (min)"
                                        />
                                        <input
                                          type="number"
                                          value={test.totalQuestions}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'totalQuestions', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Questions"
                                        />
                                        <input
                                          type="number"
                                          value={test.totalMarks}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'totalMarks', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Total marks"
                                        />
                                        <input
                                          type="number"
                                          value={test.order}
                                          onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'order', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Order"
                                        />
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={test.isFree}
                                            onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'isFree', e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                          />
                                          <span className="ml-2 text-sm text-gray-700">Free Sample</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={test.isPreview}
                                            onChange={(e) => updateSubcategoryTest(categoryIndex, subcategoryIndex, testIndex, 'isPreview', e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                          />
                                          <span className="ml-2 text-sm text-gray-700">Preview Test</span>
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Live Tests */}
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <h6 className="text-sm font-medium text-gray-600">Live Tests in this Subcategory</h6>
                                    <button
                                      onClick={() => addLiveTestToSubcategory(categoryIndex, subcategoryIndex)}
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                                    >
                                      + Add Live Test
                                    </button>
                                  </div>

                                  {subcategory.liveTests.map((liveTest, liveTestIndex) => (
                                    <div key={liveTestIndex} className="border border-red-100 rounded p-3 mb-2 bg-red-50">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-red-600">🔴 Live Test {liveTestIndex + 1}</span>
                                        <button
                                          onClick={() => removeSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex)}
                                          className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={liveTest.title}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'title', e.target.value)}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Live test title"
                                        />
                                        <input
                                          type="text"
                                          value={liveTest.description}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'description', e.target.value)}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Live test description"
                                        />
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                        <div>
                                          <label className="block text-gray-600 text-xs font-bold mb-1">Start Time</label>
                                          <input
                                            type="datetime-local"
                                            value={liveTest.startTime}
                                            onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'startTime', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-gray-600 text-xs font-bold mb-1">End Time</label>
                                          <input
                                            type="datetime-local"
                                            value={liveTest.endTime}
                                            onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'endTime', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                        <input
                                          type="number"
                                          value={liveTest.duration}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'duration', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Duration (min)"
                                        />
                                        <input
                                          type="number"
                                          value={liveTest.totalQuestions}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'totalQuestions', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Questions"
                                        />
                                        <input
                                          type="number"
                                          value={liveTest.totalMarks}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'totalMarks', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Total marks"
                                        />
                                        <input
                                          type="number"
                                          value={liveTest.maxParticipants}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'maxParticipants', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Max participants"
                                        />
                                        <input
                                          type="number"
                                          value={liveTest.order}
                                          onChange={(e) => updateSubcategoryLiveTest(categoryIndex, subcategoryIndex, liveTestIndex, 'order', parseInt(e.target.value))}
                                          className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                          placeholder="Order"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct Tests and Live Tests in Category */}
                        <div className="space-y-4">
                          {/* Direct Tests */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-md font-semibold text-gray-700">Direct Tests (No Subcategory)</h4>
                              <button
                                onClick={() => addTestToCategory(categoryIndex)}
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm"
                              >
                                + Add Direct Test
                              </button>
                            </div>

                            {category.tests.map((test, testIndex) => (
                              <div key={testIndex} className="border border-gray-200 rounded p-3 mb-3 bg-orange-50">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-600">Direct Test {testIndex + 1}</span>
                                  <button
                                    onClick={() => removeCategoryTest(categoryIndex, testIndex)}
                                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                  <input
                                    type="text"
                                    value={test.title}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'title', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Test title"
                                  />
                                  <input
                                    type="text"
                                    value={test.description}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'description', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Test description"
                                  />
                                  <select
                                    value={test.difficulty}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'difficulty', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                  </select>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                  <input
                                    type="number"
                                    value={test.duration}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'duration', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Duration (min)"
                                  />
                                  <input
                                    type="number"
                                    value={test.totalQuestions}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'totalQuestions', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Questions"
                                  />
                                  <input
                                    type="number"
                                    value={test.totalMarks}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'totalMarks', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Total marks"
                                  />
                                  <input
                                    type="number"
                                    value={test.order}
                                    onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'order', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Order"
                                  />
                                </div>
                                <div className="flex items-center space-x-4">
                                  <label className="inline-flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={test.isFree}
                                      onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'isFree', e.target.checked)}
                                      className="form-checkbox h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Free Sample</span>
                                  </label>
                                  <label className="inline-flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={test.isPreview}
                                      onChange={(e) => updateCategoryTest(categoryIndex, testIndex, 'isPreview', e.target.checked)}
                                      className="form-checkbox h-4 w-4 text-blue-600"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Preview Test</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Direct Live Tests */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-md font-semibold text-gray-700">Direct Live Tests (No Subcategory)</h4>
                              <button
                                onClick={() => addLiveTestToCategory(categoryIndex)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                              >
                                + Add Direct Live Test
                              </button>
                            </div>

                            {category.liveTests.map((liveTest, liveTestIndex) => (
                              <div key={liveTestIndex} className="border border-red-200 rounded p-3 mb-3 bg-red-50">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-red-600">🔴 Direct Live Test {liveTestIndex + 1}</span>
                                  <button
                                    onClick={() => removeCategoryLiveTest(categoryIndex, liveTestIndex)}
                                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <input
                                    type="text"
                                    value={liveTest.title}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'title', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Live test title"
                                  />
                                  <input
                                    type="text"
                                    value={liveTest.description}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'description', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Live test description"
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1">Start Time</label>
                                    <input
                                      type="datetime-local"
                                      value={liveTest.startTime}
                                      onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'startTime', e.target.value)}
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-1">End Time</label>
                                    <input
                                      type="datetime-local"
                                      value={liveTest.endTime}
                                      onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'endTime', e.target.value)}
                                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                  <input
                                    type="number"
                                    value={liveTest.duration}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'duration', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Duration (min)"
                                  />
                                  <input
                                    type="number"
                                    value={liveTest.totalQuestions}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'totalQuestions', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Questions"
                                  />
                                  <input
                                    type="number"
                                    value={liveTest.totalMarks}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'totalMarks', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Total marks"
                                  />
                                  <input
                                    type="number"
                                    value={liveTest.maxParticipants}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'maxParticipants', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Max participants"
                                  />
                                  <input
                                    type="number"
                                    value={liveTest.order}
                                    onChange={(e) => updateCategoryLiveTest(categoryIndex, liveTestIndex, 'order', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Order"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => navigate('/admin/testseries')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={saving}>
                  {saving ? 'Saving...' : (id ? 'Update Test Series Structure' : 'Save Test Series Structure')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legacy Tests Management (for backward compatibility) */}
      {id && tests.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Legacy Tests (Backward Compatibility)</h2>
          <p className="text-gray-600 mb-4">These are tests from the old structure. Consider organizing them into the new hierarchical structure above.</p>
          {tests.map((test, index) => (
            <div key={index} className="border p-4 rounded-md mb-4 bg-gray-50">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Test Title</label>
                <input type="text" value={test.title} onChange={(e) => updateTest(index, 'title', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Test Description</label>
                <textarea value={test.description} onChange={(e) => updateTest(index, 'description', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration (min)</label>
                  <input type="number" value={test.duration} onChange={(e) => updateTest(index, 'duration', parseInt(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Questions</label>
                  <input type="number" value={test.totalQuestions} onChange={(e) => updateTest(index, 'totalQuestions', parseInt(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Total Marks</label>
                  <input type="number" value={test.totalMarks} onChange={(e) => updateTest(index, 'totalMarks', parseInt(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
                  <select value={test.difficulty} onChange={(e) => updateTest(index, 'difficulty', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={test.isFree} onChange={(e) => updateTest(index, 'isFree', e.target.checked)} className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Free Sample Test</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={test.isPreview} onChange={(e) => updateTest(index, 'isPreview', e.target.checked)} className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Preview Test</span>
                </label>
              </div>
              <button type="button" onClick={() => removeTest(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Remove Test
              </button>
            </div>
          ))}
          <button type="button" onClick={addTest} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
            Add New Test
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTestSeriesEditPage;