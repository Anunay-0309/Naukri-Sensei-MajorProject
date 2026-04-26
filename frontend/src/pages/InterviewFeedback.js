import { useLocation, useNavigate } from "react-router-dom";

export default function InterviewFeedback() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        No data available
      </div>
    );
  }

  const scores = data.scores || {};

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Space_Grotesk'] p-16">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="text-indigo-400 text-xs uppercase tracking-widest mb-4">
            Session Performance
          </div>

          <h1 className="text-6xl font-bold mb-4">
            Sensei Analysis
          </h1>

          <p className="text-zinc-400">
            {data.overall_feedback || "Your interview performance summary"}
          </p>
        </div>

        {/* SCORES */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">

          {Object.entries(scores).map(([key, value], i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5"
            >
              <div className="flex justify-between mb-4">
                <span className="text-zinc-400 capitalize">{key}</span>
                <span className="text-xl font-bold">{value}</span>
              </div>

              <div className="text-xs text-zinc-500">
                Performance metric
              </div>
            </div>
          ))}

        </div>

        {/* TIPS */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5">
            <h3 className="text-xl font-bold mb-6">
              Strengths
            </h3>

            <ul className="space-y-3">
              {data.strengths?.map((s, i) => (
                <li key={i} className="text-sm text-zinc-300">
                  • {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/20 border border-white/5">
            <h3 className="text-xl font-bold mb-6 text-red-400">
              Improvement Areas
            </h3>

            <ul className="space-y-3">
              {data.tips?.map((t, i) => (
                <li key={i} className="text-sm text-zinc-400">
                  • {t}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/options")}
            className="px-8 py-4 bg-indigo-500 rounded-full font-semibold hover:scale-105 transition"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}