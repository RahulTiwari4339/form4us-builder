import React, { useState, useEffect, useRef } from "react";
import { 
  Check, 
  Star, 
  ArrowRight, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Globe, 
  Layout, 
  Hash, 
  Type, 
  Mail, 
  Phone, 
  Calendar 
} from "lucide-react";

/**
 * Typeform-style Preview Renderer
 * Supports: intro, shortText, longText, select, dropdown, websiteurl, 
 * phoneNumber, star, contact, address, multiSection, and thankyou.
 */
export default function PreviewRenderer({ 
  steps = [], 
  designSettings = {}, 
  onClose,
  setShowPreview // Added to match your parent usage
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Helper to handle closing the preview
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (setShowPreview) {
      setShowPreview(false);
    }
  };

  // Ensure we don't crash if steps are empty
  if (!steps || steps.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 font-sans p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border border-slate-200">
          <Layout size={32} />
        </div>
        <h2 className="text-xl font-medium text-slate-600 mb-2">No blocks to preview</h2>
        <p className="max-w-xs text-sm leading-relaxed mb-6">
          Add blocks to your form to see them rendered here in the Typeform-style preview.
        </p>
        <button 
          onClick={handleClose}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
        >
          Close Preview
        </button>
      </div>
    );
  }

  const currentStep = steps[index];
  const stepId = currentStep.key || currentStep.id || `step_${index}`;
  const progress = Math.round(((index + 1) / steps.length) * 100);

  const theme = {
    bg: designSettings.backgroundColor || "#ffffff",
    text: designSettings.textColor || "#262626",
    button: designSettings.buttonColor || "#000000",
    buttonText: designSettings.buttonTextColor || "#ffffff",
  };

  const goNext = () => {
    if (index < steps.length - 1) setIndex((p) => p + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex((p) => p - 1);
  };

  const setAnswer = (val, key = stepId) => {
    setAnswers((p) => ({ ...p, [key]: val }));
  };

  const handleOptionClick = (val) => {
    setAnswer(val);
    setTimeout(goNext, 400); // Smooth auto-advance delay
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !["longText", "select", "multiSection", "contact", "address"].includes(currentStep?.type)
      ) {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, currentStep?.type]);

  const readableType = typeof currentStep?.type === "string" 
    ? currentStep.type.replace(/([A-Z])/g, " $1") 
    : "Question";

  return (
    <div 
      className="fixed inset-0 z-[999] flex flex-col font-sans selection:bg-opacity-20"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* HEADER / PROGRESS */}
      <div className="fixed top-0 left-0 w-full z-10">
        <div className="h-1.5 w-full bg-black/5">
          <div 
            className="h-full transition-all duration-700 ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
            style={{ width: `${progress}%`, backgroundColor: theme.button }}
          />
        </div>

        <div className="flex justify-between items-center px-6 py-4">
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">
            {readableType} {index + 1}/{steps.length}
          </span>
          <button 
            onClick={handleClose} 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main className="flex-1 flex items-center justify-center px-6 relative overflow-y-auto pt-20 pb-24">
        <div key={index} className="w-full max-w-2xl animate-in">
          <div className="flex gap-4">
            <span 
              className="text-lg font-medium opacity-60 mt-1"
              style={{ color: theme.button }}
            >
              {index + 1}
              <ArrowRight size={14} className="inline ml-1 mb-1" />
            </span>

            <div className="flex-1 space-y-8">
              {renderStep({
                step: currentStep,
                answers,
                setAnswer,
                handleOptionClick,
                goNext,
                theme,
                handleClose // Pass handleClose instead of onClose
              })}
            </div>
          </div>
        </div>
      </main>

      {/* NAVIGATION CONTROLS */}
      <div className="fixed bottom-6 right-6 flex rounded shadow-2xl border bg-white overflow-hidden z-20">
        <button 
          onClick={goPrev} 
          disabled={index === 0} 
          className="p-3 hover:bg-gray-50 border-r disabled:opacity-20 transition-colors text-slate-700"
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={goNext} 
          disabled={index === steps.length - 1} 
          className="p-3 hover:bg-gray-50 disabled:opacity-20 transition-colors text-slate-700"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom-12 { from { transform: translateY(3rem); } to { transform: translateY(0); } }
        .animate-in { 
          animation: fade-in 0.8s ease-out, 
                     slide-in-from-bottom-12 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}} />
    </div>
  );
}

/**
 * RENDER STEP HELPER
 */
