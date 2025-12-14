// components/MobileBuilder.jsx
import React, { useEffect, useState,useRef } from "react";
import {
  Home,
  Hammer,
  Settings as SettingsIcon,
  Plus,
  X,
  Eye,
  Menu,
  Share2,
  Trash2,
  Copy,
  Palette,
  Check,
  Star
} from "lucide-react";
import { FORM_META } from "@/config/formsMeta";
import { ICON_MAP } from "@/config/iconMap";
import { nanoid } from "nanoid";
import PublishModel from "@/components/Preview/PublishModel";

async function fetchFormApi(formId) {
  const res = await fetch(`/api/forms/${formId}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default function MobileBuilder({userSession}) {

  const [steps, setSteps] = useState([]);
  const [stepKey, setStepKey] = useState("");
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [selectedBlockKey, setSelectedBlockKey] = useState(null);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showStepSettings, setShowStepSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [formId, setFormId] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [form, setForm] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  




  const [designSettings, setDesignSettings] = useState({
    backgroundColor: "#ffffff",
    backgroundImage: "",
    textColor: "#111827",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
  });


useEffect(() => {
  // Prevent duplicate API calls (React StrictMode runs useEffect twice)
  const segments = window.location.pathname.split("/");
  const id = segments[2];
  const didRun = didRunRef.current;

  if (didRun) return; // prevents duplicate call
  didRunRef.current = true;

  console.log("Fetching form only once... ID:", id);

  if (!id) return;

  setFormId(id);

  // 1) Try to fetch existing form
  fetchFormApi(id)
    .then((data) => {
      setForm(data);
      setFormTitle(data.title || "Form Builder");

      let dbSteps = Array.isArray(data.steps) ? data.steps : [];

      // Normalize DB steps
      let normalized = dbSteps.map((s) => ({
        ...s,
        key: s.key || `${s.type}-${nanoid(4)}`,
        label: s.label || FORM_META[s.type]?.label,
        color: s.color || "bg-gray-200",
        settings: {
          ...(FORM_META[s.type]?.default || {}),
          ...(s.settings || {}),
        },
      }));

      // CHECK: intro exists?
      const hasIntro = normalized.some((s) => s.type === "intro");

      // CHECK: thankyou exists?
      const hasThank = normalized.some((s) => s.type === "thankyou");

      // AUTO ADD MISSING INTRO
      if (!hasIntro) {
        normalized.unshift({
          key: `intro-${nanoid(4)}`,
          type: "intro",
          label: FORM_META.intro.label,
          color: "bg-pink-300",
          icon: FORM_META.intro.icon,
          settings: FORM_META.intro.default,
        });
      }

      // AUTO ADD MISSING THANKYOU
      if (!hasThank) {
        normalized.push({
          key: `thankyou-${nanoid(4)}`,
          type: "thankyou",
          label: FORM_META.thankyou.label,
          color: "bg-pink-300",
          icon: FORM_META.thankyou.icon,
          settings: FORM_META.thankyou.default,
        });
      }

      // Ensure thankyou always last
      const thank = normalized.filter((s) => s.type === "thankyou");
      const other = normalized.filter((s) => s.type !== "thankyou");

      const finalSteps = [...other, ...thank];

      setSteps(finalSteps);
      setStepKey(finalSteps[0]?.key);
    })
    .catch(() => {
      // NEW FORM CASE → Always add intro + thankyou
      const intro = {
        key: `intro-${nanoid(4)}`,
        type: "intro",
        label: FORM_META.intro.label,
        color: "bg-pink-300",
        icon: FORM_META.intro.icon,
        settings: FORM_META.intro.default,
      };

      const thank = {
        key: `thankyou-${nanoid(4)}`,
        type: "thankyou",
        label: FORM_META.thankyou.label,
        color: "bg-pink-300",
        icon: FORM_META.thankyou.icon,
        settings: FORM_META.thankyou.default,
      };

      setSteps([intro, thank]);
      setStepKey(intro.key);
    });
}, []);

// Add this above your component:
const didRunRef = useRef(false);





  /* ---------------- helpers ---------------- */
  const currentStep = steps.find((s) => s.key === stepKey);
  const nonThankYouSteps = steps.filter((s) => s.type !== "thankyou");
  const thankYouStep = steps.find((s) => s.type === "thankyou");

  const getIconForType = (type) => {
    const iconName = FORM_META[type]?.icon;
    return ICON_MAP[iconName] || ICON_MAP.FileText || (() => null);
  };

  /* ---------------- add block ---------------- */
  const addStep = (type) => {
    const newKey = `${type}-${Date.now()}`;
    const step = {
      key: newKey,
      type,
      label: FORM_META[type]?.label || type,
      color: FORM_META[type]?.color || "bg-gray-300",
      settings: JSON.parse(JSON.stringify(FORM_META[type]?.default || {})), // deep copy defaults
    };

    // insert before thankyou if exists
    const tIndex = steps.findIndex((s) => s.type === "thankyou");
    const copy = [...steps];
    if (tIndex !== -1) copy.splice(tIndex, 0, step);
    else copy.push(step);

    setSteps(copy);
    setStepKey(newKey);
    setShowBlockSelector(false);
    setSelectedBlockKey(null);
    // open step settings automatically for new blocks
    setTimeout(() => setShowStepSettings(true), 120);
  };

  /* ---------------- remove block ---------------- */
  const removeStep = (key) => {
    const filtered = steps.filter((s) => s.key !== key);
    setSteps(filtered);
    if (filtered.length) setStepKey(filtered[0].key);
    setShowStepSettings(false);
  };

  /* ---------------- duplicate ---------------- */
  const duplicateStep = (key) => {
    const index = steps.findIndex((s) => s.key === key);
    if (index === -1) return;
    const s = steps[index];
    const newKey = `${s.type}-${Date.now()}`;
    const dup = {
      ...JSON.parse(JSON.stringify(s)),
      key: newKey,
      label: `${s.label} Copy`,
    };

    const tIndex = steps.findIndex((x) => x.type === "thankyou");
    const copy = [...steps];
    if (tIndex !== -1 && index < tIndex) copy.splice(index + 1, 0, dup);
    else if (tIndex !== -1) copy.splice(tIndex, 0, dup);
    else copy.splice(index + 1, 0, dup);

    setSteps(copy);
    setStepKey(newKey);
  };

  /* ---------------- update settings ---------------- */
const updateStepSettings = (keyOrObj, value) => {
  setSteps((prev) =>
    prev.map((s) => {
      if (s.key !== stepKey) return s;

      // 🔥 title change = label auto update
      if (keyOrObj === "title") {
        return {
          ...s,
          label: value, // sidebar label sync
          settings: {
            ...(s.settings || {}),
            title: value,
          },
        };
      }

      if (typeof keyOrObj === "string") {
        return {
          ...s,
          settings: {
            ...(s.settings || {}),
            [keyOrObj]: value,
          },
        };
      }

      return {
        ...s,
        settings: {
          ...(s.settings || {}),
          ...(keyOrObj || {}),
        },
      };
    })
  );
};



  /* ---------------- contact helpers ---------------- */
  const addContactField = (fieldType = "text") => {
    if (!currentStep) return;
    const fields = currentStep.settings.fields ? [...currentStep.settings.fields] : [];
    const newField = {
      key: `f-${Date.now()}`,
      label: "New Field",
      type: fieldType,
      placeholder: "",
      required: false,
      hidden: false,
    };
    updateStepSettings("fields", [...fields, newField]);
  };

  const updateContactField = (index, changes) => {
    if (!currentStep) return;
    const fields = [...(currentStep.settings.fields || [])];
    fields[index] = { ...fields[index], ...changes };
    updateStepSettings("fields", fields);
  };

  const removeContactField = (index) => {
    if (!currentStep) return;
    const fields = [...(currentStep.settings.fields || [])];
    fields.splice(index, 1);
    updateStepSettings("fields", fields);
  };


  /* ---------------- save form ---------------- */
  const handleSave = async (publish = false) => {
    // Separate thankyou block
    const thank = steps.find((s) => s.type === "thankyou");

    // All other blocks
    const other = steps.filter((s) => s.type !== "thankyou");

    // Ensure order → all blocks then thankyou at end
    const finalSteps = thank ? [...other, thank] : other;

    const payload = {
      formId,
      userId: userSession.userId,
      title: formTitle,
      description: "auto-saved",
      pagebg: designSettings.backgroundColor,
      backgroundImage: designSettings.backgroundImage,
      textColor: designSettings.textColor,
      buttonColor: designSettings.buttonColor,
      buttonTextColor: designSettings.buttonTextColor,
      steps: finalSteps,
      status: publish ? "published" : "draft",
    };

    const res = await fetch("/api/forms/create", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
       const shareurl = process.env.NEXT_PUBLIC_API_URL + '/forms/' + data.form.formId;
       setFormUrl(shareurl);
      setShowPublishModal(true);
    }
  };

  const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(formUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  /* ---------------- preview renderers ---------------- */
  const PreviewRenderer = ({ step, designSettings }) => {
  if (!step)
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Select a block to preview
      </div>
    );

  const baseStyle = {
    backgroundColor: designSettings.backgroundColor,
    color: designSettings.textColor,
  };

  return (
    <div
      className="h-full w-full flex items-center justify-center px-4 overflow-y-auto"
      style={baseStyle}
    >
      <div className="w-full max-w-sm">
        {(() => {
          switch (step.type) {
            /* INTRO */
            case "intro":
              return (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <h2 className="text-2xl font-bold">{step.settings.title}</h2>
                  <div
                    className="text-sm opacity-80"
                    dangerouslySetInnerHTML={{
                      __html: step.settings.description,
                    }}
                  />

                  <button
                    className="px-6 py-2 rounded-full font-semibold transition-all hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      background: designSettings.buttonColor,
                      color: designSettings.buttonTextColor,
                    }}
                  >
                    {step.settings.nextText || "Start"}
                  </button>
                </div>
              );

            /* THANK YOU */
            case "thankyou":
              return (
                <div className="flex flex-col items-center text-center gap-3 py-10">
                  <Check className="w-12 h-12 text-green-500 animate-bounce" />
                  <h2 className="text-2xl font-bold">{step.settings.title}</h2>
                  <p className="text-sm opacity-80">
                    {step.settings.description}
                  </p>
                </div>
              );

            /* CONTACT FORM */
            case "contact":
              return (
                <div className="flex flex-col gap-4 py-4">
                  <h3 className="text-xl font-semibold">{step.settings.title}</h3>

                  {step.settings.description && (
                    <div
                      className="text-sm opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: step.settings.description,
                      }}
                    />
                  )}

                  {(step.settings.fields || []).map((f) => (
                    <div key={f.key} className="flex flex-col">
                      <label className="text-xs opacity-60">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          className="px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                          placeholder={f.placeholder}
                        />
                      ) : (
                        <input
                          className="px-3 py-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
                          placeholder={f.placeholder}
                        />
                      )}
                    </div>
                  ))}

                  <button
                    className="px-6 py-2 rounded-full font-semibold mt-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      background: designSettings.buttonColor,
                      color: designSettings.buttonTextColor,
                    }}
                  >
                    {step.settings.nextText || "Next"}
                  </button>
                </div>
              );

            /* SELECT */
            case "select":
              return (
                <div className="flex flex-col gap-3 py-4">
                  <h3 className="text-lg font-semibold">{step.settings.title}</h3>
                  {step.settings.options?.map((opt, i) => (
                    <button
                      key={i}
                      className="w-full p-3 border rounded-xl text-left transition-all hover:bg-gray-100 active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              );

            /* DROPDOWN */
            case "dropdown":
              return (
                <div className="flex flex-col gap-3 py-4">
                  <label className="text-sm opacity-60">{step.settings.label}</label>
                  <select className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none">
                    {step.settings.options?.map((opt, i) => (
                      <option key={i}>{opt}</option>
                    ))}
                  </select>
                </div>
              );

            /* DATE */
            case "date":
              return (
                <div className="flex flex-col gap-3 py-4">
                  <label className="text-sm opacity-60">{step.settings.label}</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              );

            /* STAR */
            case "star":
              return (
                <div className="flex flex-col gap-3 py-4">
                  <label className="text-sm opacity-60">{step.settings.label}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className="w-7 h-7 text-yellow-500 cursor-pointer transition-all hover:scale-110"
                        fill={"currentColor"}
                      />
                    ))}
                  </div>
                </div>
              );

            /* ADDRESS */
            case "address":
              return (
                <div className="flex flex-col gap-3 py-4">
                  <h3 className="text-lg font-semibold">{step.settings.title}</h3>
                  {step.settings.fields?.map((f) => (
                    <div key={f.key}>
                      <label className="text-xs opacity-60">{f.label}</label>
                      <input className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400 outline-none" />
                    </div>
                  ))}
                  <button
                    className="px-6 py-2 rounded-full font-semibold mt-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                    style={{
                      background: designSettings.buttonColor,
                      color: designSettings.buttonTextColor,
                    }}
                  >
                    {step.settings.nextText || "Next"}
                  </button>
                </div>
              );

            default:
              return (
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="text-lg font-semibold">{step.label}</h3>
                  <input
                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
                    placeholder={step.settings.placeholder}
                  />
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
};



  /* build a temporary step object from FORM_META for previewing a block choice */
  const makePreviewStepFromMeta = (type) => {
    if (!FORM_META[type]) return null;
    return {
      key: `preview-${type}`,
      type,
      label: FORM_META[type].label,
      color: FORM_META[type].color || "bg-gray-200",
      settings: JSON.parse(JSON.stringify(FORM_META[type].default || {})),
    };
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* TOP HEADER */}
      <div className="sticky top-0 z-40 w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        {isEditingTitle ? (
          <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} onBlur={() => setIsEditingTitle(false)} className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none flex-1" autoFocus />
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5 text-gray-600" 
            onClick={() => setShowMenu(true)}
            />
            </button>
            <h1 onClick={() => setIsEditingTitle(true)} className="text-lg font-semibold text-gray-800 truncate">{formTitle}</h1>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><Share2 className="w-5 h-5 text-gray-600" /></button>
          <button className="px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-md"
            onClick={() => handleSave(true)}>Save</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-2">
          {/* Actions */}
          <div className="flex gap-3 mb-2 overflow-x-auto pb-2">
            <button onClick={() => { setShowBlockSelector(true); setSelectedBlockKey(null); }} className="px-2 py-1 bg-blue-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Block
            </button>
            <button onClick={() => setShowDesignPanel(true)} className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Palette className="w-4 h-4" /> Design
            </button>
            <button onClick={() => setShowPreview(true)} className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </button>
          </div>

          {/* Phone Mockup */}
          <div className="bg-white rounded-3xl shadow-2xl mb-6 border-4 border-gray-900 max-w-xs mx-auto">
            <div className="bg-gray-900 rounded-t-2xl h-6 flex items-center justify-center"><div className="w-20 h-4 bg-gray-800 rounded-full" /></div>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ height: 560 }}>
              <PreviewRenderer step={currentStep} designSettings={designSettings} />
            </div>
            <div className="bg-gray-900 rounded-b-2xl h-2" />
          </div>

          {/* Steps list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Blocks ({nonThankYouSteps.length})</h3>
              <button onClick={() => { setShowBlockSelector(true); setSelectedBlockKey(null); }} className="text-xs text-blue-600 font-semibold">+ Add</button>
            </div>

            {nonThankYouSteps.map((s, idx) => {
              const Icon = getIconForType(s.type);
              return (
                <div onClick={() => {
                  setStepKey(s.key);
                  setShowStepSettings(false);
                }}
                  className={`bg-white rounded-2xl shadow-sm border-2 ${stepKey === s.key ? "border-blue-500" : "border-gray-200"} overflow-hidden`}
                >
                                  
                  <div className={`${s.color} p-2 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white bg-opacity-30 rounded-xl flex items-center justify-center text-black font-bold">{idx + 1}</div>
                      <div className="text-black">
                        <div className="text-[16px] font-bold opacity-90 flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                           {s.settings?.title || s.label.toUpperCase()}
                           </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setStepKey(s.key); setShowStepSettings(true); }} className="p-2 bg-white bg-opacity-30 rounded-lg"><SettingsIcon className="w-4 h-4 text-black" /></button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateStep(s.key); }} className="p-2 bg-white bg-opacity-30 rounded-lg"><Copy className="w-4 h-4 text-black" /></button>
                      <button onClick={(e) => { e.stopPropagation(); removeStep(s.key); }} className="p-2 bg-white bg-opacity-30 rounded-lg"><Trash2 className="w-4 h-4 text-black" /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Thank you preview card */}
          {thankYouStep && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Thank You Page</h3>
              <div className={`bg-white rounded-2xl shadow-sm border-2 ${stepKey === thankYouStep.key ? "border-green-500" : "border-gray-200"} overflow-hidden`}>
                <div className={`${thankYouStep.color} p-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-30 rounded-xl flex items-center justify-center"><Check className="w-4 h-4 " /></div>
                    <div className="text-white">
                      <div className="font-bold text-sm">{thankYouStep.label}</div>
                      <div className="text-xs opacity-90">Final page</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setStepKey(thankYouStep.key); setShowStepSettings(true); }} className="p-2 bg-white bg-opacity-30 rounded-lg"><SettingsIcon className="w-4 h-4 " /></button>
                  </div>
                </div>
              
              </div>
            </div>
          )}
        </div>
      </div>


       {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start">
          {/* Side-panel style menu, fixed to the left */}
          <div className="bg-white w-full max-w-xs h-full overflow-y-auto transform transition-transform duration-300" style={{ boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}>
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Menu</h3>
              <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="p-2">
              <button
                className="flex items-center w-full gap-4 p-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={() => { console.log("Navigating to Dashboard (Placeholder)"); setShowMenu(false); }}
              >
                <Home className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Home / Dashboard</span>
              </button>

              <button
                className="flex items-center w-full gap-4 p-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={() => { console.log("Viewing Form Responses (Placeholder)"); setShowMenu(false); }}
              >
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">View Responses</span>
              </button>

              <button
                className="flex items-center w-full gap-4 p-3 rounded-xl text-gray-700 hover:bg-blue-50 transition-colors"
                onClick={() => { setShowDesignPanel(true); setShowMenu(false); }}
              >
                <Palette className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Design & Style</span>
              </button>

              <hr className="my-3 border-gray-200" />

              <button
                className="flex items-center w-full gap-4 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => { console.log("Deleting Form (Placeholder)"); setShowMenu(false); }}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-semibold">Delete Form</span>
              </button>
            </nav>
          </div>
          {/* Clickable backdrop to close menu */}
          <div className="flex-1" onClick={() => setShowMenu(false)}></div>
        </div>
      )}

      {/* BLOCK SELECTOR (sheet) */}
      {showBlockSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Add Block</h3>
                <p className="text-xs text-gray-500">Choose a question type & preview</p>
              </div>
              <button onClick={() => { setShowBlockSelector(false); setSelectedBlockKey(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
            </div>

            {/* Preview area (if block selected) */}
            <div className="p-4 border-b">
              {selectedBlockKey ? (
                <>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{FORM_META[selectedBlockKey]?.label}</div>
                      <div className="text-xs text-gray-500">{selectedBlockKey}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedBlockKey(null)} className="px-3 py-1 bg-white border rounded-lg text-sm">Back</button>
                      <button onClick={() => addStep(selectedBlockKey)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Use this block</button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <PreviewRenderer step={makePreviewStepFromMeta(selectedBlockKey)} designSettings={designSettings} />
                  </div>
                </>
              ) : (
                <div className="text-xs text-gray-500">Tap any block below to preview, then click "Use this block".</div>
              )}
            </div>

            {/* Blocks grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {Object.keys(FORM_META)
                .filter((k) => k !== "intro" && k !== "thankyou")
                .map((key) => {
                  const Icon = getIconForType(key);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedBlockKey(key)}
                      className={`p-4 bg-white border rounded-2xl shadow-sm text-left flex items-center gap-3 ${selectedBlockKey === key ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm text-gray-800">{FORM_META[key].label}</div>
                        <div className="text-xs text-gray-500 mt-1">{key}</div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* DESIGN PANEL (mobile sheet) */}
      {showDesignPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold">Design Settings</h3>
                <p className="text-xs text-gray-500">Customize your form appearance</p>
              </div>
              <button onClick={() => setShowDesignPanel(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Background Color", key: "backgroundColor" },
                { label: "Text Color", key: "textColor" },
                { label: "Button Color", key: "buttonColor" },
                { label: "Button Text", key: "buttonTextColor" },
              ].map((item) => (
                <div key={item.key} className="bg-gray-50 p-3 rounded-2xl border">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold">{item.label}</label>
                    <input type="color" value={designSettings[item.key]} onChange={(e) => setDesignSettings((p) => ({ ...p, [item.key]: e.target.value }))} className="w-10 h-10 p-0 border-0" />
                  </div>
                  <input value={designSettings[item.key]} onChange={(e) => setDesignSettings((p) => ({ ...p, [item.key]: e.target.value }))} className="w-full px-3 py-2 rounded-lg border" />
                </div>
              ))}

              <div className="flex gap-2">
                <button onClick={() => setShowDesignPanel(false)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold">Apply</button>
                <button onClick={() => setShowDesignPanel(false)} className="flex-1 py-3 bg-white border rounded-xl">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP SETTINGS (mobile sheet) */}
      {showStepSettings && currentStep && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
    <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold">{currentStep.label}</h3>
          <p className="text-xs text-gray-500">Configure block</p>
        </div>
        <button onClick={() => setShowStepSettings(false)} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {/* GENERIC SETTINGS (Auto-show based on FORM_META) */}
        {FORM_META[currentStep.type]?.settingsFields?.map((field) => {
          const value = currentStep.settings[field.key];

          switch (field.type) {
            case "text":
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => updateStepSettings(field.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              );

            case "richtext":
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold mb-1">{field.label}</label>
                  <textarea
                    rows={3}
                    value={value || ""}
                    onChange={(e) => updateStepSettings(field.key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              );

            case "checkbox":
              return (
                <label
                  key={field.key}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <span className="text-sm font-medium">{field.label}</span>
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => updateStepSettings(field.key, e.target.checked)}
                  />
                </label>
              );

            case "list":
              return (
                <div key={field.key}>
                  <label className="block text-sm font-semibold mb-1">{field.label}</label>

                  {(value || []).map((opt, i) => (
                    <input
                      key={i}
                      value={opt}
                      onChange={(e) => {
                        let updated = [...value];
                        updated[i] = e.target.value;
                        updateStepSettings(field.key, updated);
                      }}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                  ))}

                  <button
                    onClick={() =>
                      updateStepSettings(field.key, [...(value || []), "New Option"])
                    }
                    className="px-3 py-1 bg-blue-50 rounded-lg text-blue-600 text-xs"
                  >
                    + Add Option
                  </button>
                </div>
              );

            case "contact-fields":
              return (
                <div key={field.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Form Fields</h4>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addContactField("text")}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs"
                      >
                        + Text
                      </button>
                      <button
                        onClick={() => addContactField("email")}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs"
                      >
                        + Email
                      </button>
                      <button
                        onClick={() => addContactField("phone")}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs"
                      >
                        + Phone
                      </button>
                      <button
                        onClick={() => addContactField("textarea")}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs"
                      >
                        + Textarea
                      </button>
                    </div>
                  </div>

                  {(value || []).map((f, idx) => (
                    <div key={f.key} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <label className="text-xs text-gray-600">Label</label>
                          <input
                            value={f.label}
                            onChange={(e) =>
                              updateContactField(idx, { label: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg my-1"
                          />

                          <label className="text-xs text-gray-600">Placeholder</label>
                          <input
                            value={f.placeholder}
                            onChange={(e) =>
                              updateContactField(idx, { placeholder: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg my-1"
                          />

                          <label className="text-xs text-gray-600">Type</label>
                          <select
                            value={f.type}
                            onChange={(e) =>
                              updateContactField(idx, { type: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-lg my-1"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="textarea">Textarea</option>
                          </select>

                          <label className="flex items-center gap-2 mt-2">
                            <input
                              type="checkbox"
                              checked={!!f.required}
                              onChange={(e) =>
                                updateContactField(idx, { required: e.target.checked })
                              }
                            />
                            <span className="text-sm">Required</span>
                          </label>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => removeContactField(idx)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => updateContactField(idx, { hidden: !f.hidden })}
                            className="p-2 bg-gray-50 rounded-lg text-xs"
                          >
                            {f.hidden ? "Show" : "Hide"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}

        {/* ACTION BUTTONS */}
        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <button
              onClick={() => {
                duplicateStep(currentStep.key);
                setShowStepSettings(false);
              }}
              className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl"
            >
              Duplicate
            </button>

            {currentStep.type !== "intro" && currentStep.type !== "thankyou" && (
              <button
                onClick={() => {
                  removeStep(currentStep.key);
                  setShowStepSettings(false);
                }}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* FULL PREVIEW (overlay) */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="h-14 bg-gray-900 flex items-center justify-between px-4">
            <h3 className="text-white">Preview</h3>
            <button onClick={() => setShowPreview(false)} className="p-2 rounded hover:bg-gray-800"><X className="w-5 h-5 text-white" /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <PreviewRenderer step={currentStep} designSettings={designSettings} />
          </div>
          <div className="h-16 bg-gray-900 flex items-center justify-between px-4">
            <button onClick={() => {
              const idx = steps.findIndex(s => s.key === stepKey);
              if (idx > 0) setStepKey(steps[idx - 1].key);
            }} className="px-4 py-2 bg-gray-700 text-white rounded-lg">← Prev</button>
            <button onClick={() => {
              const idx = steps.findIndex(s => s.key === stepKey);
              if (idx < steps.length - 1) setStepKey(steps[idx + 1].key);
            }} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Next →</button>
          </div>
        </div>
      )}

      {showPublishModal && (
        <PublishModel setShowPublishModal={setShowPublishModal} formUrl={formUrl} handleCopy={handleCopy} copied={copied} />
      )}
    </div>
  );
}
