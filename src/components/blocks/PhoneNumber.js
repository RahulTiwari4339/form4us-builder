// components/blocks/PhoneNumber.jsx
import React from "react";

export default function PhoneNumber({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="space-y-2">
      <label className="text-gray-800 font-medium text-sm">
        {settings.label}
        {settings.required && <span className="text-red-500"> *</span>}
      </label>

      <div className="flex gap-2">
        <input
          className="w-20 border border-gray-300 p-3 rounded-md bg-gray-100 text-center"
          value={settings.countryCode || "+1"}
          readOnly
        />

        <input
          type="tel"
          className="flex-1 border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
          placeholder={settings.placeholder || "Enter phone number"}
          onChange={(e) => onChange?.(e.target.value)}
        />


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
