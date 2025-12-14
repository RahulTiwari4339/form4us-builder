// components/blocks/SingleSelect.jsx
import React from "react";

export default function SingleSelect({ settings = {}, onNext = () => {}, designSettings = {} }) {
  const { backgroundColor = "#fff", backgroundImage = "", textColor = "#000", buttonColor = "#000", buttonTextColor = "#fff" } = designSettings || {};
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8"
      style={{
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
      }}
    >
      <h2 className="text-3xl font-semibold mb-4" style={{ color: textColor }}>{settings.title}</h2>
      <div className="flex flex-col gap-3">
        {settings.options?.map((opt, i) => (
          <button key={i} className="px-6 py-2 rounded border bg-white shadow-sm">{opt}</button>
        ))}
      </div>
 <button
        onClick={onNext}
        className="mt-8 px-6 py-3 rounded text-white"
        style={{ backgroundColor: designSettings?.buttonColor, color: designSettings?.buttonTextColor }}
      >
        {settings.nextText || "Next"}
      </button>    </div>
  );
}
