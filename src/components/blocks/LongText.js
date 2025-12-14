// components/blocks/LongText.jsx
import React from "react";

export default function LongText({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="w-full space-y-2 p-4 flex justify-center item-center">
      <div className="w-full mx-20 my-20">
        <label className="text-gray-800 font-medium text-sm mb-6">
          {settings.label}
          {settings.required && <span className="text-red-500"> *</span>}
        </label>

        <div className="mt-5">
          <textarea
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
            placeholder={settings.placeholder}
            rows={4}
            onChange={(e) => onChange?.(e.target.value)}
          />
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


    </div>
  );
}
