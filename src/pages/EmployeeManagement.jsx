import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

import EmployeeHeroSection from '../components/employee/EmployeeHeroSection';
import FeaturedJobsSection from '../components/employee/FeaturedJobsSection';
import PeoplePlacedSection from '../components/employee/PeoplePlacedSection';
import TestimonialsSection from '../components/employee/TestimonialsSection';

export default function EmployeeManagement() {
  const [isSaving, setIsSaving] = useState(false);

  // Overall State
  const [pageData, setPageData] = useState({
    hero: {
      subtitle: '',
      title: '',
      description: '',
      leftImage: '',
      centerImage: '',
      rightImage: '',
      isActive: true
    },
    featuredJobs: [],
    peoplePlaced: [],
    testimonials: []
  });

  const handleSectionChange = (section, data) => {
    setPageData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = async () => {
    if (!pageData.hero.title) {
      toast.error("Hero section requires a Main Title");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Saved Payload:', JSON.stringify(pageData, null, 2));
      toast.success("Employee page content saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage employee page content dynamically</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <EmployeeHeroSection data={pageData.hero} onChange={handleSectionChange} />
        <FeaturedJobsSection data={pageData.featuredJobs} onChange={handleSectionChange} />
        <PeoplePlacedSection data={pageData.peoplePlaced} onChange={handleSectionChange} />
        <TestimonialsSection data={pageData.testimonials} onChange={handleSectionChange} />
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-72 bg-white border-t border-gray-200 p-4 px-6 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-between">
        <p className="text-sm text-gray-500 hidden sm:block">Don't forget to save your changes.</p>
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
