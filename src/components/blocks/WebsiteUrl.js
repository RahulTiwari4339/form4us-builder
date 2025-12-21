export default function WebsiteUrl({ settings, onNext, designSettings }) {
  return (
    <div className="w-full flex justify-center items-center mt-6">
      <div className="flex flex-col gap-6 w-full max-w-lg">

        {/* Label */}
       <h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>

        {/* Underline input */}
        <input
          type="url"
          placeholder={settings.placeholder}
          className="
            w-full 
            border-b 
            border-gray-400 
            pb-2 
            outline-none 
            text-lg
            placeholder-gray-500
          "
        />

        {/* Next button */}
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
