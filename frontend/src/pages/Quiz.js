import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { generateQuiz, submitQuiz } from "../services/api";

export default function Quiz() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [subjective, setSubjective] = useState(["", ""]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await generateQuiz();

        console.log("QUIZ RESPONSE:", data);   // IMPORTANT DEBUG

        // Safe extraction of MCQs
        const mcqs = data.mcq || data.hard_mcq || [];

        setQuiz(data);
        setAnswers(new Array(mcqs.length).fill(null));
        setLoading(false);

      } catch (err) {
        console.error("Quiz load error:", err);
      }
    };

    loadQuiz();
  }, []);

  if (loading || !quiz) {
    return (
      <MainLayout>
        <div className="flex h-[70vh] items-center justify-center text-xl text-gray-400">
          Preparing your personalized assessment…
        </div>
      </MainLayout>
    );
  }

  const mcqs = quiz.mcq || quiz.hard_mcq || [];
  const subjectiveQs = quiz.subjective || [];

  const selectOption = (qIndex, option) => {
    const copy = [...answers];
    copy[qIndex] = option;
    setAnswers(copy);
  };

  const submit = async () => {
    try {
      const payload = {
        mcq_answers: answers,
        subjective_answers: subjective
      };

      const res = await submitQuiz(payload);

      navigate("/radar", { state: res });

    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto mt-12">

        <h2 className="text-4xl font-semibold mb-10 text-center">
          Skill Assessment
        </h2>

        {/* MCQs */}
        <div className="space-y-12">
          {mcqs.map((q, i) => (
            <div key={i}>

              <h3 className="text-xl mb-4 font-medium leading-snug">
                {i + 1}. {q.question}
              </h3>

              <div className="flex flex-col gap-3">
                {q.options.map((opt, j) => (
                  <button
                    key={j}
                    onClick={() => selectOption(i, opt)}
                    className={`border rounded-xl px-5 py-3 text-left transition
                      ${answers[i] === opt
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Subjective */}
        <div className="mt-16 space-y-10">

          {subjectiveQs.map((q, i) => (
            <div key={i}>
              <h3 className="text-xl mb-3 font-medium">
                {mcqs.length + i + 1}. {q.question}
              </h3>

              <textarea
                className="w-full border rounded-xl p-4 h-40 focus:outline-none focus:ring"
                placeholder="Write your answer..."
                value={subjective[i]}
                onChange={(e) => {
                  const copy = [...subjective];
                  copy[i] = e.target.value;
                  setSubjective(copy);
                }}
              />
            </div>
          ))}

        </div>

        {/* Submit */}
        <div className="flex justify-center mt-20 mb-20">
          <button
            onClick={submit}
            className="px-12 py-4 bg-black text-white rounded-full hover:opacity-80 transition"
          >
            Submit Assessment
          </button>
        </div>

      </div>
    </MainLayout>
  );
}