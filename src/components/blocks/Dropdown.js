// components/blocks/Dropdown.jsx
import React from "react";

export default function Dropdown({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-800 font-medium text-sm">
        {settings.label}
        {settings.required && <span className="text-red-500"> *</span>}
      </label>

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
