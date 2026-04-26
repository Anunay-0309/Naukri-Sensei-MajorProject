import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateQuiz, submitQuiz } from "../services/api";

export default function Quiz() {
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [subjective, setSubjective] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD QUIZ =================
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await generateQuiz();

        console.log("QUIZ RESPONSE:", data);

        const mcqs = data.mcq || data.hard_mcq || [];
        const subjectiveQs = data.subjective || [];

        setQuiz(data);
        setAnswers(new Array(mcqs.length).fill(null));
        setSubjective(new Array(subjectiveQs.length).fill(""));
        setLoading(false);

      } catch (err) {
        console.error("Quiz load error:", err);
      }
    };

    loadQuiz();
  }, []);

  // ================= SELECT MCQ =================
  const selectOption = (qIndex, option) => {
    const copy = [...answers];
    copy[qIndex] = option;
    setAnswers(copy);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      const payload = {
        mcq_answers: answers,
        subjective_answers: subjective
      };

      const res = await submitQuiz(payload);

      console.log("QUIZ RESULT:", res);

      // ✅ FIXED NAVIGATION (NO ALERT)
      navigate("/radar", { state: res });

    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  // ================= LOADING =================
  if (loading || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <p className="text-zinc-400 text-lg">
          Preparing your personalized assessment…
        </p>
      </div>
    );
  }

  const mcqs = quiz.mcq || quiz.hard_mcq || [];
  const subjectiveQs = quiz.subjective || [];

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Space_Grotesk']">

      {/* HEADER */}
      <div className="p-8 flex justify-between items-center border-b border-white/5">
        <div className="text-xl font-bold">Sensei Quiz</div>
        <button
          onClick={() => navigate("/options")}
          className="px-4 py-2 border border-white/10 rounded-full text-xs hover:bg-white/5"
        >
          Exit Focus
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* ===== MCQs ===== */}
        {mcqs.map((q, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl"
          >
            <h3 className="text-xl mb-6 font-semibold leading-snug">
              {i + 1}. {q.question}
            </h3>

            <div className="space-y-4">
              {q.options.map((opt, j) => (
                <div
                  key={j}
                  onClick={() => selectOption(i, opt)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all flex justify-between items-center
                    ${
                      answers[i] === opt
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-white/10 hover:border-white/30"
                    }
                  `}
                >
                  <span>{opt}</span>

                  <div
                    className={`w-5 h-5 rounded-full border
                      ${
                        answers[i] === opt
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-white/30"
                      }
                    `}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ===== SUBJECTIVE ===== */}
        {subjectiveQs.map((q, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl"
          >
            <h3 className="text-xl mb-6 font-semibold leading-snug">
              {mcqs.length + i + 1}. {q.question}
            </h3>

            <textarea
              placeholder="Type your detailed answer here..."
              className="w-full h-40 bg-transparent border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-indigo-500/50 transition-all"
              value={subjective[i]}
              onChange={(e) => {
                const copy = [...subjective];
                copy[i] = e.target.value;
                setSubjective(copy);
              }}
            />
          </div>
        ))}

        {/* ===== SUBMIT BUTTON ===== */}
        <div className="flex justify-center pt-10">
          <button
            onClick={handleSubmit}
            className="px-12 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          >
            Submit Quiz
          </button>
        </div>

      </div>
    </div>
  );
}