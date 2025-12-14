import React, { useEffect, useState } from 'react'
import { ArrowLeft, Rocket, Check, Home, Wrench, Share2, BarChart2 } from "lucide-react";
import { useRouter } from "next/router";

const FormHeader = ({
  isEditingTitle,
  formTitle,
  setFormTitle,
  setIsEditingTitle,
  handleSave,
  form,
}) => {

  const router = useRouter();
  const formId = form?.formId;
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    // Update active path when route changes
    const path = router.asPath;
    if (path.includes('/build')) {
      setActivePath('build');
    } else if (path.includes('/integrations')) {
      setActivePath('integrations');
    } else if (path.includes('/share')) {
      setActivePath('share');
    } else if (path.includes('/submissions')) {
      setActivePath('submissions');
    } else {
      setActivePath('build'); // default
    }
  }, [router.asPath]);

  const goTo = (path) => {
    if (!formId) return;
    const targetPath = `/forms/${formId}/${path}`;
    const currentPath = router.asPath;
    
    // If we're on the build page, use window.location for reliable navigation
    // This ensures the page fully reloads and renders correctly
    if (currentPath.includes('/build')) {
      window.location.href = targetPath;
    } else {
      // For other pages, use router.push for smooth client-side navigation
      router.push(targetPath);
    }
  };

  const isActive = (path) => activePath === path;

  const goToHome = () => {
    const currentPath = router.asPath;
    // If we're on the build page, use window.location for reliable navigation
    if (currentPath.includes('/build')) {
      window.location.href = '/';
    } else {
      // For other pages, use router.push for smooth client-side navigation
      router.push('/');
    }
  };

  return (
    <div className="w-full h-16 shadow flex items-center px-8 justify-between">
      <div className='flex gap-2'>
        <ArrowLeft onClick={goToHome} className="cursor-pointer" />

        {isEditingTitle ? (
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            className="text-lg font-semibold bg-transparent border-b border-gray-400 focus:outline-none"
            autoFocus
          />
        ) : (
          <h1 className="text-lg font-semibold cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            {formTitle}
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-8 p-4 rounded text-sm font-medium">

        <div 
          onClick={() => goTo("build")} 
          className={`flex items-center space-x-1 cursor-pointer transition-colors ${
            isActive('build') ? 'text-blue-600 font-semibold' : 'hover:text-blue-500'
          }`}
        >
          <Home className={`w-4 h-4 ${isActive('build') ? 'text-blue-600' : 'text-blue-600'}`} />
          <span>Build</span>
        </div>

        <div 
          onClick={() => goTo("integrations")} 
          className={`flex items-center space-x-1 cursor-pointer transition-colors ${
            isActive('integrations') ? 'text-purple-600 font-semibold' : 'hover:text-purple-500'
          }`}
        >
          <Wrench className={`w-4 h-4 ${isActive('integrations') ? 'text-purple-600' : 'text-purple-600'}`} />
          <span>Integrations</span>
        </div>

        <div 
          onClick={() => goTo("share")} 
          className={`flex items-center space-x-1 cursor-pointer transition-colors ${
            isActive('share') ? 'text-pink-600 font-semibold' : 'hover:text-pink-500'
          }`}
        >
          <Share2 className={`w-4 h-4 ${isActive('share') ? 'text-pink-600' : 'text-pink-600'}`} />
          <span>Share</span>
        </div>

        <div 
          onClick={() => goTo("submissions")} 
          className={`flex items-center space-x-1 cursor-pointer transition-colors ${
            isActive('submissions') ? 'text-green-600 font-semibold' : 'hover:text-green-500'
          }`}
        >
          <BarChart2 className={`w-4 h-4 ${isActive('submissions') ? 'text-green-600' : 'text-green-600'}`} />
          <span>Results</span>
        </div>

      </div>

      <button
        onClick={handleSave}
        className="bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
      >
        {form.status === 'published' ? (
          <><Check className='w-4 h-4' /><span>Published</span></>
        ) : (
          <><Rocket className='w-4 h-4' /><span>Publish</span></>
        )}
      </button>
    </div>
  );
};

export default FormHeader;
