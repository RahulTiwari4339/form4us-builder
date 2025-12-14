// components/blocks/MultiSection.jsx
import React from "react";
import { FORM_META } from "@/config/formsMeta";

export default function MultiSection({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800">{settings.title}</h3>

      {/* Description */}
      {settings.description && (
        <p
          className="text-gray-600 text-sm"
          dangerouslySetInnerHTML={{ __html: settings.description }}
        />
      )}

      <div className="space-y-4">
        {settings.fields?.map((f, idx) => {
          const Component = FORM_META[f.type]?.component;
          if (!Component) return null;

          return (
            <div key={idx} className="bg-white p-3 rounded-md border">
              <Component
                settings={f}
                onChange={(val) =>
                  onChange?.({
                    ...settings,
                    fields: settings.fields.map((x, i) =>
                      i === idx ? { ...x, value: val } : x
                    )
                  })
                }
              />
            </div>
          );
        })}
      </div>


      {/* Button */}
      <button
        onClick={onNext}
        className="mt-8 px-6 py-3 rounded text-white"
        style={{ backgroundColor: designSettings?.buttonColor, color: designSettings?.buttonTextColor }}
      >
        {settings.nextText || "Next"}
      </button>
    </div>
  );
}
