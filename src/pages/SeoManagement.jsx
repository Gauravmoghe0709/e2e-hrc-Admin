import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { ChevronDown, ChevronUp, Image as ImageIcon, X, Save, Loader2, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllSEO, createSEO, updateSEO, updateSEOImage, deleteSEO } from '../services/seo/seoService';

const PAGE_OPTIONS = [
  "Home",
  "About Us",
  "Employer",
  "Employee",
  "Workforce Solutions",
  "Contact",
  "Custom"
];

const ROBOT_OPTIONS = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow"
];

const EMPTY_FORM = {
  pageNameSelect: "Home",
  pageNameCustom: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  robots: "index, follow",
  ogImage: "",
  isActive: true,
};

export default function SeoManagement() {
  const [seoRecords, setSeoRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  
  const [data, setData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setIsLoading(true);
    try {
      const res = await getAllSEO();
      if (res && res.success) {
        setSeoRecords(res.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load SEO records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (record) => {
    const isCustom = !PAGE_OPTIONS.includes(record.pageName) && record.pageName;
    
    setData({
      pageNameSelect: isCustom ? "Custom" : record.pageName,
      pageNameCustom: isCustom ? record.pageName : "",
      metaTitle: record.metaTitle || "",
      metaDescription: record.metaDescription || "",
      metaKeywords: record.metaKeywords || "",
      canonicalUrl: record.canonicalUrl || "",
      ogTitle: record.ogTitle || "",
      ogDescription: record.ogDescription || "",
      robots: record.robots || "index, follow",
      ogImage: record.ogImage || "",
      isActive: record.isActive ?? true,
    });
    setEditingId(record._id);
    setImageFile(null);
    setIsExpanded(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this SEO record?")) return;
    try {
      const res = await deleteSEO(id);
      if (res.success) {
        toast.success("SEO record deleted successfully");
        if (editingId === id) resetForm();
        loadRecords();
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete SEO record");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setData(prev => ({ ...prev, ogImage: URL.createObjectURL(file) }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setData(prev => ({ ...prev, ogImage: '' }));
  };

  const resetForm = () => {
    setData(EMPTY_FORM);
    setEditingId(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    const finalPageName = data.pageNameSelect === "Custom" ? data.pageNameCustom : data.pageNameSelect;
    
    if (!finalPageName?.trim()) {
      toast.error('Page Name is required');
      return;
    }
    if (!data.metaTitle?.trim()) {
      toast.error('Meta Title is required');
      return;
    }
    if (!data.metaDescription?.trim()) {
      toast.error('Meta Description is required');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Update
        const updateData = {
          pageName: finalPageName.trim(),
          metaTitle: data.metaTitle.trim(),
          metaDescription: data.metaDescription.trim(),
          metaKeywords: data.metaKeywords.trim(),
          canonicalUrl: data.canonicalUrl.trim(),
          ogTitle: data.ogTitle.trim(),
          ogDescription: data.ogDescription.trim(),
          robots: data.robots,
          isActive: data.isActive
        };

        await updateSEO(editingId, updateData);
        
        if (imageFile) {
          const formData = new FormData();
          formData.append('ogImage', imageFile);
          await updateSEOImage(editingId, formData);
        }

        toast.success('SEO record updated successfully!');
      } else {
        // Create
        const formData = new FormData();
        formData.append('pageName', finalPageName.trim());
        formData.append('metaTitle', data.metaTitle.trim());
        formData.append('metaDescription', data.metaDescription.trim());
        formData.append('metaKeywords', data.metaKeywords.trim());
        formData.append('canonicalUrl', data.canonicalUrl.trim());
        formData.append('ogTitle', data.ogTitle.trim());
        formData.append('ogDescription', data.ogDescription.trim());
        formData.append('robots', data.robots);
        formData.append('isActive', data.isActive);
        if (imageFile) {
          formData.append('ogImage', imageFile);
        }

        await createSEO(formData);
        toast.success('SEO record created successfully!');
      }

      resetForm();
      loadRecords();
    } catch (error) {
      toast.error(error.message || 'Failed to save SEO record');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage meta tags, open graph data, and robots rules for each page.
          </p>
        </div>
        {editingId && (
          <button 
            onClick={resetForm}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 px-4 py-2 rounded-lg"
          >
            Cancel Edit / Create New
          </button>
        )}
      </div>

      {/* ── Form Section ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div 
          className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? `Edit SEO Record` : `Create New SEO Record`}
            </h2>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-gray-500">Active:</span>
              <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                <input type="checkbox" name="isActive" checked={data.isActive} onChange={handleChange} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>

        {isExpanded && (
          <>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Basic Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page Name <span className="text-red-500">*</span></label>
                    <select 
                      name="pageNameSelect" 
                      value={data.pageNameSelect} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                    >
                      {PAGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  {data.pageNameSelect === "Custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Page Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="pageNameCustom" 
                        value={data.pageNameCustom} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" 
                        placeholder="e.g. Services" 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title <span className="text-red-500">*</span></label>
                  <input type="text" name="metaTitle" value={data.metaTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="Page meta title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description <span className="text-red-500">*</span></label>
                  <textarea name="metaDescription" value={data.metaDescription} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none" placeholder="Page meta description..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                  <input type="text" name="metaKeywords" value={data.metaKeywords} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="keyword1, keyword2, keyword3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                    <input type="text" name="canonicalUrl" value={data.canonicalUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="https://" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Robots</label>
                    <select 
                      name="robots" 
                      value={data.robots} 
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                    >
                      {ROBOT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Open Graph & Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                  <input type="text" name="ogTitle" value={data.ogTitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="Open Graph Title" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                  <textarea name="ogDescription" value={data.ogDescription} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none" placeholder="Open Graph Description..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center relative overflow-hidden group h-[200px]">
                    {data.ogImage ? (
                      <>
                        <img src={data.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => fileInputRef.current?.click()} className="bg-white text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                            Change
                          </button>
                          <button onClick={removeImage} className="bg-white text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                            <X size={14} /> Remove
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-orange-500 transition-colors">
                        <ImageIcon size={40} className="mb-3 text-gray-300" />
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

            </div>
            
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm text-sm"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Saving...' : (editingId ? 'Update SEO' : 'Save SEO')}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── List Section ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All SEO Records</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
        ) : seoRecords.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No SEO records found. Create one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Page Name</th>
                  <th className="px-6 py-4 font-medium">Meta Title</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {seoRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{record.pageName}</td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-[250px]">{record.metaTitle}</td>
                    <td className="px-6 py-4">
                      {record.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
