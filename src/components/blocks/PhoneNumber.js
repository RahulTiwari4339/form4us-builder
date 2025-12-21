// components/blocks/PhoneNumber.jsx
import React from "react";

export default function PhoneNumber({ settings, onChange, onNext, designSettings }) {
  return (
    <div className="space-y-2">
     <h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>

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
