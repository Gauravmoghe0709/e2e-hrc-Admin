import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

import FeaturedBlogSection from '../components/blogs/FeaturedBlogSection';
import TrendingNowSection from '../components/blogs/TrendingNowSection';
import ExpertCategoriesSection from '../components/blogs/ExpertCategoriesSection';
import IndustryResourcesSection from '../components/blogs/IndustryResourcesSection';

export default function BlogServices() {
  const [isSaving, setIsSaving] = useState(false);

  const [pageData, setPageData] = useState({
    featuredBlogs: [],
    trendingNow: [],
    expertCategories: [],
    industryResources: [],
  });

  const handleSectionChange = (section, data) => {
    setPageData(prev => ({ ...prev, [section]: data }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Blog Services Saved Payload:', JSON.stringify(pageData, null, 2));
      toast.success('Blog Services content saved successfully!');
    } catch (error) {
      toast.error('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative md:mt-15 mt-5">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Services</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage blog page sections, sidebar widgets, resources, and featured content.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <FeaturedBlogSection data={pageData.featuredBlogs} onChange={handleSectionChange} />
        <TrendingNowSection data={pageData.trendingNow} onChange={handleSectionChange} />
        <ExpertCategoriesSection data={pageData.expertCategories} onChange={handleSectionChange} />
        <IndustryResourcesSection data={pageData.industryResources} onChange={handleSectionChange} />
      </div>

      {/* Sticky Save Bar */}
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
