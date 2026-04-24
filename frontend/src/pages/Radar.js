import { useLocation } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
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
      <MainLayout>
        <div className="text-center mt-20 text-gray-500">
          No data available.
        </div>
      </MainLayout>
    );
  }

  const radarData = Object.entries(data.radar).map(([key, value]) => ({
    skill: key.replace("_", " "),
    value: value
  }));

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto mt-12">

        {/* ===== RADAR ===== */}
        <h2 className="text-4xl font-semibold text-center mb-10">
          Skill Radar
        </h2>

        <div className="w-full h-[350px] mb-16">
          <ResponsiveContainer>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fill: "#555", fontSize: 14 }}
              />
              <Radar
                dataKey="value"
                stroke="#000"
                fill="#000"
                fillOpacity={0.12}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ===== REVIEW ===== */}
        <h2 className="text-3xl font-semibold mb-10 text-center">
          Answer Review
        </h2>

        <div className="space-y-10">

          {data.review.map((q, i) => (
            <div key={i} className="border-b pb-8">

              {/* Question */}
              <h3 className="text-lg font-medium mb-4">
                {i + 1}. {q.question}
              </h3>

              {/* Options */}
              <div className="flex flex-col gap-3">

                {q.options.map((opt, j) => {
                  const isUser = opt === q.user_answer;
                  const isCorrect = opt === q.correct;

                  let style = "border rounded-xl px-5 py-3";

                  if (isCorrect) {
                    style += " bg-green-100 border-green-400";
                  } else if (isUser && !q.is_correct) {
                    style += " bg-red-100 border-red-400";
                  } else {
                    style += " bg-white";
                  }

                  return (
                    <div key={j} className={style}>
                      <div className="flex justify-between items-center">

                        <span>{opt}</span>

                        {/* Indicators */}
                        {isCorrect && (
                          <span className="text-green-600 text-xl">✓</span>
                        )}

                        {isUser && !q.is_correct && (
                          <span className="text-red-600 text-xl">✕</span>
                        )}

                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Explanation */}
              <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                {q.explanation}
              </p>

            </div>
          ))}

        </div>

      </div>
    </MainLayout>
  );
}