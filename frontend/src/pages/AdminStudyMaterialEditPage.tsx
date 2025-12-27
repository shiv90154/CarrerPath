import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

interface StudyMaterialData {
  title: string;
  description: string;
  year: string;
  examType: string;
  subject: string;
  type: 'Free' | 'Paid';
  price: number;
  language: string;
  pages: number;
  fileUrl?: string;
  coverImage?: string;
}

const AdminStudyMaterialEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<StudyMaterialData>({
    title: '',
    description: '',
    year: new Date().getFullYear().toString(),
    examType: 'UPSC',
    subject: '',
    type: 'Free',
    price: 0,
    language: 'English',
    pages: 0,
  });

  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examTypes = ['UPSC', 'SSC', 'Banking', 'State Exams', 'Railway', 'Defense', 'Teaching', 'Other'];
  const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Other'];

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      fetchMaterial();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const fetchMaterial = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        `https://carrerpath-m48v.onrender.com/api/studymaterials/admin/${id}`,
        config
      );

      setFormData({
        title: data.title,
        description: data.description,
        year: data.year,
        examType: data.examType,
        subject: data.subject,
        type: data.type,
        price: data.price || 0,
        language: data.language || 'English',
        pages: data.pages || 0,
        fileUrl: data.fileUrl,
        coverImage: data.coverImage,
      });

      if (data.coverImage) {
        setCoverImagePreview(data.coverImage);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch material');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'type' && value === 'Free') {
      setFormData({ ...formData, [name]: value, price: 0 });
    } else if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (name === 'pages') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMaterialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMaterialFile(e.target.files[0]);
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview('/images/default-paper-cover.jpg');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!id && !materialFile) {
      alert('Please upload a PDF file for the study material');
      return;
    }

    if (formData.type === 'Paid' && formData.price <= 0) {
      alert('Please enter a valid price for paid material');
      return;
    }

    try {
      setSaving(true);

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'fileUrl' && key !== 'coverImage') {
          formDataToSend.append(key, String(formData[key as keyof StudyMaterialData]));
        }
      });

      if (coverImageFile) {
        formDataToSend.append('coverImage', coverImageFile);
      }

      if (materialFile) {
        formDataToSend.append('materialFile', materialFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      let response;
      if (id) {
        // Update
        response = await axios.put(
          `https://carrerpath-m48v.onrender.com/api/studymaterials/admin/${id}`,
          formDataToSend,
          config
        );
        alert('Study material updated successfully');
      } else {
        // Create
        response = await axios.post(
          'https://carrerpath-m48v.onrender.com/api/studymaterials/admin',
          formDataToSend,
          config
        );
        alert('Study material created successfully');
      }

      navigate('/admin/studymaterials');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save study material');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Study Material' : 'Add New Study Material'}
          </h1>
          <p className="text-gray-600 mt-2">
            {id ? 'Update the study material details' : 'Upload new previous year paper or study material'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="e.g., UPSC GS Paper I"
                />
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="e.g., 2023"
                />
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="e.g., General Studies, Mathematics"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages
                </label>
                <input
                  type="number"
                  name="pages"
                  value={formData.pages}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="Free"
                      checked={formData.type === 'Free'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Free</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="Paid"
                      checked={formData.type === 'Paid'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Paid</span>
                  </label>
                </div>
              </div>

              {/* Price (only for Paid) */}
              {formData.type === 'Paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the study material..."
              />
            </div>
          </div>

          {/* Files Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Files</h2>
            
            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Preview */}
                <div className="shrink-0">
                  <div className="relative w-48 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={coverImagePreview || '/images/default-paper-cover.jpg'}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                    {coverImagePreview && coverImagePreview !== '/images/default-paper-cover.jpg' && (
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload Area */}
                <div className="grow">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="coverImage"
                      onChange={handleCoverImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="coverImage"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">
                        Upload cover image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, GIF (Recommended: 300x400)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Study Material File (PDF) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Study Material File (PDF) {!id && '*'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="materialFile"
                  onChange={handleMaterialFileChange}
                  className="hidden"
                  accept=".pdf"
                />
                <label
                  htmlFor="materialFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FileText className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    {materialFile ? materialFile.name : 'Upload PDF File'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF files only (Max 50MB)
                  </p>
                  {id && formData.fileUrl && (
                    <p className="text-xs text-green-600 mt-2">
                      Current file: {formData.fileUrl.split('/').pop()}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/studymaterials')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                id ? 'Update Material' : 'Create Material'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminStudyMaterialEditPage;