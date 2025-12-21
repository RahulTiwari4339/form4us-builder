export default function PhoneInput({ settings, onNext , designSettings}) {
  return (
    <div className="w-full flex justify-center items-center mt-20">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        {/* Title */}
        <h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>

        {/* Phone Field */}
        <div className="flex items-center gap-3 border-b pb-2 w-full">

          {/* Fake flag selector */}
          <button className="flex items-center gap-1 text-lg">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-gray-600">▼</span>
          </button>

          {/* Number Input */}
          <input
            type="tel"
            placeholder={settings.placeholder}
            className="flex-1 outline-none text-lg"
          />
        </div>

        {/* NEXT button */}
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
