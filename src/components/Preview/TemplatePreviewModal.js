import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Loader2 } from 'lucide-react';

export default function TemplatePreviewModal({ formId, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch form data from API
  useEffect(() => {
    if (!formId) return;

    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch form data');
        }
        
        const data = await response.json();
        console.log('Fetched form data:', data);
        setPreviewTemplate(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching form:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]);

  const handleNext = () => {
    if (previewTemplate && currentStepIndex < previewTemplate.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-lg text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !previewTemplate) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Preview</h3>
          <p className="text-gray-600 mb-6">{error || 'Form not found'}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentStep = previewTemplate.steps[currentStepIndex];
  const totalSteps = previewTemplate.steps.filter(s => s.type !== "thankyou").length;
  const currentQuestionNumber = previewTemplate.steps.slice(0, currentStepIndex).filter(s => s.type !== "thankyou").length + 1;
  const progressPercentage = ((currentQuestionNumber - 1) / Math.max(totalSteps - 1, 1)) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative border border-gray-200 max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Template Preview</h2>
            <p className="text-sm text-gray-600 mt-1">{previewTemplate.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg p-2 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview Content with Form Styling */}
        <div className={`flex-1 overflow-y-auto ${previewTemplate.backgroundImage || "bg-gradient-to-br from-slate-50 to-blue-50"}`}>
          
          {/* Progress Bar */}
          {currentStep?.type !== "thankyou" && (
            <div className="sticky top-0 w-full h-1 bg-gray-200 z-10">
              <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex items-center justify-center p-6 md:p-12 min-h-full">
            <div className="w-full max-w-3xl">

              {/* INTRO STEP */}
              {currentStep?.type === "intro" && (
                <div className={`text-center space-y-6 py-12 flex flex-col ${currentStep?.settings?.design || 'items-center'}`}>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                    Welcome
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                    {currentStep?.settings?.title || previewTemplate.title}
                  </h1>
                  {currentStep?.settings?.description && (
                    <div
                      className="text-xl text-gray-600 max-w-2xl mx-auto"
                      dangerouslySetInnerHTML={{ __html: currentStep.settings.description }}
                    />
                  )}
                  <button
                    onClick={handleNext}
                    className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                  >
                    {currentStep?.settings?.buttonText || "Start"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {/* FORM STEP */}
              {/* CONTACT STEP */}
{currentStep?.type === "contact" && (
  <div className="space-y-10">
    {/* Title */}
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
        <span className="text-2xl">{currentQuestionNumber}</span>
        <ChevronRight className="w-5 h-5" />
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        {currentStep.settings?.title}
      </h2>

      {currentStep.settings?.description && (
        <div
          className="text-xl text-gray-600"
          dangerouslySetInnerHTML={{
            __html: currentStep.settings.description,
          }}
        />
      )}
    </div>

    {/* Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {(currentStep.settings?.fields || [])
        .filter(field => !field.hidden)
        .map((field) => (
          <div key={field.key} className="space-y-3">
            <label className="block text-xl font-semibold text-gray-800">
              {field.label}
              {field.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>

            <input
              type={
                field.type === "email"
                  ? "email"
                  : field.type === "phone"
                  ? "tel"
                  : "text"
              }
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled
              className="w-full text-lg bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-3 placeholder-gray-400"
            />
          </div>
        ))}
    </div>

    {/* Footer */}
    <div className="flex items-center gap-4 pt-6">
      <button
        onClick={handleNext}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
      >
        OK
        <svg
          className="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>

      <span className="text-sm text-gray-500">
        press{" "}
        <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
          Enter ↵
        </kbd>
      </span>
    </div>
  </div>
)}


              {/* PHONE STEP */}
              {currentStep?.type === "phone" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please enter your phone number"}
                      {currentStep?.settings?.fields?.phone?.required && <span className="text-red-500 ml-2">*</span>}
                    </h2>
                  </div>

                  <input
                    type="tel"
                    placeholder={currentStep?.settings?.fields?.phone?.placeholder || "Enter phone number"}
                    disabled
                    className="w-full text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors placeholder-gray-400"
                  />

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                    >
                      OK
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* SELECT STEP */}
              {currentStep?.type === "select" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please select an option"}
                    </h2>
                    {currentStep?.settings?.description && (
                      <p className="text-xl text-gray-600">{currentStep.settings.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {currentStep?.settings?.fields?.map((option, index) => (
                      <button
                        key={index}
                        onClick={handleNext}
                        className="w-full text-left px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-400 bg-white transition-all hover:scale-102"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* URL STEP */}
              {currentStep?.type === "url" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please enter a URL"}
                      {currentStep?.settings?.fields?.url?.required && <span className="text-red-500 ml-2">*</span>}
                    </h2>
                  </div>

                  <input
                    type="url"
                    placeholder={currentStep?.settings?.fields?.url?.placeholder || "https://example.com"}
                    disabled
                    className="w-full text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors placeholder-gray-400"
                  />

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                    >
                      OK
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* STAR RATING STEP */}
              {currentStep?.type === "star" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please rate your experience"}
                      {currentStep?.settings?.fields?.rating?.required && <span className="text-red-500 ml-2">*</span>}
                    </h2>
                  </div>

                  <div className="flex gap-4 justify-center py-8">
                    {[...Array(currentStep?.settings?.fields?.rating?.stars || 5)].map((_, index) => (
                      <button
                        key={index}
                        onClick={handleNext}
                        className="transition-transform hover:scale-110"
                      >
                        <svg className="w-16 h-16 text-gray-300 hover:text-yellow-400" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DROPDOWN STEP */}
              {currentStep?.type === "dropDown" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please choose an option"}
                    </h2>
                    {currentStep?.settings?.description && (
                      <p className="text-xl text-gray-600">{currentStep.settings.description}</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    {Object.entries(currentStep?.settings?.selectFields || {}).map(([key, field]) =>
                      field.visible ? (
                        <div key={key} className="space-y-3">
                          <label className="block text-xl font-semibold text-gray-800">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-2">*</span>}
                          </label>
                          <select
                            disabled
                            className="w-full text-xl px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none transition-colors bg-white"
                          >
                            <option value="">Select an option</option>
                            {field.options?.map((option, index) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                    >
                      OK
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNATURE STEP */}
              {currentStep?.type === "sign" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                      <span className="text-2xl">{currentQuestionNumber}</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {currentStep?.settings?.title || "Please sign below"}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-gray-200 h-72">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-lg">
                        Sign here (Preview Mode)
                      </div>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear signature
                    </button>
                  </div>

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {/* THANK YOU STEP */}
              {currentStep?.type === "thankyou" && (
                <div className="text-center space-y-6 py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-900">
                    {currentStep?.settings?.title || "Thank you!"}
                  </h2>
                  <p className="text-xl text-gray-600 max-w-xl mx-auto">
                    {currentStep?.settings?.description || "Your response has been recorded."}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                  >
                    {currentStep?.settings?.buttonText || "Close Preview"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep?.type !== "thankyou" && currentStep?.type !== "intro" && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Step {currentStepIndex + 1} of {previewTemplate.steps.length}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                  currentStepIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIndex === previewTemplate.steps.length - 1}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                  currentStepIndex === previewTemplate.steps.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}