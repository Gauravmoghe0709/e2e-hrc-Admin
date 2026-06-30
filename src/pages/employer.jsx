import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

// Reusing the existing AboutHeroSection — it has all the required fields:
// mainTitle, description, button1Text, button1Link, button2Text, button2Link, heroImage
import AboutHeroSection from '../components/about/AboutHeroSection';
import FAQSection from '../components/employer/FAQSection';
import EmployerTestimonialsSection from '../components/employer/EmployerTestimonialsSection';

export default function EmployerManagement() {
  const [isSaving, setIsSaving] = useState(false);

  // ── Overall Page State ───────────────────────────────────────────────────────
  const [pageData, setPageData] = useState({
    hero: {
      mainTitle: '',
      description: '',
      button1Text: '',
      button1Link: '',
      button2Text: '',
      button2Link: '',
      heroImage: '',
      isActive: true,
    },
    faqs: [],
    testimonials: [],
  });

  // ── Section Change Handler ───────────────────────────────────────────────────
  const handleSectionChange = (section, data) => {
    setPageData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  // ── Save Handler with Validation ─────────────────────────────────────────────
  const handleSave = async () => {
    if (!pageData.hero.mainTitle?.trim()) {
      toast.error('Hero section requires a Main Title.');
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Employer Page Saved Payload:', JSON.stringify(pageData, null, 2));
      toast.success('Employer page content saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employer Page Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all the content blocks displayed on the Employer page.
        </p>
      </div>

      {/* ── Sections ─────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Reusing the shared AboutHeroSection — onChange maps to 'hero' key */}
        <AboutHeroSection data={pageData.hero} onChange={handleSectionChange} />

        <FAQSection data={pageData.faqs} onChange={handleSectionChange} />

        <EmployerTestimonialsSection data={pageData.testimonials} onChange={handleSectionChange} />
      </div>

      {/* ── Sticky Save Bar ───────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-72 bg-white border-t border-gray-200 p-4 px-6 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <p className="text-sm text-gray-500 hidden sm:block">
          Don't forget to save your changes.
        </p>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}