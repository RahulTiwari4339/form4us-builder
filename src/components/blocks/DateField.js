export default function DateField({ settings, onNext, designSettings }) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 py-10">
      <h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>

      <input
        type="date"
        className="w-64 text-center border-b-2 border-gray-400 bg-transparent focus:outline-none focus:border-black text-lg"
        placeholder="dd-mm-yyyy"
      />

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
  );
}
