// components/blocks/AddressField.jsx
import React from "react";

export default function AddressField({ settings, onNext, designSettings }) {
      const { title, description, fields = [] } = settings;

  return (
     <div
      className="w-full h-full flex items-center px-4"
      style={{
        backgroundColor: designSettings?.backgroundColor,
        backgroundImage: designSettings?.backgroundImage
          ? `url(${designSettings.backgroundImage})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white w-full max-w-3xl p-8 rounded-lg">

        {/* Title + Description */}
        <h2 className="text-3xl font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-gray-500 mb-8">{description}</p>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {fields
            .filter((f) => !f.hidden)
            .map((field) => (
              <div key={field.key} className="w-full">
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  {field.label} {field.required && "*"}
                </label>

                {/* Phone Field */}
                {field.type === "phone" ? (
                  <div className="flex items-center border-b pb-1 gap-2">
                    {/* Country Flag + Code */}
                    <div className="flex items-center gap-1 text-gray-600">
                      <img
                        src="/mnt/data/27518bb9-36d9-46fb-a483-7656ecbcb02d.png"
                        alt="flag"
                        className="w-6 h-4 object-cover"
                      />
                      <span className="text-gray-700">+91</span>
                      <span className="text-gray-400">▾</span>
                    </div>

                    {/* phone number */}
                    <input
                      type="text"
                      className="flex-1 bg-transparent outline-none"
                      placeholder="081234 56789"
                    />
                  </div>
                ) : (
                  <input
                    type={field.type}
                    className="w-full border-b border-gray-300 focus:border-gray-500 outline-none pb-1"
                    placeholder={field.placeholder || field.label}
                  />
                )}
              </div>
            ))}
        </div>

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
    </div>
  );
}
