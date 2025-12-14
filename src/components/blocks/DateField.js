export default function DateField({ settings, onNext, designSettings }) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 py-10">
      <h2 className="text-2xl font-semibold text-gray-700">
        {settings?.label || "Please select a date"}
      </h2>

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
