// pages/form/[formId].js
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Plus, Copy, Trash2, User, } from "lucide-react";
import { FORM_META } from "@/config/formsMeta";
import RenderStep from "@/components/RenderStep";
import SettingsPanel from "@/components/SettingsPanel";
import PreviewModel from "@/components/blocks/PreviewModel";
import FormHeader from "@/components/blocks/FormHeader";
import PublishModel from "@/components/Preview/PublishModel";
/* dnd-kit imports */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from "@dnd-kit/sortable";

import { ICON_MAP } from "@/config/iconMap";


async function fetchFormApi(formId) {
  const res = await fetch(`/api/forms/${formId}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default function FormBuilderPagePC({ userSession }) {
  const [steps, setSteps] = useState([]);
  const [stepKey, setStepKey] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showDesignPanel, setShowDesignPanel] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
 const [showPublishModal, setShowPublishModal] = useState(false);
     const [formUrl, setFormUrl] = useState('');
 



  const [designSettings, setDesignSettings] = useState({
    backgroundColor: "#fff",
    backgroundImage: "",
    textColor: "#000",
    buttonColor: "#ff4d4f",
    buttonTextColor: "#fff",
    border: "1px solid #ccc",
  });

  const [formId, setFormId] = useState(null);
      const [form, setForm] = useState({});

  const [formTitle, setFormTitle] = useState("Form Builder");

  // sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // assign new formId if none
  useEffect(() => {
    if (!formId) {
      setFormId(`form-${Date.now()}`);
    }
  }, []);

  /* -----------------------------
      MAIN DEFAULT + DB LOAD LOGIC
  ------------------------------ */
useEffect(() => {
  const segments = window.location.pathname.split("/");
  const id = segments[2]; // forms/<id>/build → pick <id>

  if (!id) return;

  setFormId(id);

  // 1) Try to fetch existing form
  fetchFormApi(id)
    .then((data) => {
      setForm(data);
      setFormTitle(data.title || 'Form Builder');
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


  /* -----------------------------
        ADD A NEW BLOCK
  ------------------------------ */
  const addStep = (component) => {
    const newKey = `${component.type}-${nanoid(4)}`;
    const step = {
      key: newKey,
      type: component.type,
      label: component.label,
      color: component.color || "bg-gray-200",
      icon: component.icon,
      settings: FORM_META[component.type]?.default || {},
    };

    const tIndex = steps.findIndex((s) => s.type === "thankyou");
    const copy = [...steps];

    if (tIndex !== -1) copy.splice(tIndex, 0, step);
    else copy.push(step);

    setSteps(copy);
    setStepKey(newKey);
  };

  /* -----------------------------
         REMOVE BLOCK
  ------------------------------ */
  const removeStep = (key) => {
    const filtered = steps.filter((s) => s.key !== key);
    setSteps(filtered);
    if (filtered.length) setStepKey(filtered[0].key);
  };

  /* -----------------------------
         DUPLICATE BLOCK
  ------------------------------ */
  const duplicateStep = (index) => {
    const s = steps[index];
    const newKey = `${s.type}-${nanoid(4)}`;

    const tIndex = steps.findIndex((x) => x.type === "thankyou");
    const copy = [...steps];

    const duplicated = {
      ...s,
      key: newKey,
      label: `${s.label} Copy`,
    };

    if (tIndex !== -1 && index < tIndex) copy.splice(index + 1, 0, duplicated);
    else if (tIndex !== -1) copy.splice(tIndex, 0, duplicated);
    else copy.splice(index + 1, 0, duplicated);

    setSteps(copy);
    setStepKey(newKey);
  };

  /* -----------------------------
          UPDATE SETTINGS
  ------------------------------ */
  // const updateStepSettings = (keyOrObj, value) => {
  //   setSteps((prev) =>
  //     prev.map((s) => {
  //       if (s.key !== stepKey) return s;

  //       if (typeof keyOrObj === "string") {
  //         return {
  //           ...s,
  //           settings: {
  //             ...(s.settings || {}),
  //             [keyOrObj]: value,
  //           },
  //         };
  //       }

  //       return {
  //         ...s,
  //         settings: {
  //           ...(s.settings || {}),
  //           ...(keyOrObj || {}),
  //         },
  //       };
  //     })
  //   );
  // };

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


  /* -----------------------------
            DRAG END
  ------------------------------ */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const thank = steps.find((s) => s.type === "thankyou");
    const nonThank = steps.filter((s) => s.type !== "thankyou");

    const oldIndex = nonThank.findIndex((s) => s.key === active.id);
    const newIndex = nonThank.findIndex((s) => s.key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(nonThank, oldIndex, newIndex);
    if (thank) newOrder.push(thank);

    setSteps(newOrder);
  };

  const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(formUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  /* -----------------------------
            SAVE FORM
  ------------------------------ */
  const handleSave = async (publish = false) => {
    const thank = steps.find((s) => s.type === "thankyou");
    const other = steps.filter((s) => s.type !== "thankyou");

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
      steps: thank ? [...other, thank] : steps,
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

  return (
    <div className="w-full h-full">
                  <FormHeader isEditingTitle={isEditingTitle} formTitle={formTitle} setFormTitle={setFormTitle} setIsEditingTitle={setIsEditingTitle} handleSave={handleSave} form={form}/>


      <div className="w-full flex gap-2">

        {/* ---------------- Sidebar ---------------- */}
       <div className="w-[18%] h-screen bg-[#F3F4F6] p-4 flex flex-col overflow-y-auto">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Blocks</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="border border-gray-600 rounded-full w-6 h-6 flex justify-center items-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.filter((s) => s.type !== "thankyou").map((s) => s.key)}
                strategy={verticalListSortingStrategy}
              >
                {steps
  .filter((s) => s.type !== "thankyou")
  .map((s, i) => {
    const SidebarIcon = ICON_MAP[s.icon] || User;

    return (
      <div
        key={s.key}
        data-id={s.key}
        className={`group relative p-2 rounded ${s.color} flex justify-between items-center cursor-pointer`}
        onClick={() => setStepKey(s.key)}
      >
        <div className="flex items-center gap-2 text-xs">
          <SidebarIcon className="w-4 h-4 text-gray-700" />
          {/* <span>
            {i + 1}. {s.label || FORM_META[s.type]?.label}
          </span> */}
          <span>
  {i + 1}. {s.settings?.title || s.label || FORM_META[s.type]?.label}
</span>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateStep(i);
            }}
          >
            <Copy className="w-3.5 h-3.5 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              removeStep(s.key);
            }}
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    );
  })}

              </SortableContext>
            </DndContext>
          </div>

          {/* Thankyou Section */}
          <div className="mt-5">
            <h2 className="text-sm font-semibold mb-2">Thank You Page</h2>

            {steps
              .filter((s) => s.type === "thankyou")
              .map((s) => (
                <div
                  key={s.key}
                  onClick={() => setStepKey(s.key)}
                  className={`p-2 rounded ${s.color} flex items-center gap-2 text-xs cursor-pointer`}
                >
                  {s.label}
                </div>
              ))}
          </div>
        </div>

        {/* ---------------- Canvas ---------------- */}
       <div className="w-[60%] p-4 overflow-hidden h-full">
         <div className="w-full h-10 bg-[#F3F4F6] rounded-md flex items-center px-3">
  <div className="flex gap-3">
    <button className="px-3 h-7 bg-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-100 transition"  onClick={() => setModalOpen(true)}>
      + Add Block
    </button>

    <button className="px-3 h-7 bg-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-100 transition"  onClick={() => setShowDesignPanel(true)}  >
      Design
    </button>
  </div>
</div>

         <div className="w-full h-[80vh] border border-dashed flex justify-center items-center mt-2">
          {steps.find((s) => s.key === stepKey) ? (
            <RenderStep
              step={steps.find((s) => s.key === stepKey)}
              updateSettings={updateStepSettings}
              onNext={() => {
                const idx = steps.findIndex((s) => s.key === stepKey);
                if (steps[idx + 1]) setStepKey(steps[idx + 1].key);
              }}
              designSettings={designSettings}
            />
          ) : (
            <div>Select a block</div>
          )}
         </div>
          
        </div>

        {/* ---------------- Settings ---------------- */}
        <div className="w-[25%] h-screen shadow-md bg-white p-4 overflow-y-auto">
          <SettingsPanel
            step={steps.find((s) => s.key === stepKey)}
            updateSettings={updateStepSettings}
          />
        </div>
      </div>

      {modalOpen && (
        <PreviewModel
          setModalOpen={setModalOpen}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          handleAddComponent={addStep}
          COMPONENTS={{}}
          ICON_MAP={ICON_MAP} 
        />
      )}

      {showDesignPanel && (
  <div className="fixed top-0 right-0 w-[360px] h-full bg-gray-50 shadow-2xl z-50 overflow-y-auto border-l border-gray-200">
    
    {/* Header with close button */}
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-base font-medium text-gray-900">Design Settings</h2>
      <button
        className="text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setShowDesignPanel(false)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div className="p-6 space-y-6">
      {/* Color Picker Item */}
      {[
        { label: 'Background', key: 'backgroundColor', hex: designSettings.backgroundColor },
        { label: 'Questions', key: 'textColor', hex: designSettings.textColor },
        { label: 'Answers', key: 'textColor', hex: designSettings.textColor },
        { label: 'Buttons', key: 'buttonColor', hex: designSettings.buttonColor },
        { label: 'Button Text', key: 'buttonTextColor', hex: designSettings.buttonTextColor },
        { label: 'Star Rating', key: 'buttonColor', hex: designSettings.buttonColor }
      ].map((item, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{item.label}</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={item.hex}
              readOnly
              className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-600"
            />
            <div className="relative">
              <input
                type="color"
                value={item.hex}
                onChange={(e) => {
                  if (item.key === 'backgroundColor') {
                    setDesignSettings((p) => ({ ...p, backgroundColor: e.target.value }));
                  } else if (item.key === 'textColor') {
                    setDesignSettings((p) => ({ ...p, textColor: e.target.value }));
                  } else if (item.key === 'buttonColor') {
                    setDesignSettings((p) => ({ ...p, buttonColor: e.target.value }));
                  } else if (item.key === 'buttonTextColor') {
                    setDesignSettings((p) => ({ ...p, buttonTextColor: e.target.value }));
                  }
                }}
                className="w-10 h-10 rounded-md cursor-pointer border-2 border-gray-300"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Note */}
      <div className="bg-gray-100 rounded-md p-3 text-xs text-gray-600">
        <strong>Note:</strong> Any changes made in the Design tab will be saved & published automatically.
      </div>

      {/* Alignment */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium text-gray-700">Alignment</label>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 p-3 bg-white border-2 border-gray-300 rounded-md hover:border-gray-400">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button className="flex-1 p-3 bg-white border-2 border-gray-300 rounded-md hover:border-gray-400">
            <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </button>
        </div>
      </div>

      {/* Font */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">Font</label>
          <button className="text-sm text-blue-600 hover:text-blue-700">+ Custom font</button>
        </div>
        <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700">
          <option>Inter</option>
        </select>
      </div>

      {/* Background Image */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-3">Background Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:border-gray-400 transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="bg-image"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              setDesignSettings((p) => ({ ...p, backgroundImage: url }));
            }}
          />
          <label htmlFor="bg-image" className="cursor-pointer">
            {designSettings.backgroundImage ? (
              <img
                src={designSettings.backgroundImage}
                className="max-h-32 mx-auto rounded-md"
                alt="Background preview"
              />
            ) : (
              <div>
                <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Select image</p>
              </div>
            )}
          </label>
        </div>
      </div>
    </div>
  </div>
)}


{showPublishModal && (
                <PublishModel setShowPublishModal={setShowPublishModal} formUrl={formUrl} handleCopy={handleCopy} copied={copied} />
            )}
    </div>
  );
}
