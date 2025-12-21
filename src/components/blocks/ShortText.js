// components/blocks/ShortText.jsx
import React from "react";

export default function ShortText({ settings = {}, onNext = () => {}, designSettings = {} }) {
  const { title, description, fields = [] } = settings;
  console.log("ShortText settings:", settings);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{
        backgroundColor: designSettings?.backgroundColor,
        backgroundImage: designSettings?.backgroundImage ? `url(${designSettings.backgroundImage})` : "none",
        backgroundSize: "cover",
      }}
    >
<h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>      <input type="text" placeholder={settings.placeholder} className="w-[70%] border-b-2 border-gray-400 bg-transparent p-2 text-lg outline-none" style={{ color: designSettings?.textColor }} />
 <button
        onClick={onNext}
        className="mt-8 px-6 py-3 rounded text-white"
        style={{ backgroundColor: designSettings?.buttonColor, color: designSettings?.buttonTextColor }}
      >
        {settings.nextText || "Next"}
      </button>    </div>
  );
}
