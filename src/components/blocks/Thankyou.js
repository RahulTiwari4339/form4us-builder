// components/blocks/Thankyou.jsx
import React from "react";

export default function Thankyou({ settings = {}, designSettings = {}, onNext = () => {}, buttonColor = "#000", buttonTextColor = "#fff" }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        backgroundColor: designSettings?.backgroundColor,
        backgroundImage: designSettings?.backgroundImage ? `url(${designSettings.backgroundImage})` : "none",
        backgroundSize: "cover",
      }}
    >
      <h1 className="text-4xl font-bold mb-4" style={{ color: designSettings?.textColor }}>{settings.title}</h1>
      <div className="text-center text-gray-700 text-lg" dangerouslySetInnerHTML={{ __html: settings.description }} />
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
