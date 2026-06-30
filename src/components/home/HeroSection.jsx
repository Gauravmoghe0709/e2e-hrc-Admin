import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, X, Upload, Save, Loader2 } from 'lucide-react';

export default function HeroSection({ data, onChange, onSave, isSaving, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange('hero', {
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    onChange('hero', { ...data, heroImage: imageUrl, heroImageFile: file });
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = () => {
    onChange('hero', { ...data, heroImage: '', heroImageFile: null });
  };

  const isActive = data.isActive !== undefined ? data.isActive : true;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header / Toggle */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-semibold text-gray-800">Hero Section</h2>

          {/* Active Status Toggle */}
          <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
            <label className="relative inline-flex items-center cursor-pointer gap-2">
              <input
                type="checkbox"
                name="isActive"
                className="sr-only peer"
                checked={isActive}
                onChange={handleChange}
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-gray-500 shrink-0" /> : <ChevronDown size={20} className="text-gray-500 shrink-0" />}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column — Text Fields */}
          <div className="space-y-4">
            {isLoading ? (
              // Skeleton loader
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                </div>
              ))
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={data.title || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                    placeholder="Enter main heading"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={data.subtitle || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                    placeholder="e.g. Trusted Recruitment Partner Across the UK"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={data.description || ''}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none"
                    placeholder="Enter hero description..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      name="buttonText"
                      value={data.buttonText || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                      placeholder="e.g. Hire Talent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={data.buttonLink || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column — Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px] h-[calc(100%-1.75rem)] transition-colors hover:border-orange-300">
              {isLoading ? (
                <div className="animate-pulse w-full h-full min-h-[300px] bg-gray-200 rounded-xl"></div>
              ) : data.heroImage ? (
                <>
                  <img
                    src={data.heroImage}
                    alt="Hero Preview"
                    className="w-full h-full object-contain rounded-xl"
                    style={{ minHeight: '300px' }}
                  />
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      <Upload size={14} /> Change
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-white text-red-500 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
                    >
                      <X size={14} /> Remove
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full min-h-[300px] text-gray-400 hover:text-orange-500 transition-colors p-6">
                  <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-orange-300" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Click to upload hero image</span>
                  <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Footer: Save Button */}
      {isExpanded && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm text-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      )}
    </div>
  );
}

