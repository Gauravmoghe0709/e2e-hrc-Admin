import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, X, TrendingUp, ExternalLink } from 'lucide-react';

export default function TrendingNowSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    blogLink: '',
    displayOrder: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const items = data || [];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.category.trim()) errs.category = 'Category is required.';
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.blogLink.trim()) errs.blogLink = 'Blog link is required.';
    return errs;
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({ category: '', title: '', blogLink: '', displayOrder: items.length + 1, isActive: true });
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
    onChange('trendingNow', updated);
    setIsModalOpen(false);
  };

  const deleteItem = () => {
    if (editingIndex !== null) onChange('trendingNow', items.filter((_, i) => i !== editingIndex));
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
          <h2 className="text-lg font-semibold text-gray-800">Trending Now Section</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{items.length} Items</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); openAddModal(); }}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Trending
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
                <TrendingUp size={24} className="text-orange-400" />
              </div>
              <p className="text-gray-500 text-sm">No trending items yet. Click <strong>Add Trending</strong> to create one.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium hidden md:table-cell">Blog Link</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-medium">{item.displayOrder}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-blue-50 text-blue-600">{item.category}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {item.blogLink ? (
                        <a href={item.blogLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm transition-colors">
                          <ExternalLink size={13} /> View Link
                        </a>
                      ) : <span className="text-gray-400 text-sm">—</span>}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingIndex !== null ? 'Edit Trending Item' : 'Add Trending Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                  <input type="text" name="category" value={formData.category} onChange={handleFormChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.category ? 'border-red-400' : 'border-gray-200'}`}
                    placeholder="e.g. HR Trends" />
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                    min={1} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleFormChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="e.g. Top 10 Recruitment Strategies for 2025" />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Link <span className="text-red-500">*</span></label>
                <input type="url" name="blogLink" value={formData.blogLink} onChange={handleFormChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.blogLink ? 'border-red-400' : 'border-gray-200'}`}
                  placeholder="https://example.com/blog/..." />
                {errors.blogLink && <p className="text-xs text-red-500 mt-1">{errors.blogLink}</p>}
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

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveItem} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                {editingIndex !== null ? 'Update Item' : 'Add Item'}
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Trending Item?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
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
