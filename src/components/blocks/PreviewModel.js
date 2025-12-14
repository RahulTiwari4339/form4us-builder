import React, { useEffect } from "react";
import { X, User } from "lucide-react";
import { FORM_META } from "@/config/formsMeta";
import { ICON_MAP } from "@/config/iconMap";


const AVAILABLE_COMPONENTS = Object.keys(FORM_META).map((key) => ({
  type: key,
  label: FORM_META[key].label,
  color: FORM_META[key].color || "bg-gray-500",
  icon: FORM_META[key].icon,
  component: FORM_META[key].component
}));

export default function PreviewModel({
  setModalOpen,
  selectedComponent,
  setSelectedComponent,
  handleAddComponent,
  ICON_MAP,
}) {
  // ESC close
  useEffect(() => {
    const closeOnEsc = (e) => e.key === "Escape" && setModalOpen(false);
    window.addEventListener("keydown", closeOnEsc);
    return () => window.removeEventListener("keydown", closeOnEsc);
  }, []);

  const PreviewComponent = selectedComponent?.component || null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setModalOpen(false)}
      />

      {/* MODAL WRAPPER */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[70%] h-[90vh] bg-white rounded-xl shadow-2xl relative overflow-hidden flex p-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-3 right-3 bg-gray-200 p-1 rounded-full hover:bg-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT SIDEBAR */}
          <div className="w-[25%] border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Choose a block</h3>

            <div className="flex flex-col gap-2">
              {AVAILABLE_COMPONENTS.map((item) => {
                  const Icon = ICON_MAP[item.icon]

                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedComponent(item)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
                      text-black text-[12px] shadow-sm
                      ${item.color}
                      hover:opacity-80
                    `}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PREVIEW AREA */}
          <div className="w-[75%] p-4 overflow-y-auto mt-10 p-10">

            {selectedComponent && PreviewComponent ? (
              <>
                {/* Preview Box */}
                <div className="border rounded-xl overflow-hidden shadow mt-4 p-4">
                  <PreviewComponent
                    previewOnly
                    settings={FORM_META[selectedComponent.type].default}
                    onNext={() => {}}
                    designSettings={{}}
                  />
                </div>

                {/* USE BUTTON */}
                <div className="flex justify-center">
                  <button
                    onClick={() => handleAddComponent(selectedComponent)}
                    className="mt-6 bg-black text-white px-5 py-3 rounded-lg"
                  >
                    Use this Block
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-600">
                Select a block to preview
              </p>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
