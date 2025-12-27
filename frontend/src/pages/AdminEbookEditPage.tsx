import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface EbookData {
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  coverImage: string;
  category: string;
  language: string;
  pages: number;
  fileSize: string;
  format: string;
  isbn: string;
  tags: string;
  isFree: boolean;
  isActive: boolean;
  isFeatured: boolean;
}

const AdminEbookEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<EbookData>({
    title: '',
    description: '',
    fullDescription: '',
    price: 0,
    originalPrice: 0,
    coverImage: '',
    category: '',
    language: 'English',
    pages: 0,
    fileSize: '',
    format: 'PDF',
    isbn: '',
    tags: '',
    isFree: false,
    isActive: true,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      fetchEbook();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const fetchEbook = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:5000/api/ebooks/admin/${id}`, config);

      setFormData({
        title: data.title,
        description: data.description,
        fullDescription: data.fullDescription || '',
        price: data.price,
        originalPrice: data.originalPrice || data.price,
        coverImage: data.coverImage,
        category: data.category,
        language: data.language || 'English',
        pages: data.pages || 0,
        fileSize: data.fileSize || '',
        format: data.format || 'PDF',
        isbn: data.isbn || '',
        tags: data.tags ? data.tags.join(', ') : '',
        isFree: data.isFree || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isFeatured: data.isFeatured || false,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch ebook details');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'ebook' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === 'ebook' ? 'ebook' : 'coverImage', file);

    try {
      if (type === 'ebook') {
        setUploadingFile(true);
      } else {
        setUploadingCover(true);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/ebooks/upload/${type}`,
        formData,
        config
      );

      if (type === 'ebook') {
        // Update file size automatically if returned from server
        setFormData(prev => ({
          ...prev,
          fileSize: data.fileSize || prev.fileSize
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          coverImage: data.url
        }));
      }

      alert(`${type === 'ebook' ? 'Ebook file' : 'Cover image'} uploaded successfully`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      if (type === 'ebook') {
        setUploadingFile(false);
      } else {
        setUploadingCover(false);
      }
    }
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
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/ebooks/admin/${id}`, submitData, config);
        alert('Ebook updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/ebooks/admin', submitData, config);
        alert('Ebook created successfully');
      }
      navigate('/admin/ebooks');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save ebook');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">
        {id ? 'Edit E-Book' : 'Create New E-Book'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
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
              <option value="General Knowledge">General Knowledge</option>
              <option value="Other">Other</option>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">Format</label>
            <select
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PDF">PDF</option>
              <option value="EPUB">EPUB</option>
              <option value="MOBI">MOBI</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Pages *</label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">File Size *</label>
            <input
              type="text"
              name="fileSize"
              value={formData.fileSize}
              onChange={handleInputChange}
              placeholder="e.g., 2.5 MB"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">ISBN (Optional)</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              placeholder="e.g., 978-3-16-148410-0"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              placeholder="Brief description for ebook cards"
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
              placeholder="Detailed ebook description"
              required
            />
          </div>

          {/* Pricing */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 mt-6">Pricing</h3>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 font-medium">This is a free ebook</span>
            </label>
          </div>

          {!formData.isFree && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required={!formData.isFree}
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
            </>
          )}

          {/* Media */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 mt-6">Media & Files</h3>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Cover Image URL *</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'cover')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploadingCover}
            />
            {uploadingCover && <p className="text-blue-600 text-sm mt-1">Uploading cover image...</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Ebook File *</label>
            <input
              type="file"
              accept=".pdf,.epub,.mobi"
              onChange={(e) => handleFileUpload(e, 'ebook')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploadingFile}
              required={!id}
            />
            {uploadingFile && <p className="text-blue-600 text-sm mt-1">Uploading ebook file...</p>}
            <p className="text-gray-500 text-sm mt-1">
              Supported formats: PDF, EPUB, MOBI. Max size: 50MB
            </p>
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
              placeholder="e.g., UPSC, Study Guide, Preparation"
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

          {/* Preview */}
          {formData.coverImage && (
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 mt-6">Preview</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-32 h-44 object-cover rounded-lg shadow-md"
                />
                <div>
                  <h4 className="text-lg font-semibold">{formData.title || 'Ebook Title'}</h4>
                  <p className="text-gray-600 text-sm">{formData.description || 'Ebook description...'}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="mr-4">📄 {formData.pages} pages</span>
                    <span className="mr-4">💾 {formData.fileSize}</span>
                    <span>{formData.format}</span>
                  </div>
                  <div className="mt-2">
                    {formData.isFree ? (
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ₹{formData.price}
                        {formData.originalPrice > formData.price && (
                          <span className="text-gray-500 line-through text-sm ml-2">
                            ₹{formData.originalPrice}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => navigate('/admin/ebooks')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploadingFile || uploadingCover}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {saving ? 'Saving...' : (id ? 'Update E-Book' : 'Create E-Book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEbookEditPage;