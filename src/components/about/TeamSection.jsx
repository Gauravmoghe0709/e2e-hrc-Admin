import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Plus, Edit2, Trash2, Image as ImageIcon, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember, uploadTeamMemberImage } from '../../services/api';

const EMPTY_FORM = {
  fullName: '',
  designation: '',
  profileImage: '',
  order: 0,
  isActive: true
};

export default function TeamSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const res = await getTeamMembers();
      setTeamMembers(res.data || []);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
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
      setFormData(prev => ({ ...prev, profileImage: URL.createObjectURL(file) }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setFormData(prev => ({ ...prev, profileImage: '' }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setImageFile(null);
    setFormData({ ...EMPTY_FORM, order: teamMembers.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member._id);
    setImageFile(null);
    setFormData({
      fullName: member.fullName || '',
      designation: member.designation || '',
      profileImage: member.profileImage || '',
      order: member.order ?? 0,
      isActive: member.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setEditingId(id);
    setIsDeleteModalOpen(true);
  };

  const saveMember = async () => {
    if (!formData.fullName.trim() || !formData.designation.trim()) {
      toast.error('Name and designation are required');
      return;
    }

    setIsSaving(true);
    try {
      let savedMember;
      const payload = {
        fullName: formData.fullName,
        designation: formData.designation,
        order: Number(formData.order),
        isActive: formData.isActive
      };

      if (editingId) {
        const res = await updateTeamMember(editingId, payload);
        savedMember = res.data;
      } else {
        const res = await createTeamMember(payload);
        savedMember = res.data;
      }

      if (imageFile && savedMember._id) {
        try {
          await uploadTeamMemberImage(savedMember._id, imageFile);
        } catch (imgErr) {
          toast.error('Member saved but image upload failed');
        }
      }

      toast.success(editingId ? 'Member updated successfully' : 'Member added successfully');
      setIsModalOpen(false);
      loadMembers();
    } catch (error) {
      toast.error(error.message || 'Failed to save member');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMember = async () => {
    if (!editingId) return;
    setIsDeleting(true);
    try {
      await deleteTeamMember(editingId);
      toast.success('Member deleted successfully');
      setIsDeleteModalOpen(false);
      loadMembers();
    } catch (error) {
      toast.error(error.message || 'Failed to delete member');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Team Section</h2>
          {isLoading ? (
            <span className="bg-gray-100 text-gray-400 text-xs font-bold px-2 py-1 rounded-md animate-pulse">Loading...</span>
          ) : (
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{teamMembers.length} Members</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); openAddModal(); }}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Member
          </button>
          {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
          ) : teamMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No team members added yet. Click "Add Member" to create one.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Full Name</th>
                  <th className="p-4 font-medium">Designation</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Order</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {member.profileImage ? (
                        <img src={member.profileImage} alt={member.fullName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-800 text-sm">{member.fullName}</td>
                    <td className="p-4 text-sm text-gray-500">{member.designation}</td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500">{member.order}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(member)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => openDeleteModal(member._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. CEO" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                      <input type="number" name="order" value={formData.order} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="mt-2 flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-sm text-gray-600">{formData.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center relative overflow-hidden group h-48">
                      {formData.profileImage ? (
                        <>
                          <img src={formData.profileImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm mr-2">
                              Change
                            </button>
                            <button type="button" onClick={removeImage} className="bg-white text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                              <X size={14} /> Remove
                            </button>
                          </div>
                          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-orange-500 transition-colors">
                          <ImageIcon size={24} className="mb-2" />
                          <span className="text-xs font-medium">Upload Image</span>
                          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveMember} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex items-center gap-2">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Member?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this team member? This action cannot be undone.</p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={deleteMember} disabled={isDeleting} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-lg hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2">
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
