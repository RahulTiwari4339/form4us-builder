// components/blocks/ShortText.jsx
import React from "react";

export default function ShortText({ settings = {}, onNext = () => {}, designSettings = {} }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        backgroundColor: designSettings?.backgroundColor,
        backgroundImage: designSettings?.backgroundImage ? `url(${designSettings.backgroundImage})` : "none",
        backgroundSize: "cover",
      }}
    >
      <label className="text-xl font-semibold mb-3" style={{ color: designSettings?.textColor }}>{settings.label}</label>
      <input type="text" placeholder={settings.placeholder} className="w-[70%] border-b-2 border-gray-400 bg-transparent p-2 text-lg outline-none" style={{ color: designSettings?.textColor }} />
 <button
        onClick={onNext}
        className="mt-8 px-6 py-3 rounded text-white"
        style={{ backgroundColor: designSettings?.buttonColor, color: designSettings?.buttonTextColor }}
      >
        {settings.nextText || "Next"}
      </button>    </div>
  );
}
