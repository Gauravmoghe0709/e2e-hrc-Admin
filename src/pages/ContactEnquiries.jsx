import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Search, Eye, Trash2, X, FileText, Download, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

// Mock data for demonstration
const MOCK_ENQUIRIES = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corp',
    emailAddress: 'john.doe@acmecorp.com',
    userType: 'Employer',
    subject: 'Hiring Services',
    message: 'We are looking to hire 5 software engineers for our new project.',
    attachment: 'requirements.pdf',
    submittedDate: '2025-01-15',
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'Tech Solutions',
    emailAddress: 'jane@techsolutions.com',
    userType: 'Candidate',
    subject: 'Job Application',
    message: 'I would like to apply for the Senior Developer role.',
    attachment: 'resume_jane.pdf',
    submittedDate: '2025-01-14',
  },
  {
    id: 3,
    firstName: 'Alice',
    lastName: 'Johnson',
    company: 'Global HR',
    emailAddress: 'alice@globalhr.com',
    userType: 'Partner',
    subject: 'Partnership Inquiry',
    message: 'Interested in partnering with your agency for international recruitment.',
    attachment: '',
    submittedDate: '2025-01-10',
  }
];

const ITEMS_PER_PAGE = 8;

export default function ContactEnquiries() {
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewingEnquiry, setViewingEnquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Filtering & Pagination ──────────────────────────────────────────────────
  const filtered = enquiries.filter(eq => {
    const term = searchQuery.toLowerCase();
    return (
      eq.firstName.toLowerCase().includes(term) ||
      eq.lastName.toLowerCase().includes(term) ||
      eq.company.toLowerCase().includes(term) ||
      eq.emailAddress.toLowerCase().includes(term) ||
      eq.subject.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const openViewModal = (enquiry) => {
    setViewingEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteEnquiry = () => {
    if (deletingId !== null) {
      setEnquiries(prev => prev.filter(eq => eq.id !== deletingId));
      toast.success('Enquiry deleted successfully!');
    }
    setIsDeleteModalOpen(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage customer enquiries submitted through the website.
        </p>
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 border-b border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">All Enquiries</h2>
            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">{enquiries.length} Total</span>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────────────── */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company, or subject..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none text-sm transition-colors"
            />
          </div>
        </div>

        {/* ── Table ────────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <Inbox size={28} className="text-orange-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {enquiries.length === 0 ? 'No enquiries yet' : 'No results found'}
              </h3>
              <p className="text-sm text-gray-400">
                {enquiries.length === 0
                  ? 'When users submit the contact form, their enquiries will appear here.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium hidden md:table-cell">Email Address</th>
                  <th className="p-4 font-medium hidden xl:table-cell">Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((eq) => (
                  <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-800 text-sm">{eq.firstName} {eq.lastName}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <a href={`mailto:${eq.emailAddress}`} className="text-sm text-blue-500 hover:underline">{eq.emailAddress}</a>
                    </td>
                    <td className="p-4 hidden xl:table-cell text-sm text-gray-500">{eq.submittedDate}</td>
                    <td className="p-4 text-right space-x-1">
                      <button onClick={() => openViewModal(eq)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors" title="View">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => openDeleteModal(eq.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete">
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
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> enquiries
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

      {/* ── View Modal ────────────────────────────────────────────────────────── */}
      {isViewModalOpen && viewingEnquiry && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-800">Enquiry Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">First Name</p>
                  <p className="text-sm text-gray-800">{viewingEnquiry.firstName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
                  <p className="text-sm text-gray-800">{viewingEnquiry.lastName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Company</p>
                  <p className="text-sm text-gray-800">{viewingEnquiry.company || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                  <a href={`mailto:${viewingEnquiry.emailAddress}`} className="text-sm text-blue-500 hover:underline">{viewingEnquiry.emailAddress}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">I Am A</p>
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase rounded-full bg-gray-100 text-gray-600">
                    {viewingEnquiry.userType}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Submission Date</p>
                  <p className="text-sm text-gray-800">{viewingEnquiry.submittedDate}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm font-medium text-gray-900 mb-4">{viewingEnquiry.subject}</p>

                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Message</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingEnquiry.message}</p>
                </div>
              </div>

              {viewingEnquiry.attachment && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Attachment</p>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white w-max pr-6">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <FileText size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{viewingEnquiry.attachment}</p>
                      <button className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors mt-0.5">
                        <Download size={12} /> Download File
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Close
              </button>
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
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Enquiry?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this enquiry? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={deleteEnquiry} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
