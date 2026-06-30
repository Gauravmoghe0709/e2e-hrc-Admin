import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, X, MoveVertical, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestimonialsSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    testimonialTitle: '',
    review: '',
    companyLogo: '',
    displayOrder: 0,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      companyName: '',
      testimonialTitle: '',
      review: '',
      companyLogo: '',
      displayOrder: data.length + 1,
      isActive: true
    });
    setEditingItem(null);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, companyLogo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.testimonialTitle || !formData.review) {
      toast.error('Please fill in all required fields');
      return;
    }

    let newData;
    if (editingItem) {
      newData = data.map(item => item.id === editingItem.id ? { ...formData, id: item.id } : item);
      toast.success('Testimonial updated temporarily (Save page to persist)');
    } else {
      newData = [...data, { ...formData, id: Date.now() }];
      toast.success('Testimonial added temporarily (Save page to persist)');
    }

    onChange('testimonials', newData.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder)));
    handleCloseModal();
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const newData = data.filter(item => item.id !== deletingId);
    onChange('testimonials', newData);
    setIsDeleteModalOpen(false);
    toast.success('Testimonial removed (Save page to persist)');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Testimonials</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{data.length} Items</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenModal(); }}
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Testimonial
          </button>
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-0">
          <div className="overflow-x-auto">
            {data.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No testimonials added yet.</p>
                <button onClick={() => handleOpenModal()} className="mt-2 text-orange-500 font-medium hover:underline">Add first testimonial</button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-medium w-20 text-center">Order</th>
                    <th className="p-4 font-medium">Logo</th>
                    <th className="p-4 font-medium">Company Name</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Title</th>
                    <th className="p-4 font-medium hidden md:table-cell">Review Preview</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-500">
                          <MoveVertical size={14} className="opacity-50" />
                          <span className="font-medium text-sm">{item.displayOrder}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                          {item.companyLogo ? (
                            <img src={item.companyLogo} alt={item.companyName} className="w-full h-full object-contain p-1" />
                          ) : (
                            <ImageIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800 text-sm">{item.companyName}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-gray-600">{item.testimonialTitle}</td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm text-gray-500 truncate max-w-xs">{item.review}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => confirmDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="testimonialForm" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    {formData.companyLogo ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 p-1 bg-gray-50">
                        <img src={formData.companyLogo} alt="Preview" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setFormData(prev => ({ ...prev, companyLogo: '' }))} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Trash2 size={16} className="text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                        <ImageIcon size={16} />
                      </div>
                    )}
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Title <span className="text-red-500">*</span></label>
                    <input type="text" name="testimonialTitle" value={formData.testimonialTitle} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Excellent service!" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review <span className="text-red-500">*</span></label>
                  <textarea name="review" value={formData.review} onChange={handleFormChange} required rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none" placeholder="The full review text..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleFormChange} min="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" />
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-600">{formData.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" form="testimonialForm" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">{editingItem ? 'Save Changes' : 'Add Testimonial'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Testimonial?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this record? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
