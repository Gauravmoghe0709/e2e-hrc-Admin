import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Image as ImageIcon, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getWhoWeAre, saveWhoWeAre, uploadWhoWeAreImage } from '../../services/api';

const EMPTY_FORM = {
  title: '',
  paragraph1: '',
  image: '',
  experienceValue: '',
  experienceLabel: '',
  isActive: true,
};

export default function WhoWeAreSection() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getWhoWeAre();
      if (res && res.data) {
        setData({ ...EMPTY_FORM, ...res.data });
      }
    } catch (error) {
      if (!error.message?.includes('404')) {
        toast.error('Failed to load Who We Are data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prev => ({
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
      setData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setData(prev => ({ ...prev, image: '' }));
  };

  const handleSave = async () => {
    if (!data.title?.trim()) {
      toast.error('Title is required');
      return;
    }
    setIsSaving(true);
    try {
      let currentImage = data.image;
      if (imageFile) {
        const uploadRes = await uploadWhoWeAreImage(imageFile);
        if (uploadRes.success) {
          currentImage = uploadRes.data.image;
          setImageFile(null);
        }
      }
      
      const res = await saveWhoWeAre({
        ...data,
        image: currentImage
      });
      
      if (res && res.data) {
        setData({ ...EMPTY_FORM, ...res.data });
      }
      toast.success('Who We Are section saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save Who We Are section');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <div 
        className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-200 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Who We Are Section</h2>
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-500">Status:</span>
            <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
              <input type="checkbox" name="isActive" checked={data.isActive} onChange={handleChange} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
      </div>

      {isExpanded && (
        <>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" value={data.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Empowering Growth" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
                    <textarea name="paragraph1" value={data.paragraph1} onChange={handleChange} rows={5} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors resize-none" placeholder="Enter first paragraph..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience Value</label>
                      <input type="text" name="experienceValue" value={data.experienceValue} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. 15+" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience Label</label>
                      <input type="text" name="experienceLabel" value={data.experienceLabel} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-colors" placeholder="e.g. Years of Excellence" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Image</label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px] h-[calc(100%-1.75rem)]">
                    {data.image ? (
                      <>
                        <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => fileInputRef.current?.click()} className="bg-white text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                            Change
                          </button>
                          <button onClick={removeImage} className="bg-white text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 shadow-sm">
                            <X size={14} /> Remove
                          </button>
                        </div>
                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-orange-500 transition-colors">
                        <ImageIcon size={40} className="mb-3 text-gray-300" />
                        <span className="text-sm font-medium">Click to upload image</span>
                        <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm text-sm"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Who We Are'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
