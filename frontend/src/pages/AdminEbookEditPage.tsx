import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface BookData {
  _id?: string;
  title: string;
  description: string;
  fileUrl: string;
  previewUrl?: string;
  coverImage?: string;
  pages: number;
  fileSize: string;
  format: string;
  isFree: boolean;
  hasPreview: boolean;
  previewPages: number;
  order: number;
}

interface SubcategoryData {
  subcategoryName: string;
  subcategoryDescription: string;
  books: BookData[];
}

interface CategoryData {
  categoryName: string;
  categoryDescription: string;
  subcategories: SubcategoryData[];
  books: BookData[]; // Direct books without subcategories
}

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
  content: CategoryData[]; // Hierarchical content structure
  // E-book specific features
  hasPreviewSample: boolean;
  previewPages: number;
  downloadLimit: number;
  watermarkEnabled: boolean;
  printingAllowed: boolean;
  offlineAccess: boolean;
  validityPeriod: number;
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
    content: [], // Initialize with hierarchical content structure
    hasPreviewSample: true,
    previewPages: 10,
    downloadLimit: 3,
    watermarkEnabled: true,
    printingAllowed: false,
    offlineAccess: true,
    validityPeriod: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content'>('basic');

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
      const { data } = await axios.get(`https://carrerpath-m48v.onrender.com/api/ebooks/admin/${id}`, config);

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
        content: data.content || [], // Load hierarchical content structure
        hasPreviewSample: data.hasPreviewSample !== undefined ? data.hasPreviewSample : true,
        previewPages: data.previewPages || 10,
        downloadLimit: data.downloadLimit || 3,
        watermarkEnabled: data.watermarkEnabled !== undefined ? data.watermarkEnabled : true,
        printingAllowed: data.printingAllowed || false,
        offlineAccess: data.offlineAccess !== undefined ? data.offlineAccess : true,
        validityPeriod: data.validityPeriod || 0,
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
        `https://carrerpath-m48v.onrender.com/api/ebooks/upload/${type}`,
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
        await axios.put(`https://carrerpath-m48v.onrender.com/api/ebooks/admin/${id}`, submitData, config);
        alert('Ebook updated successfully');
      } else {
        await axios.post('https://carrerpath-m48v.onrender.com/api/ebooks/admin', submitData, config);
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

  // Hierarchical Content Management Functions
  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, {
        categoryName: '',
        categoryDescription: '',
        subcategories: [],
        books: []
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
        books: []
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

  const addBookToCategory = (categoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].books.push({
        title: '',
        description: '',
        fileUrl: '',
        previewUrl: '',
        coverImage: '',
        pages: 0,
        fileSize: '',
        format: 'PDF',
        isFree: false,
        hasPreview: true,
        previewPages: 10,
        order: newContent[categoryIndex].books.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const addBookToSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].books.push({
        title: '',
        description: '',
        fileUrl: '',
        previewUrl: '',
        coverImage: '',
        pages: 0,
        fileSize: '',
        format: 'PDF',
        isFree: false,
        hasPreview: true,
        previewPages: 10,
        order: newContent[categoryIndex].subcategories[subcategoryIndex].books.length + 1
      });
      return { ...prev, content: newContent };
    });
  };

  const updateCategoryBook = (categoryIndex: number, bookIndex: number, field: keyof BookData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].books[bookIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const updateSubcategoryBook = (categoryIndex: number, subcategoryIndex: number, bookIndex: number, field: keyof BookData, value: any) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      // @ts-ignore
      newContent[categoryIndex].subcategories[subcategoryIndex].books[bookIndex][field] = value;
      return { ...prev, content: newContent };
    });
  };

  const removeCategoryBook = (categoryIndex: number, bookIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].books = newContent[categoryIndex].books.filter((_, index) => index !== bookIndex);
      return { ...prev, content: newContent };
    });
  };

  const removeSubcategoryBook = (categoryIndex: number, subcategoryIndex: number, bookIndex: number) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      newContent[categoryIndex].subcategories[subcategoryIndex].books =
        newContent[categoryIndex].subcategories[subcategoryIndex].books.filter((_, index) => index !== bookIndex);
      return { ...prev, content: newContent };
    });
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">
        {id ? 'Edit E-Book' : 'Create New E-Book'}
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
              E-Book Content Structure
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

                {/* E-book Features */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">E-book Features</h3>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Preview Pages</label>
                  <input
                    type="number"
                    name="previewPages"
                    value={formData.previewPages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Download Limit</label>
                  <input
                    type="number"
                    name="downloadLimit"
                    value={formData.downloadLimit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
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
                    min="0"
                    placeholder="0 for lifetime access"
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
                    placeholder="e.g., UPSC, Study Guide, Preparation"
                  />
                </div>

                {/* Settings */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4 mt-6">Settings</h3>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasPreviewSample"
                      checked={formData.hasPreviewSample}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Preview Sample</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="watermarkEnabled"
                      checked={formData.watermarkEnabled}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Watermark</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="printingAllowed"
                      checked={formData.printingAllowed}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Printing Allowed</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="offlineAccess"
                      checked={formData.offlineAccess}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Offline Access</span>
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
          )}

          {activeTab === 'content' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">E-Book Content Structure</h2>
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
                  <p className="text-gray-400 text-sm">Click "Add Category" to start building your e-book collection structure</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.content.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-300 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
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
                              placeholder="e.g., NCERT Books, Reference Books, Previous Year Papers"
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
                                    placeholder="e.g., Class 11, Class 12, History, Geography"
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

                              {/* Books in Subcategory */}
                              <div className="ml-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h6 className="text-sm font-medium text-gray-600">Books in this Subcategory</h6>
                                  <button
                                    onClick={() => addBookToSubcategory(categoryIndex, subcategoryIndex)}
                                    className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded text-xs"
                                  >
                                    + Add Book
                                  </button>
                                </div>

                                {subcategory.books.map((book, bookIndex) => (
                                  <div key={bookIndex} className="border border-gray-100 rounded p-3 mb-2 bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-medium text-gray-500">📚 Book {bookIndex + 1}</span>
                                      <button
                                        onClick={() => removeSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex)}
                                        className="bg-red-300 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-xs"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={book.title}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'title', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Book title"
                                      />
                                      <input
                                        type="text"
                                        value={book.description}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'description', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Book description"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                                      <input
                                        type="url"
                                        value={book.fileUrl}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'fileUrl', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="File URL"
                                      />
                                      <input
                                        type="url"
                                        value={book.previewUrl || ''}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'previewUrl', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Preview URL"
                                      />
                                      <input
                                        type="number"
                                        value={book.pages}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'pages', parseInt(e.target.value))}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Pages"
                                      />
                                      <input
                                        type="text"
                                        value={book.fileSize}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'fileSize', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="File size"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={book.isFree}
                                          onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'isFree', e.target.checked)}
                                          className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Free</span>
                                      </label>
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={book.hasPreview}
                                          onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'hasPreview', e.target.checked)}
                                          className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Has Preview</span>
                                      </label>
                                      <input
                                        type="number"
                                        value={book.previewPages}
                                        onChange={(e) => updateSubcategoryBook(categoryIndex, subcategoryIndex, bookIndex, 'previewPages', parseInt(e.target.value))}
                                        className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Preview pages"
                                        min="0"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct Books in Category */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-700">Direct Books (No Subcategory)</h4>
                            <button
                              onClick={() => addBookToCategory(categoryIndex)}
                              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                              + Add Direct Book
                            </button>
                          </div>

                          {category.books.map((book, bookIndex) => (
                            <div key={bookIndex} className="border border-gray-200 rounded p-3 mb-3 bg-orange-50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">📚 Direct Book {bookIndex + 1}</span>
                                <button
                                  onClick={() => removeCategoryBook(categoryIndex, bookIndex)}
                                  className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                  type="text"
                                  value={book.title}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'title', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Book title"
                                />
                                <input
                                  type="text"
                                  value={book.description}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'description', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Book description"
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <input
                                  type="url"
                                  value={book.fileUrl}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'fileUrl', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="File URL"
                                />
                                <input
                                  type="url"
                                  value={book.previewUrl || ''}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'previewUrl', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Preview URL"
                                />
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                <input
                                  type="number"
                                  value={book.pages}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'pages', parseInt(e.target.value))}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Pages"
                                />
                                <input
                                  type="text"
                                  value={book.fileSize}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'fileSize', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="File size"
                                />
                                <select
                                  value={book.format}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'format', e.target.value)}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                  <option value="PDF">PDF</option>
                                  <option value="EPUB">EPUB</option>
                                  <option value="MOBI">MOBI</option>
                                </select>
                                <input
                                  type="number"
                                  value={book.order}
                                  onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'order', parseInt(e.target.value))}
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  placeholder="Order"
                                />
                              </div>
                              <div className="flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={book.isFree}
                                    onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'isFree', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Free</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={book.hasPreview}
                                    onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'hasPreview', e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-blue-600"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Has Preview</span>
                                </label>
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-700 mr-2">Preview pages:</span>
                                  <input
                                    type="number"
                                    value={book.previewPages}
                                    onChange={(e) => updateCategoryBook(categoryIndex, bookIndex, 'previewPages', parseInt(e.target.value))}
                                    className="shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                    min="0"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => navigate('/admin/ebooks')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={saving}>
                  {saving ? 'Saving...' : (id ? 'Update E-Book Structure' : 'Save E-Book Structure')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEbookEditPage;