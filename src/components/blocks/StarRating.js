import { Star } from "lucide-react";
import { useState } from "react";

export default function StarRating({ settings , onNext , designSettings}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col gap-3">
<h2 className="text-3xl font-semibold text-gray-800 mt-5mb-5">{settings.title}</h2>
        <div
                        className=" text-gray-600 text-sm mb-5 mt-5"
                        dangerouslySetInnerHTML={{ __html: settings.description }}
                    ></div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={40} // ⬅ Bigger star size
            className={`cursor-pointer transition-all 
              ${
                (hover || rating) >= n
                  ? "text-yellow-500 fill-yellow-400 drop-shadow-md"
                  : "text-gray-300"
              }
              hover:scale-110
            `}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      {/* Button */}
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
