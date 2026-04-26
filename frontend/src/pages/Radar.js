import { useLocation } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts";

export default function RadarPage() {
  const location = useLocation();
  const data = location.state;

  if (!data || !data.radar) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <p className="text-zinc-400">No data available.</p>
      </div>
    );
  }

  // ===== RADAR DATA =====
  const radarData = Object.entries(data.radar).map(([key, value]) => ({
    skill: key.replace("_", " "),
    value: value
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Space_Grotesk']">

      <div className="max-w-6xl mx-auto px-8 py-16">

        {/* ===== TITLE ===== */}
        <h1 className="text-5xl font-bold mb-12">
          Career Radar Analysis
        </h1>

        {/* ===== RADAR ===== */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-10 mb-20">
          <h2 className="text-xl mb-6 text-zinc-300">Skill Topology</h2>

          <div className="w-full h-[400px]">
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#aaa", fontSize: 12 }}
                />
                <Radar
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===== ANSWER REVIEW ===== */}
        <h2 className="text-3xl font-semibold mb-10">
          Answer Review
        </h2>

        <div className="space-y-12">

          {data.review?.map((q, i) => (
            <div
              key={i}
              className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6"
            >

              {/* QUESTION */}
              <h3 className="text-lg mb-4">
                {i + 1}. {q.question}
              </h3>

              {/* OPTIONS */}
              <div className="space-y-3">

                {q.options.map((opt, j) => {
                  const isUser = opt === q.user_answer;
                  const isCorrect = opt === q.correct;

                  let style =
                    "px-4 py-3 rounded-xl border flex justify-between items-center";

                  if (isCorrect) {
                    style += " border-green-500 bg-green-500/10";
                  } else if (isUser && !q.is_correct) {
                    style += " border-red-500 bg-red-500/10";
                  } else {
                    style += " border-white/10";
                  }

                  return (
                    <div key={j} className={style}>
                      <span>{opt}</span>

                      {/* ICONS */}
                      {isCorrect && (
                        <span className="text-green-400">✔</span>
                      )}

                      {isUser && !q.is_correct && (
                        <span className="text-red-400">✕</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* EXPLANATION */}
              {q.explanation && (
                <p className="text-zinc-400 mt-4 text-sm">
                  {q.explanation}
                </p>
              )}
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}