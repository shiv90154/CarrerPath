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
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured || false,
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
      maxMarks: 100,
      difficulty: 'Medium',
      isFree: false,
      order: tests.length + 1,
    }]);
  };

  const updateTest = (index: number, field: keyof Test, value: any) => {
    const updatedTests = [...tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setTests(updatedTests);
  };

  const removeTest = (index: number) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">
        {id ? 'Edit Test Series' : 'Create New Test Series'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
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

          {/* Settings */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 mt-6">Settings</h3>
          </div>

          <div className="flex items-center space-x-6">
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

      {/* Tests Management */}
      {id && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Manage Tests</h2>
            <button
              onClick={addTest}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add New Test
            </button>
          </div>

          {tests.map((test, index) => (
            <div key={index} className="border p-6 rounded-lg mb-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Test {index + 1}</h4>
                <button
                  onClick={() => removeTest(index)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Test Title</label>
                  <input
                    type="text"
                    value={test.title}
                    onChange={(e) => updateTest(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={test.duration}
                    onChange={(e) => updateTest(index, 'duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Total Questions</label>
                  <input
                    type="number"
                    value={test.totalQuestions}
                    onChange={(e) => updateTest(index, 'totalQuestions', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Max Marks</label>
                  <input
                    type="number"
                    value={test.maxMarks}
                    onChange={(e) => updateTest(index, 'maxMarks', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Difficulty</label>
                  <select
                    value={test.difficulty}
                    onChange={(e) => updateTest(index, 'difficulty', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Order</label>
                  <input
                    type="number"
                    value={test.order}
                    onChange={(e) => updateTest(index, 'order', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <textarea
                    value={test.description}
                    onChange={(e) => updateTest(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={test.isFree}
                      onChange={(e) => updateTest(index, 'isFree', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Free Sample Test</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestSeriesEditPage;