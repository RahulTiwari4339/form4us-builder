// components/blocks/Dropdown.jsx
import React from "react";

export default function Dropdown({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>

      <select
        className="w-full border border-gray-300 p-3 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none"
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">Select...</option>

        {settings.options?.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* Button */}
        <button
          onClick={onNext}
          className="mt-8 px-8 py-3 rounded-full font-semibold shadow-md transition w-auto"
          style={{
            backgroundColor: designSettings?.buttonColor || "#00F6FF",
            color: designSettings?.buttonTextColor || "#000"
          }}
        >
          Next
        </button>
    </div>
  );
}
