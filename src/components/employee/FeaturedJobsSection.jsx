import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, X, MoveVertical } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeaturedJobsSection({ data, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    buttonText: 'Apply Now',
    buttonLink: '',
    displayOrder: 0,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      location: '',
      buttonText: 'Apply Now',
      buttonLink: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.location || !formData.buttonLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    let newData;
    if (editingItem) {
      newData = data.map(item => item.id === editingItem.id ? { ...formData, id: item.id } : item);
      toast.success('Job updated temporarily (Save page to persist)');
    } else {
      newData = [...data, { ...formData, id: Date.now() }];
      toast.success('Job added temporarily (Save page to persist)');
    }

    onChange('featuredJobs', newData.sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder)));
    handleCloseModal();
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    const newData = data.filter(item => item.id !== deletingId);
    onChange('featuredJobs', newData);
    setIsDeleteModalOpen(false);
    toast.success('Job removed (Save page to persist)');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header */}
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Featured Jobs</h2>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{data.length} Jobs</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleOpenModal(); }}
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Job
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
                <p>No featured jobs added yet.</p>
                <button onClick={() => handleOpenModal()} className="mt-2 text-orange-500 font-medium hover:underline">Add your first job</button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="p-4 font-medium w-20 text-center">Order</th>
                    <th className="p-4 font-medium">Job Title</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Location</th>
                    <th className="p-4 font-medium hidden md:table-cell">Button Text</th>
                    <th className="p-4 font-medium hidden lg:table-cell">Apply Link</th>
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
                        <p className="font-medium text-gray-800 text-sm">{item.jobTitle}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-sm text-gray-600">{item.location}</td>
                      <td className="p-4 hidden md:table-cell text-sm text-gray-600">{item.buttonText}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <a href={item.buttonLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate block max-w-[200px]">
                          {item.buttonLink}
                        </a>
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
              <h3 className="text-lg font-bold text-gray-800">{editingItem ? 'Edit Job' : 'Add New Job'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="jobForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Senior React Developer" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                  <input type="text" name="location" value={formData.location} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Remote, USA" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apply Button Text</label>
                    <input type="text" name="buttonText" value={formData.buttonText} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleFormChange} min="1" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apply Link <span className="text-red-500">*</span></label>
                  <input type="url" name="buttonLink" value={formData.buttonLink} onChange={handleFormChange} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="https://..." />
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
              <button type="submit" form="jobForm" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors shadow-sm">{editingItem ? 'Save Changes' : 'Add Job'}</button>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Job?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this job? This action cannot be undone.</p>
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
