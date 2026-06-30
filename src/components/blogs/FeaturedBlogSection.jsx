import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, Image as ImageIcon, X, Star } from 'lucide-react';

export default function FeaturedBlogSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    blogTitle: '',
    shortDescription: '',
    featuredImage: '',
    publishedDate: '',
    readTime: '',
    isFeatured: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const items = data || [];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, featuredImage: url }));
    }
  };

  const removeImage = () => setFormData(prev => ({ ...prev, featuredImage: '' }));

  const validate = () => {
    const errs = {};
    if (!formData.blogTitle.trim()) errs.blogTitle = 'Blog title is required.';
    if (!formData.shortDescription.trim()) errs.shortDescription = 'Short description is required.';
    if (!formData.publishedDate) errs.publishedDate = 'Published date is required.';
    if (!formData.readTime.trim()) errs.readTime = 'Read time is required.';
    return errs;
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({ blogTitle: '', shortDescription: '', featuredImage: '', publishedDate: '', readTime: '', isFeatured: false, isActive: true });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    setEditingIndex(idx);
    setFormData(items[idx]);
    setErrors({});
    setIsModalOpen(true);
  };

  const openDeleteModal = (idx) => {
    setEditingIndex(idx);
    setIsDeleteModalOpen(true);
  };

  const saveItem = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const updated = [...items];
    if (editingIndex !== null) updated[editingIndex] = formData;
    else updated.push(formData);
    onChange('featuredBlogs', updated);
    setIsModalOpen(false);
  };

  const deleteItem = () => {
    if (editingIndex !== null) onChange('featuredBlogs', items.filter((_, i) => i !== editingIndex));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Featured Blog Section</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{items.length} Blogs</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); openAddModal(); }}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Blog
          </button>
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {/* Table */}
      {isExpanded && (
        <div className="p-0 overflow-x-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3">
                <Star size={24} className="text-orange-400" />
              </div>
              <p className="text-gray-500 text-sm">No featured blogs yet. Click <strong>Add Blog</strong> to create one.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Blog Title</th>
                  <th className="p-4 font-medium hidden md:table-cell">Published Date</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Read Time</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Featured</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {item.featuredImage ? (
                        <img src={item.featuredImage} alt={item.blogTitle} className="w-12 h-10 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-sm">{item.blogTitle}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[160px]">{item.shortDescription}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-500">{item.publishedDate}</td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500">{item.readTime}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${item.isFeatured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openEditModal(idx)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => openDeleteModal(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingIndex !== null ? 'Edit Featured Blog' : 'Add Featured Blog'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Left */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
                    <input type="text" name="blogTitle" value={formData.blogTitle} onChange={handleFormChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.blogTitle ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="e.g. Top HR Trends in 2025" />
                    {errors.blogTitle && <p className="text-xs text-red-500 mt-1">{errors.blogTitle}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleFormChange} rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none ${errors.shortDescription ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Brief summary of the blog..." />
                    {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Published Date <span className="text-red-500">*</span></label>
                      <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.publishedDate ? 'border-red-400' : 'border-gray-200'}`} />
                      {errors.publishedDate && <p className="text-xs text-red-500 mt-1">{errors.publishedDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Read Time <span className="text-red-500">*</span></label>
                      <input type="text" name="readTime" value={formData.readTime} onChange={handleFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.readTime ? 'border-red-400' : 'border-gray-200'}`}
                        placeholder="e.g. 5 min" />
                      {errors.readTime && <p className="text-xs text-red-500 mt-1">{errors.readTime}</p>}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Is Featured</label>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleFormChange} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-sm text-gray-600">{formData.isFeatured ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-sm text-gray-600">{formData.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right – Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center relative overflow-hidden group h-52">
                    {formData.featuredImage ? (
                      <>
                        <img src={formData.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={removeImage} className="bg-white text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                            <X size={14} /> Remove
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-orange-500 transition-colors">
                        <ImageIcon size={28} className="mb-2" />
                        <span className="text-sm font-medium">Upload Featured Image</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveItem} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                {editingIndex !== null ? 'Update Blog' : 'Add Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Featured Blog?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this blog entry? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={deleteItem} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
