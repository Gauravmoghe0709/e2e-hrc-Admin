import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  Plus, Edit2, Trash2, X, Search, Filter, Image as ImageIcon,
  ChevronLeft, ChevronRight, Eye, Star, Tag, Loader2
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const ITEMS_PER_PAGE = 8;

const STATUS_OPTIONS = ['Draft', 'Pending', 'Published'];
const CATEGORY_OPTIONS = ['HR Strategy', 'Recruitment', 'Leadership', 'Workplace Culture', 'Technology', 'Industry Insights', 'Career Development', 'Other'];

const statusColors = {
  Draft: 'bg-gray-100 text-gray-600',
  Pending: 'bg-yellow-100 text-yellow-700',
  Published: 'bg-green-100 text-green-700',
};

const EMPTY_FORM = {
  blogTitle: '',
  slug: '',
  category: '',
  featuredImage: '',
  shortDescription: '',
  blogContent: '',
  authorName: '',
  authorDesignation: '',
  authorImage: '',
  publishedDate: '',
  readTime: '',
  tags: [],
  isFeatured: false,
  status: 'Draft',
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, name }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
  </label>
);

// ─── Image Upload Area ────────────────────────────────────────────────────────
const ImageUploadArea = ({ value, onChange, onRemove, label, height = 'h-40' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className={`mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center relative overflow-hidden group ${height}`}>
      {value ? (
        <>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={onRemove} className="bg-white text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
              <X size={14} /> Remove
            </button>
          </div>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-orange-500 transition-colors">
          <ImageIcon size={24} className="mb-2" />
          <span className="text-sm font-medium">Upload Image</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
          <input type="file" className="hidden" accept="image/*" onChange={onChange} />
        </label>
      )}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [viewingBlog, setViewingBlog] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterFeatured, setFilterFeatured] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-generate slug from title (add only)
  useEffect(() => {
    if (formData.blogTitle && editingIndex === null) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.blogTitle) }));
    }
  }, [formData.blogTitle, editingIndex]);

  // ── Filtering & Pagination ──────────────────────────────────────────────────
  const filtered = blogs.filter(b => {
    const matchSearch = !searchQuery ||
      b.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || b.status === filterStatus;
    const matchFeatured = filterFeatured === '' ? true : b.isFeatured === (filterFeatured === 'true');
    return matchSearch && matchStatus && matchFeatured;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Form Handlers ────────────────────────────────────────────────────────────
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, [field]: url }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, blogContent: value }));
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.blogTitle.trim()) errs.blogTitle = 'Blog title is required.';
    if (!formData.slug.trim()) errs.slug = 'Slug is required.';
    if (!formData.category.trim()) errs.category = 'Category is required.';
    if (!formData.shortDescription.trim()) errs.shortDescription = 'Short description is required.';
    if (!formData.authorName.trim()) errs.authorName = 'Author name is required.';
    return errs;
  };

  // ── Modal Openers ────────────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditingIndex(null);
    setFormData(EMPTY_FORM);
    setErrors({});
    setTagInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (idx) => {
    const realIdx = blogs.indexOf(filtered[(currentPage - 1) * ITEMS_PER_PAGE + idx]);
    setEditingIndex(realIdx);
    setFormData(blogs[realIdx]);
    setErrors({});
    setTagInput('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (idx) => {
    const realIdx = blogs.indexOf(filtered[(currentPage - 1) * ITEMS_PER_PAGE + idx]);
    setDeletingIndex(realIdx);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (blog) => {
    setViewingBlog(blog);
    setIsViewModalOpen(true);
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const saveBlog = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 900));

    const updated = [...blogs];
    if (editingIndex !== null) {
      updated[editingIndex] = formData;
      toast.success('Blog updated successfully!');
    } else {
      updated.push(formData);
      toast.success('Blog created successfully!');
    }
    setBlogs(updated);
    setIsModalOpen(false);
    setIsSaving(false);
    setCurrentPage(1);
  };

  const deleteBlog = () => {
    if (deletingIndex !== null) {
      setBlogs(prev => prev.filter((_, i) => i !== deletingIndex));
      toast.success('Blog deleted successfully!');
    }
    setIsDeleteModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, edit, publish, and manage blog posts.
        </p>
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 border-b border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">All Blog Posts</h2>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{blogs.length} Blogs</span>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} /> Add New Blog
          </button>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────────────── */}
        <div className="p-4 border-b border-gray-100 bg-white flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none text-sm transition-colors"
            />
          </div>
          {/* Status Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none text-sm bg-white transition-colors appearance-none"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {/* Featured Filter */}
          <select
            value={filterFeatured}
            onChange={(e) => { setFilterFeatured(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none text-sm bg-white transition-colors"
          >
            <option value="">All Blogs</option>
            <option value="true">Featured Only</option>
            <option value="false">Not Featured</option>
          </select>
        </div>

        {/* ── Table ────────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {blogs.length === 0 ? 'No blog posts yet' : 'No results found'}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                {blogs.length === 0
                  ? 'Click "Add New Blog" to create your first blog post.'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {blogs.length === 0 && (
                <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  <Plus size={16} /> Add New Blog
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Blog Title</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Slug</th>
                  <th className="p-4 font-medium hidden md:table-cell">Category</th>
                  <th className="p-4 font-medium hidden xl:table-cell">Author</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Date</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Featured</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((blog, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      {blog.featuredImage ? (
                        <img src={blog.featuredImage} alt={blog.blogTitle} className="w-12 h-10 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <p className="font-semibold text-gray-800 text-sm truncate">{blog.blogTitle}</p>
                      <p className="text-xs text-gray-400 truncate">{blog.shortDescription}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{blog.slug}</code>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{blog.category}</span>
                    </td>
                    <td className="p-4 hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        {blog.authorImage ? (
                          <img src={blog.authorImage} alt={blog.authorName} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                            {blog.authorName?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="text-sm text-gray-700 truncate max-w-[100px]">{blog.authorName}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-gray-500">{blog.publishedDate || '—'}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${blog.isFeatured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {blog.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${statusColors[blog.status] || 'bg-gray-100 text-gray-600'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openViewModal(blog)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" title="View">
                        <Eye size={15} />
                      </button>
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

        {/* ── Pagination ────────────────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> blogs
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === currentPage ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add/Edit Modal ─────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {editingIndex !== null ? 'Edit Blog Post' : 'Add New Blog Post'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Left Column ────────────────────────────────────────────── */}
                <div className="space-y-4">
                  {/* Blog Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title <span className="text-red-500">*</span></label>
                    <input type="text" name="blogTitle" value={formData.blogTitle} onChange={handleFormChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.blogTitle ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="e.g. Top HR Trends in 2025" />
                    {errors.blogTitle && <p className="text-xs text-red-500 mt-1">{errors.blogTitle}</p>}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug <span className="text-red-500">*</span>
                      <span className="ml-2 text-[10px] font-normal text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">Auto-generated</span>
                    </label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleFormChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors font-mono text-sm ${errors.slug ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="e.g. top-hr-trends-in-2025" />
                    {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <select name="category" value={formData.category} onChange={handleFormChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors bg-white ${errors.category ? 'border-red-400' : 'border-gray-200'}`}>
                      <option value="">Select a category</option>
                      {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-red-500">*</span></label>
                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleFormChange} rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none ${errors.shortDescription ? 'border-red-400' : 'border-gray-200'}`}
                      placeholder="Brief summary of the blog..." />
                    {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
                  </div>

                  {/* Author Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author Name <span className="text-red-500">*</span></label>
                      <input type="text" name="authorName" value={formData.authorName} onChange={handleFormChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors ${errors.authorName ? 'border-red-400' : 'border-gray-200'}`}
                        placeholder="e.g. Jane Smith" />
                      {errors.authorName && <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Author Designation</label>
                      <input type="text" name="authorDesignation" value={formData.authorDesignation} onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                        placeholder="e.g. HR Director" />
                    </div>
                  </div>

                  {/* Date & Read Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
                      <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (min)</label>
                      <input type="number" name="readTime" value={formData.readTime} onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors"
                        placeholder="5" min={1} />
                    </div>
                  </div>

                  {/* Status & Featured */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" value={formData.status} onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors bg-white">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Featured Blog</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Toggle checked={formData.isFeatured} onChange={handleFormChange} name="isFeatured" />
                        <span className="text-sm text-gray-600">{formData.isFeatured ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                      <span className="ml-2 text-xs font-normal text-gray-400">Press Enter to add</span>
                    </label>
                    <div className={`w-full min-h-[42px] px-3 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-400 transition-colors flex flex-wrap gap-1.5 items-center`}>
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          <Tag size={10} /> {tag}
                          <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors ml-0.5">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="outline-none text-sm flex-1 min-w-[100px] bg-transparent"
                        placeholder={formData.tags.length === 0 ? "Add tags..." : ""}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Right Column ────────────────────────────────────────────── */}
                <div className="space-y-4">
                  {/* Featured Image */}
                  <ImageUploadArea
                    label="Featured Image"
                    value={formData.featuredImage}
                    onChange={handleImageChange('featuredImage')}
                    onRemove={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                    height="h-48"
                  />

                  {/* Author Image */}
                  <ImageUploadArea
                    label="Author Image"
                    value={formData.authorImage}
                    onChange={handleImageChange('authorImage')}
                    onRemove={() => setFormData(prev => ({ ...prev, authorImage: '' }))}
                    height="h-32"
                  />
                </div>

                {/* ── Full Width: Rich Text Editor ─────────────────────────────── */}
                <div className="col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={formData.blogContent}
                      onChange={handleContentChange}
                      className="h-56 mb-10"
                      placeholder="Write your blog content here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl flex-shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveBlog} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors shadow-sm">
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                {isSaving ? 'Saving...' : editingIndex !== null ? 'Update Blog' : 'Publish Blog'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ────────────────────────────────────────────────────────── */}
      {isViewModalOpen && viewingBlog && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Blog Preview</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {viewingBlog.featuredImage && (
                <img src={viewingBlog.featuredImage} alt={viewingBlog.blogTitle} className="w-full h-48 object-cover rounded-xl mb-5 border border-gray-100" />
              )}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{viewingBlog.category}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${statusColors[viewingBlog.status]}`}>{viewingBlog.status}</span>
                {viewingBlog.isFeatured && <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-blue-100 text-blue-700">Featured</span>}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{viewingBlog.blogTitle}</h2>
              <code className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-3 inline-block">{viewingBlog.slug}</code>
              <p className="text-sm text-gray-500 mb-4">{viewingBlog.shortDescription}</p>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                {viewingBlog.authorImage ? (
                  <img src={viewingBlog.authorImage} alt={viewingBlog.authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {viewingBlog.authorName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{viewingBlog.authorName}</p>
                  <p className="text-xs text-gray-400">{viewingBlog.authorDesignation}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-gray-400">{viewingBlog.publishedDate || 'No date'}</p>
                  {viewingBlog.readTime && <p className="text-xs text-gray-400">{viewingBlog.readTime} min read</p>}
                </div>
              </div>

              {viewingBlog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {viewingBlog.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      <Tag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {viewingBlog.blogContent && (
                <div className="prose prose-sm max-w-none text-gray-600 border-t border-gray-100 pt-4" dangerouslySetInnerHTML={{ __html: viewingBlog.blogContent }} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ───────────────────────────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Blog Post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{blogs[deletingIndex]?.blogTitle}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={deleteBlog} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
