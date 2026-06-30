import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function OfficeInfoSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const [errors, setErrors] = useState({});

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange('officeInfo', {
      ...data,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Office Information</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Title <span className="text-red-500">*</span></label>
                <input type="text" name="officeTitle" value={data?.officeTitle || ''} onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                  placeholder="e.g. Corporate Headquarters" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                <textarea name="address" value={data?.address || ''} onChange={handleFormChange} rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none"
                  placeholder="Full office address..." />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours <span className="text-red-500">*</span></label>
                <textarea name="openingHours" value={data?.openingHours || ''} onChange={handleFormChange} rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none"
                  placeholder="e.g. Mon-Fri: 9:00 AM - 6:00 PM" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Global Enquiries Text</label>
                <textarea name="globalEnquiriesText" value={data?.globalEnquiriesText || ''} onChange={handleFormChange} rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none"
                  placeholder="Text for global enquiries..." />
              </div>
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
