import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAboutTestimonials, createAboutTestimonial, updateAboutTestimonial, deleteAboutTestimonial } from '../../services/api';

const EMPTY_FORM = {
  badgeText: 'Testimonials',
  sectionTitle: 'What They Are Saying',
  highlightText: 'Saying',
  sectionDescription: 'Discover the stories and experiences of individuals and companies who have found success and excellence through E2E HRC.',
  testimonialTitle: '',
  review: '',
  companyName: '',
  order: 0,
  isActive: true,
};

export default function TestimonialsSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    setIsLoading(true);
    try {
      const res = await getAboutTestimonials();
      setTestimonials(res.data || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, order: testimonials.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      badgeText: item.badgeText || 'Testimonials',
      sectionTitle: item.sectionTitle || 'What They Are Saying',
      highlightText: item.highlightText || 'Saying',
      sectionDescription: item.sectionDescription || 'Discover the stories and experiences of individuals and companies who have found success and excellence through E2E HRC.',
      testimonialTitle: item.testimonialTitle || '',
      review: item.review || '',
      companyName: item.companyName || '',
      order: item.order ?? 0,
      isActive: item.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setEditingId(id);
    setIsDeleteModalOpen(true);
  };

  const saveTestimonial = async () => {
    if (!formData.review.trim()) {
      toast.error('Review text is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        badgeText: formData.badgeText,
        sectionTitle: formData.sectionTitle,
        highlightText: formData.highlightText,
        sectionDescription: formData.sectionDescription,
        testimonialTitle: formData.testimonialTitle,
        review: formData.review,
        companyName: formData.companyName,
        order: Number(formData.order),
        isActive: formData.isActive,
      };

      if (editingId) {
        await updateAboutTestimonial(editingId, payload);
      } else {
        await createAboutTestimonial(payload);
      }

      toast.success(editingId ? 'Testimonial updated successfully' : 'Testimonial added successfully');
      setIsModalOpen(false);
      loadTestimonials();
    } catch (error) {
      toast.error(error.message || 'Failed to save testimonial');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTestimonial = async () => {
    if (!editingId) return;
    setIsDeleting(true);
    try {
      await deleteAboutTestimonial(editingId);
      toast.success('Testimonial deleted successfully');
      setIsDeleteModalOpen(false);
      loadTestimonials();
    } catch (error) {
      toast.error(error.message || 'Failed to delete testimonial');
    } finally {
      setIsDeleting(false);
    }
  };

  const truncate = (str, len = 60) => (str && str.length > len ? `${str.slice(0, len)}…` : str);

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        className="flex cursor-pointer select-none items-center justify-between border-b border-gray-200 bg-gray-50 p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Testimonials Section</h2>
          {isLoading ? (
            <span className="animate-pulse rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-400">Loading...</span>
          ) : (
            <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600">{testimonials.length} Items</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openAddModal();
            }}
            className="flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            <Plus size={16} /> Add Testimonial
          </button>
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto p-0">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No testimonials added yet. Click "Add Testimonial" to create one.</div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-white text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Review</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Company</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-gray-50">
                    <td className="p-4 text-sm font-semibold text-gray-800">
                      {item.testimonialTitle || 'Client Feedback'}
                      <p className="text-xs font-normal text-gray-500">{item.companyName}</p>
                    </td>
                    <td className="max-w-xs p-4 text-sm text-gray-500">{truncate(item.review)}</td>
                    <td className="hidden p-4 text-sm text-gray-500 sm:table-cell">{item.companyName}</td>
                    <td className="hidden p-4 text-sm text-gray-500 sm:table-cell">{item.order}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="space-x-2 p-4 text-right">
                      <button onClick={() => openEditModal(item)} className="rounded-md p-1.5 text-blue-500 transition-colors hover:bg-blue-50" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => openDeleteModal(item._id)} className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 transition-colors hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Badge Text</label>
                    <input type="text" name="badgeText" value={formData.badgeText} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="e.g. Testimonials" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Section Title</label>
                    <input type="text" name="sectionTitle" value={formData.sectionTitle} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="e.g. What They Are Saying" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Highlight Text</label>
                    <input type="text" name="highlightText" value={formData.highlightText} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="e.g. Saying" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Section Description</label>
                    <textarea name="sectionDescription" value={formData.sectionDescription} onChange={handleFormChange} rows={3} className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Section intro text..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Testimonial Title</label>
                    <input type="text" name="testimonialTitle" value={formData.testimonialTitle} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="e.g. Efficient and Effective Hiring Process!" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Review <span className="text-red-500">*</span></label>
                    <textarea name="review" value={formData.review} onChange={handleFormChange} rows={5} className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Testimonial review text..." />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="e.g. Ford" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Display Order</label>
                      <input type="number" name="order" value={formData.order} onChange={handleFormChange} className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="peer sr-only" />
                          <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-500 peer-checked:after:translate-x-full peer-focus:outline-none"></div>
                        </label>
                        <span className="text-sm text-gray-600">{formData.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={saveTestimonial} disabled={isSaving} className="flex items-center gap-2 rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : 'Save Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
              <Trash2 size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Testimonial?</h3>
            <p className="mb-6 text-sm text-gray-500">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={deleteTestimonial} disabled={isDeleting} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-600">
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