function renderStep({ 
  step, 
  answers, 
  setAnswer, 
  handleOptionClick, 
  goNext, 
  theme, 
  handleClose 
}) {
  const s = step.settings || {};
  const title = s.title || step.label;
  const stepId = step.key || step.id;
  const currentAnswer = answers[stepId];

  // Component for multi-field layouts
  const FieldGrid = ({ fields }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 max-w-xl">
      {fields?.filter(f => !f.hidden).map((f) => {
        const fieldKey = `${stepId}_${f.key}`;
        return (
          <div key={f.key} className="space-y-1 group">
            <label className="text-[10px] font-bold uppercase opacity-40 group-focus-within:opacity-100 transition-opacity">
              {f.label} {f.required && "*"}
            </label>
            <input
              type={f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}
              className="w-full p-2 bg-transparent border-b border-black/10 focus:border-black outline-none transition-colors text-lg font-light"
              placeholder={f.placeholder || ""}
              value={answers[fieldKey] || ""}
              onChange={(e) => setAnswer(e.target.value, fieldKey)}
            />
          </div>
        );
      })}
    </div>
  );

  switch (step.type) {
    case "intro":
      return (
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-light leading-tight">{title}</h1>
          <div 
            className="text-xl opacity-70 font-light" 
            dangerouslySetInnerHTML={{ __html: s.description }} 
          />
          <button 
            onClick={goNext} 
            className="group flex items-center gap-3 px-8 py-4 rounded font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: theme.button, color: theme.buttonText }}
          >
            {s.nextText || "Start"} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );

    case "shortText":
    case "websiteurl":
    case "phoneNumber":
    case "number":
    case "date":
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-light">{title}</h2>
          {s.description && (
            <div className="opacity-60 font-light" dangerouslySetInnerHTML={{ __html: s.description }} />
          )}
          <div className="flex items-center gap-3 border-b-2 border-black/10 focus-within:border-black transition-colors">
            {step.type === 'websiteurl' && <Globe className="opacity-30" size={24} />}
            {step.type === 'phoneNumber' && <span className="opacity-50 font-bold text-xl">{s.countryCode || "+1"}</span>}
            <input
              autoFocus
              type={step.type === 'number' ? 'number' : step.type === 'date' ? 'date' : 'text'}
              className="w-full text-2xl md:text-4xl bg-transparent outline-none py-2 font-light placeholder:opacity-20"
              placeholder={s.placeholder || "Type your answer..."}
              value={currentAnswer || ""}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <button 
            onClick={goNext} 
            className="px-6 py-2 rounded font-bold shadow-sm transition-all"
            style={{ backgroundColor: theme.button, color: theme.buttonText }}
          >
            {s.nextText || "OK"}
          </button>
        </div>
      );

    case "longText":
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-light">{title}</h2>
          <textarea
            autoFocus
            rows={3}
            className="w-full text-2xl bg-transparent border-b-2 border-black/10 focus:border-black outline-none py-2 transition-colors font-light placeholder:opacity-20 resize-none"
            placeholder={s.placeholder || "Type your message here..."}
            value={currentAnswer || ""}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button 
            onClick={goNext} 
            className="px-6 py-2 rounded font-bold shadow-sm"
            style={{ backgroundColor: theme.button, color: theme.buttonText }}
          >
            {s.nextText || "OK"}
          </button>
        </div>
      );

    case "select":
    case "dropdown":
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-light">{title}</h2>
          <div className="grid gap-2 max-w-md">
            {s.options?.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleOptionClick(opt)}
                className="group w-full p-2 pr-4 rounded border-2 text-left flex items-center gap-4 transition-all"
                style={{
                  borderColor: currentAnswer === opt ? theme.button : "rgba(0,0,0,0.1)",
                  backgroundColor: currentAnswer === opt ? `${theme.button}10` : "transparent"
                }}
              >
                <span className="w-8 h-8 flex items-center justify-center border rounded text-xs font-bold bg-white group-hover:bg-black group-hover:text-white transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg flex-1 font-light">{opt}</span>
                {currentAnswer === opt && <Check size={18} />}
              </button>
            ))}
          </div>
        </div>
      );

    case "star":
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-light">{title}</h2>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button 
                key={n} 
                onClick={() => handleOptionClick(n)} 
                className="transition-transform hover:scale-125"
              >
                <Star 
                  size={48} 
                  strokeWidth={1} 
                  className={currentAnswer >= n ? "text-yellow-400" : "text-gray-300"} 
                  fill={currentAnswer >= n ? "currentColor" : "none"} 
                />
              </button>
            ))}
          </div>
        </div>
      );

    case "contact":
    case "address":
    case "multiSection":
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-light leading-snug">{title}</h2>
          {s.description && (
            <div className="opacity-60 font-light" dangerouslySetInnerHTML={{ __html: s.description }} />
          )}
          <FieldGrid fields={s.fields || []} />
          <button 
            onClick={goNext} 
            className="px-6 py-2 rounded font-bold mt-4 shadow-sm"
            style={{ backgroundColor: theme.button, color: theme.buttonText }}
          >
            {s.nextText || "Continue"}
          </button>
        </div>
      );

    case "thankyou":
      return (
        <div className="space-y-6 text-center py-12">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-light leading-tight">{title}</h1>
          <p className="text-xl opacity-70 font-light" dangerouslySetInnerHTML={{ __html: s.description }} />
          <button 
            onClick={handleClose} 
            className="px-6 py-3 rounded-lg font-bold mt-4 border transition-colors hover:bg-black hover:text-white"
          >
            Close
          </button>
        </div>
      );

    default:
      return <div>Unsupported Block Type: {step.type}</div>;
  }
}