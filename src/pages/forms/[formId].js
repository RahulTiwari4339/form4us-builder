"use client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FormPage() {
  const router = useRouter();
  const { formId } = router.query;

  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // Signature Canvas
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const [progress, setProgress] = useState(0);

  // Simulate loading animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) return 100;
        return old + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Input refs for auto-focus
  const inputRef = useRef(null);

  // ✅ Fetch Form when formId is available
  useEffect(() => {
    if (!formId) return;
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        const data = await res.json();
        if (res.ok) setForm(data);
        else setForm(null);
      } catch (error) {
        console.error("Error fetching form:", error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  // Auto-focus input on step change
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentStepIndex]);

  // Trigger fade-in animation on step change
  useEffect(() => {
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 50);
  }, [currentStepIndex]);

  // ✅ Input change handler
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Handle Next with validation
  const handleNext = async (e) => {
    e.preventDefault();
    const currentStep = form.steps[currentStepIndex];

    // Validate required fields for contact form
    if (currentStep?.type === "contact") {
      const fields = currentStep?.settings?.fields || [];
      for (const field of fields) {
        if (field.required && !formData[field.key]) {
          alert(`${field.label} is required`);
          return;
        }
      }
    }

    // Validate required fields for address
    if (currentStep?.type === "address") {
      const fields = currentStep?.settings?.fields || [];
      for (const field of fields) {
        if (field.required && !formData[field.key]) {
          alert(`${field.label} is required`);
          return;
        }
      }
    }

    // Validate phoneNumber step
    if (currentStep?.type === "phoneNumber" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("Phone number is required");
        return;
      }
    }

    // Validate websiteurl step
    if (currentStep?.type === "websiteurl" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("Website URL is required");
        return;
      }
    }

    // Validate number step
    if (currentStep?.type === "number" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("This field is required");
        return;
      }
    }

    // Validate longText step
    if (currentStep?.type === "longText" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("This field is required");
        return;
      }
    }

    // Validate date step
    if (currentStep?.type === "date" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("Please select a date");
        return;
      }
    }

    // Validate dropdown step
    if (currentStep?.type === "dropdown" && currentStep?.settings?.required) {
      if (!formData[currentStep.key]) {
        alert("Please select an option");
        return;
      }
    }

    const nextStepIndex = currentStepIndex + 1;
    const nextStep = form.steps[nextStepIndex];

    // Check if we're moving to thank you page - submit form
    if (nextStep?.type === "thankyou") {
      // Capture signature before submitting if canvas exists
      if (canvasRef.current) {
        const signatureImage = canvasRef.current.toDataURL("image/png");
        formData.signatureImage = signatureImage;
      }

      try {
        const filteredData = { ...formData };
        delete filteredData.signatureCanvasRef;

        const submissionData = {
          formId,
          formTitle: form.title,
          responses: filteredData,
        };

        const res = await fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        if (res.ok) {
          // Always move to thank you page after successful submission
          setCurrentStepIndex(nextStepIndex);
        } else {
          alert("Failed to submit form.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Error submitting form.");
      }
    } else if (nextStepIndex < form.steps.length) {
      // Just move to next step if not at the end
      setCurrentStepIndex(nextStepIndex);
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (currentStepIndex > 0) setCurrentStepIndex((prev) => prev - 1);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext(e);
    }
  };

  // ✅ Canvas Handlers
  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    setIsDrawing(true);
    setLastPosition({ x: x - rect.left, y: y - rect.top });
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || e.touches?.[0]?.clientX;
    const y = e.clientY || e.touches?.[0]?.clientY;
    const newX = x - rect.left;
    const newY = y - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();

    setLastPosition({ x: newX, y: newY });
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleChange("signatureImage", "");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[16px] text-gray-500">Powered by</p>
          <Image
            src="/logo.png"
            alt="Youform Logo"
            width={200}
            height={60}
            className="object-contain"
          />

          {/* Progress bar */}
          <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-cyan-400 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800 mb-2">Form not found</p>
          <p className="text-gray-600">
            {"The form you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  // Check for inactive forms
  if (form.isActive === false) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Sorry! This form is now closed.</h1>
          <button
            onClick={() => router.push("https://www.form4us.com/")}
            className="bg-blue-500 hover:bg-blue-700 mx-4 my-4 py-4 text-[24px] text-white font-bold px-4 rounded"
          >
            Create your own Form4us →
          </button>
        </div>
      </div>
    );
  }

  const currentStep = form.steps[currentStepIndex];
  const totalSteps = form.steps.filter((s) => s.type !== "thankyou").length;
  const currentQuestionNumber =
    form.steps.slice(0, currentStepIndex).filter((s) => s.type !== "thankyou").length + 1;
  const progressPercentage = ((currentQuestionNumber - 1) / Math.max(totalSteps - 1, 1)) * 100;

  return (
    <div
      className={`relative w-full min-h-screen flex flex-col ${
        form.pagebg || "bg-gradient-to-br from-slate-50 to-blue-50"
      }`}
      style={{ backgroundColor: form.pagebg }}
    >
      {/* Progress Bar */}
      {currentStep?.type !== "thankyou" && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div
          className={`w-full max-w-3xl transition-all duration-500 ${
            fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* INTRO STEP */}
          {currentStep?.type === "intro" && (
            <div className="text-center space-y-6 py-12">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Welcome
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {currentStep?.settings?.title || form.title}
              </h1>
              <div
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{
                  __html: currentStep?.settings?.description || form.description,
                }}
              />
              <button
                onClick={handleNext}
                className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {currentStep?.settings?.buttonText || "Start"}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}

          {/* SELECT STEP */}
          {currentStep?.type === "select" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.title || "Please select an option"}
                </h2>
              </div>

              <div className="space-y-3">
                {currentStep?.settings?.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleChange(currentStep.key, option);
                      setTimeout(() => handleNext({ preventDefault: () => {} }), 300);
                    }}
                    className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all hover:scale-102 ${
                      formData[currentStep.key] === option
                        ? "border-blue-600 bg-blue-50 text-blue-900"
                        : "border-gray-300 hover:border-blue-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-medium">{option}</span>
                      {formData[currentStep.key] === option && (
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* LONG TEXT STEP */}
          {currentStep?.type === "longText" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Your message"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <textarea
                ref={inputRef}
                placeholder={currentStep?.settings?.placeholder || "Write details here..."}
                value={formData[currentStep.key] || ""}
                onChange={(e) => handleChange(currentStep.key, e.target.value)}
                rows={6}
                className="w-full text-xl md:text-2xl font-medium text-gray-900 bg-white border-2 border-gray-300 focus:border-blue-600 outline-none p-4 rounded-xl transition-colors placeholder-gray-400 resize-y"
              />

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                >
                  OK
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Shift + Enter ↵</kbd> for new line
                </span>
              </div>
            </div>
          )}

          {/* NUMBER STEP */}
          {currentStep?.type === "number" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Enter a number"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <input
                ref={inputRef}
                type="number"
                placeholder={currentStep?.settings?.placeholder || "1234"}
                value={formData[currentStep.key] || ""}
                onChange={(e) => handleChange(currentStep.key, e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors placeholder-gray-400"
              />

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                >
                  OK
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter ↵</kbd>
                </span>
              </div>
            </div>
          )}

          {/* WEBSITE URL STEP */}
          {currentStep?.type === "websiteurl" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Website URL"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <input
                ref={inputRef}
                type="url"
                placeholder={currentStep?.settings?.placeholder || "https://example.com"}
                value={formData[currentStep.key] || ""}
                onChange={(e) => handleChange(currentStep.key, e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors placeholder-gray-400"
              />

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                >
                  OK
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter ↵</kbd>
                </span>
              </div>
            </div>
          )}

          {/* PHONE NUMBER STEP */}
          {currentStep?.type === "phoneNumber" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Phone Number"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentStep?.settings?.countryCode || "+1"}
                  disabled
                  className="w-20 text-2xl md:text-3xl font-medium text-gray-900 bg-gray-100 border-b-4 border-gray-300 py-4 text-center"
                />
                <input
                  ref={inputRef}
                  type="tel"
                  placeholder={currentStep?.settings?.placeholder || "Enter phone number"}
                  value={formData[currentStep.key] || ""}
                  onChange={(e) => handleChange(currentStep.key, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors placeholder-gray-400"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-md"
                >
                  OK
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-500">
                  press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Enter ↵</kbd>
                </span>
              </div>
            </div>
          )}

          {/* DATE STEP */}
          {currentStep?.type === "date" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Select a date"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <input
                ref={inputRef}
                type="date"
                value={formData[currentStep.key] || ""}
                onChange={(e) => handleChange(currentStep.key, e.target.value)}
                className="w-full text-2xl md:text-3xl font-medium text-gray-900 bg-transparent border-b-4 border-gray-300 focus:border-blue-600 outline-none py-4 transition-colors"
              />

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Rate your experience ⭐"}
                </h2>
              </div>

              <div className="flex gap-4 justify-center py-8">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleChange(currentStep.key, index + 1);
                      setTimeout(() => handleNext({ preventDefault: () => {} }), 300);
                    }}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-16 h-16 ${
                        formData[currentStep.key] > index ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DROPDOWN STEP */}
          {currentStep?.type === "dropdown" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {currentStep?.settings?.label || "Choose an option"}
                  {currentStep?.settings?.required && <span className="text-red-500 ml-2">*</span>}
                </h2>
              </div>

              <select
                ref={inputRef}
                value={formData[currentStep.key] || ""}
                onChange={(e) => handleChange(currentStep.key, e.target.value)}
                className="w-full text-xl px-6 py-4 border-2 border-gray-300 rounded-xl focus:border-blue-600 outline-none transition-colors bg-white"
              >
                <option value="">Select an option</option>
                {currentStep?.settings?.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
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

          {/* CONTACT FORM STEP */}
          {currentStep?.type === "contact" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  {currentStep?.settings?.title || "Contact Details"}
                </h2>
                {currentStep?.settings?.description && (
                  <p className="text-lg text-gray-600">{currentStep.settings.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentStep?.settings?.fields?.map((field, index) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-lg font-semibold text-gray-800">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === "phone" ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={field.countryCode || "+1"}
                          disabled
                          className="w-20 text-lg font-medium text-gray-900 bg-gray-100 border-2 border-gray-300 px-3 py-3 rounded-lg text-center"
                        />
                        <input
                          ref={index === 0 ? inputRef : null}
                          type="tel"
                          placeholder={field.placeholder || "Enter phone"}
                          value={formData[field.key] || ""}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="flex-1 text-lg font-medium text-gray-900 bg-white border-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 rounded-lg transition-colors placeholder-gray-400"
                        />
                      </div>
                    ) : (
                      <input
                        ref={index === 0 ? inputRef : null}
                        type={field.type}
                        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        onKeyDown={index === currentStep.settings.fields.length - 1 ? handleKeyDown : undefined}
                        className="w-full text-lg font-medium text-gray-900 bg-white border-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 rounded-lg transition-colors placeholder-gray-400"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
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

          {/* ADDRESS STEP */}
          {currentStep?.type === "address" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-blue-600 font-medium mb-4">
                  <span className="text-2xl">{currentQuestionNumber}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2">
                  {currentStep?.settings?.title || "Address Details"}
                </h2>
                {currentStep?.settings?.description && (
                  <p className="text-lg text-gray-600">{currentStep.settings.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentStep?.settings?.fields?.map((field, index) => (
                  <div key={field.key} className={field.key === "line1" || field.key === "line2" ? "md:col-span-2" : ""}>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      ref={index === 0 ? inputRef : null}
                      type={field.type === "number" ? "text" : field.type}
                      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      onKeyDown={index === currentStep.settings.fields.length - 1 ? handleKeyDown : undefined}
                      className="w-full text-lg font-medium text-gray-900 bg-white border-2 border-gray-300 focus:border-blue-600 outline-none px-4 py-3 rounded-lg transition-colors placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="button"
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
                onClick={() => router.push("/")}
                className="mt-8 inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
              >
                {currentStep?.settings?.buttonText || "Back to Home"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      {currentStep?.type !== "thankyou" && currentStep?.type !== "intro" && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all shadow-lg ${
              currentStepIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-cyan-400 text-white hover:bg-cyan-500 hover:scale-105"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center justify-center w-12 h-12 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-all hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Watermark */}
      <Link
        href="https://form4us.com/?utm_source=powered_by_form4us"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 text-xs px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full shadow-sm border border-gray-200 hover:bg-white hover:text-gray-800 transition"
      >
        Powered by Form4Us
      </Link>
    </div>
  );
}