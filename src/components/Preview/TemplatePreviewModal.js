import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Loader2, Calendar, MapPin, Star } from 'lucide-react';

export default function TemplatePreviewModal({ formId, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formId) return;
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/forms/${formId}`);
        if (!response.ok) throw new Error('Failed to fetch form data');
        const data = await response.json();
        setPreviewTemplate(data);
      } catch (err) {
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
    if (currentStepIndex > 0) setCurrentStepIndex(prev => prev - 1);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-12 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-lg text-gray-600">Loading preview...</p>
      </div>
    </div>
  );

  if (error || !previewTemplate) return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-12 max-w-md text-center">
        <X className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p className="mb-6">{error || 'Form not found'}</p>
        <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Close</button>
      </div>
    </div>
  );

  const currentStep = previewTemplate.steps[currentStepIndex];
  const totalSteps = previewTemplate.steps.filter(s => s.type !== "thankyou").length;
  const currentQuestionNumber = previewTemplate.steps.slice(0, currentStepIndex).filter(s => s.type !== "thankyou").length + 1;
  const progressPercentage = ((currentQuestionNumber - 1) / Math.max(totalSteps - 1, 1)) * 100;

  // Helper for common Question Header
  const QuestionHeader = () => (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 text-blue-600 font-medium">
        <span className="text-2xl">{currentQuestionNumber}</span>
        <ChevronRight className="w-5 h-5" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {currentStep.settings?.title || currentStep.settings?.label || "Question"}
        {currentStep.settings?.required && <span className="text-red-500 ml-2">*</span>}
      </h2>
      {currentStep.settings?.description && (
        <div className="text-xl text-gray-600" dangerouslySetInnerHTML={{ __html: currentStep.settings.description }} />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl relative border border-gray-200 max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold">Preview Mode</h2>
            <p className="text-sm text-gray-500">{previewTemplate.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
        </div>

        <div className={`flex-1 overflow-y-auto ${previewTemplate.backgroundImage || "bg-white"}`}>
          {currentStep?.type !== "thankyou" && (
            <div className="sticky top-0 w-full h-1 bg-gray-100 z-10">
              <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          )}

          <div className="flex items-center justify-center p-6 md:p-12 min-h-full">
            <div className="w-full max-w-3xl">

              {/* INTRO */}
              {currentStep?.type === "intro" && (
                <div className="text-center space-y-6">
                  <h1 className="text-5xl font-bold">{currentStep.settings?.title}</h1>
                  <div className="text-xl text-gray-600" dangerouslySetInnerHTML={{ __html: currentStep.settings?.description }} />
                  <button onClick={handleNext} className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg flex items-center mx-auto">
                    {currentStep.settings?.nextText || "Start"} <ChevronRight className="ml-2" />
                  </button>
                </div>
              )}

              {/* TEXT / NUMBER / URL / PHONE INPUTS */}
              {["shortText", "longText", "number", "websiteurl", "phoneNumber"].includes(currentStep?.type) && (
                <div className="space-y-6">
                  <QuestionHeader />
                  {currentStep.type === "longText" ? (
                    <textarea disabled placeholder={currentStep.settings?.placeholder} className="w-full text-2xl border-b-4 border-gray-200 py-4 outline-none bg-transparent h-32" />
                  ) : (
                    <input disabled type="text" placeholder={currentStep.settings?.placeholder} className="w-full text-2xl border-b-4 border-gray-200 py-4 outline-none bg-transparent" />
                  )}
                  <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white rounded-lg">{currentStep.settings?.nextText || "OK"}</button>
                </div>
              )}

              {/* SELECT / DROPDOWN */}
              {["select", "dropdown"].includes(currentStep?.type) && (
                <div className="space-y-6">
                  <QuestionHeader />
                  <div className="grid gap-3">
                    {(currentStep.settings?.options || []).map((opt, i) => (
                      <button key={i} onClick={handleNext} className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 bg-white transition-all text-lg">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DATE PICKER */}
              {currentStep?.type === "date" && (
                <div className="space-y-6">
                  <QuestionHeader />
                  <div className="flex items-center border-b-4 border-gray-200 py-4 text-gray-400">
                    <Calendar className="mr-3" /> <span>MM/DD/YYYY</span>
                  </div>
                  <button onClick={handleNext} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Continue</button>
                </div>
              )}

              {/* STAR RATING */}
              {currentStep?.type === "star" && (
                <div className="space-y-6 text-center">
                  <QuestionHeader />
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={48} className="text-gray-200 hover:text-yellow-400 cursor-pointer" onClick={handleNext} />
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT & ADDRESS (Complex Blocks) */}
              {["contact", "address"].includes(currentStep?.type) && (
                <div className="space-y-8">
                  <QuestionHeader />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(currentStep.settings?.fields || []).map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="font-semibold text-gray-700">{field.label}</label>
                        <input disabled className="w-full border-b-2 border-gray-200 py-2 outline-none bg-transparent" placeholder={`Enter ${field.label}...`} />
                      </div>
                    ))}
                  </div>
                  <button onClick={handleNext} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Submit Details</button>
                </div>
              )}

              {/* THANK YOU */}
              {currentStep?.type === "thankyou" && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <ChevronRight size={40} className="rotate-90" />
                  </div>
                  <h1 className="text-4xl font-bold">{currentStep.settings?.title}</h1>
                  <p className="text-xl text-gray-600">{currentStep.settings?.description}</p>
                  <button onClick={onClose} className="px-8 py-3 bg-gray-900 text-white rounded-lg">Close Preview</button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        {currentStep?.type !== "thankyou" && currentStep?.type !== "intro" && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <span className="text-sm text-gray-500">Step {currentStepIndex + 1} of {previewTemplate.steps.length}</span>
            <div className="flex gap-2">
              <button onClick={handlePrev} disabled={currentStepIndex === 0} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight className="rotate-180" /></button>
              <button onClick={handleNext} disabled={currentStepIndex === previewTemplate.steps.length - 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}