// pages/form/[formId].js
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Plus, Copy, Trash2, User, Play, Settings, Component } from "lucide-react";
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
import PreviewRenderer from "../Preview/PreviewRenderer";
import DesignModel from "../Preview/DesignModel";


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
  const [showPreview, setShowPreview] = useState(false);




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
      <FormHeader isEditingTitle={isEditingTitle} formTitle={formTitle} setFormTitle={setFormTitle} setIsEditingTitle={setIsEditingTitle} handleSave={handleSave} form={form} />


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
            {/* Left + Right container */}
            <div className="flex w-full items-center justify-between">

              {/* Left actions */}
              <div className="flex items-center gap-3">
                <button
                  className="cursor-pointer px-3 h-7 bg-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-100 transition"
                  onClick={() => setModalOpen(true)}
                >
                  + Add Block
                </button>

                <button
                  onClick={() => setShowDesignPanel(true)}
                  className="cursor-pointer flex items-center gap-2 px-3 h-7 bg-white rounded-md text-sm font-medium shadow-sm hover:bg-gray-100 transition"
                >
                  <Component className="h-4 w-4" />
                  <span>Design</span>
                </button>

                <button
                  title="Preview"
                  onClick={() => setShowPreview(true)}
                  className="cursor-pointer flex items-center justify-center h-7 w-7 bg-white rounded-md shadow-sm hover:bg-gray-100 transition"
                >
                  <Play className="h-4 w-4" />
                </button>

                <button
                  title="Settings"
                  className="cursor-pointer flex items-center justify-center h-7 w-7 bg-white rounded-md shadow-sm hover:bg-gray-100 transition"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>

              {/* Right action */}
              <button className="cursor-pointer px-3 h-7 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition">
                Buy Pro
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
      <DesignModel
        designSettings={designSettings}
        setShowDesignPanel={setShowDesignPanel}
        setDesignSettings={setDesignSettings}
      />
      )}

      {
        showPreview && (
          <PreviewRenderer steps={steps} designSettings={designSettings} setShowPreview={setShowPreview} />

        )
      }


      {showPublishModal && (
        <PublishModel setShowPublishModal={setShowPublishModal} formUrl={formUrl} handleCopy={handleCopy} copied={copied} />
      )}
    </div>
  );
}
