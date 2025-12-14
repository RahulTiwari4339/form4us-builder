export default function WebsiteUrl({ settings, onNext, designSettings }) {
  return (
    <div className="w-full flex justify-center items-center mt-6">
      <div className="flex flex-col gap-6 w-full max-w-lg">

        {/* Label */}
        <label className="text-2xl font-semibold text-gray-700">
          {settings.label}
        </label>

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
