import { useState } from "react";

export default function SingleSelect({
  settings = {},
  onNext = () => {},
  designSettings = {},
  onAnswer = () => {}
}) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const isQuiz = settings.mode === "quiz";

  const handleSelect = (option, index) => {
    setSelected(index);

    const isCorrect = isQuiz && index === settings.correctAnswer;

    if (isQuiz) {
      setResult(isCorrect ? "correct" : "wrong");
    }

    onAnswer({
      answer: option.label,
      image: option.image || "",
      index,
      isCorrect
    });

    setTimeout(() => {
      setResult(null);
      onNext();
    }, isQuiz ? 900 : 0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
      <h2 className="text-3xl font-semibold text-center">
        {settings.title}
      </h2>

      {settings.description && (
        <div
          className="text-gray-600 text-sm text-center"
          dangerouslySetInnerHTML={{ __html: settings.description }}
        />
      )}

      {/* OPTIONS */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        {settings.options?.map((opt, i) => {
          // ✅ Normalize option (string → object)
          const option =
            typeof opt === "string"
              ? { label: opt, image: "" }
              : opt;

          return (
            <button
              key={i}
              onClick={() => handleSelect(option, i)}
              disabled={result !== null}
              className={`flex items-center gap-4 px-5 py-4 rounded-lg border transition text-left
                ${
                  selected === i
                    ? isQuiz
                      ? option && i === settings.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-blue-500 bg-blue-50"
                    : "bg-white hover:border-blue-400"
                }
              `}
            >
              {/* OPTION IMAGE */}
              {option.image && (
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              {/* OPTION TEXT */}
              <span className="text-base font-medium">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* QUIZ FEEDBACK */}
      {isQuiz && result === "correct" && (
        <div className="text-green-600 font-semibold">✅ Correct</div>
      )}

      {isQuiz && result === "wrong" && (
        <div className="text-red-600 font-semibold">❌ Incorrect</div>
      )}
    </div>
  );
}
