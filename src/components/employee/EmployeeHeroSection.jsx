import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

export default function EmployeeHeroSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange('hero', {
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('hero', {
          ...data,
          [fieldName]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const ImageUploadField = ({ label, fieldName, value }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onChange('hero', { ...data, [fieldName]: '' })}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              title="Remove image"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <ImageIcon size={20} className="mb-1" />
            <span className="text-[10px] uppercase font-semibold">Upload</span>
          </div>
        )}
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, fieldName)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-2">Recommended: 800x800px (Max 2MB)</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Hero Section</h2>
        </div>
        <div className="flex items-center gap-4">
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" name="subtitle" value={data?.subtitle || ''} onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                  placeholder="e.g. Empowering Your Career" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={data?.title || ''} onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                  placeholder="e.g. Find Your Dream Job" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={data?.description || ''} onChange={handleFormChange} rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none"
                  placeholder="Brief description about employee services..." />
              </div>
            </div>

            <div className="space-y-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
              <ImageUploadField label="Left Image" fieldName="leftImage" value={data?.leftImage} />
              <hr className="border-gray-200" />
              <ImageUploadField label="Center Image" fieldName="centerImage" value={data?.centerImage} />
              <hr className="border-gray-200" />
              <ImageUploadField label="Right Image" fieldName="rightImage" value={data?.rightImage} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isActive" checked={data?.isActive ?? true} onChange={handleFormChange} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
                <span className="text-sm text-gray-600">{(data?.isActive ?? true) ? 'Active' : 'Inactive'}</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
