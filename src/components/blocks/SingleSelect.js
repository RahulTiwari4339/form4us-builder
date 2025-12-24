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

  const handleSelect = (opt, index) => {
    setSelected(index);

    if (isQuiz) {
      const isCorrect = index === settings.correctAnswer;
      setResult(isCorrect ? "correct" : "wrong");

      onAnswer({
        answer: opt,
        index,
        isCorrect
      });

      setTimeout(() => {
        setResult(null);
        onNext();
      }, 900);
    } else {
      onAnswer({
        answer: opt,
        index
      });
      onNext();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
      <h2 className="text-3xl font-semibold">{settings.title}</h2>

      {settings.description && (
        <div
          className="text-gray-600 text-sm"
          dangerouslySetInnerHTML={{ __html: settings.description }}
        />
      )}

      <div className="flex flex-col gap-3 w-full max-w-md">
        {settings.options?.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt, i)}
            className={`px-6 py-3 rounded border transition
              ${
                selected === i
                  ? "border-blue-500 bg-blue-50"
                  : "bg-white"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isQuiz && result === "correct" && (
        <div className="text-green-600 font-semibold">✅ Correct</div>
      )}

      {isQuiz && result === "wrong" && (
        <div className="text-red-600 font-semibold">❌ Incorrect</div>
      )}
    </div>
  );

}
