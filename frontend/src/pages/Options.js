import React from "react";
import { useNavigate } from "react-router-dom";

export default function Options() {
  const navigate = useNavigate();

  const options = [
    {
      title: "Job Finder",
      desc: "Find your next big move with elite role matching.",
      icon: "work",
      btn: "Explore Jobs",
      path: "/domains",
    },
    {
      title: "Skill Quiz",
      desc: "Test your technical prowess and earn badges.",
      icon: "quiz",
      btn: "Start Quiz",
      path: "/quiz",
    },
    {
      title: "AI Interview",
      desc: "Practice with our AI mentor in real-time simulations.",
      icon: "settings_voice",
      btn: "Start Interview",
      path: "/interview",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-20 font-['Space_Grotesk']">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl font-bold tracking-tighter mb-4">
            Choose your path,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 text-transparent bg-clip-text">
              Strategist.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-xl">
            Your professional data has been synthesized. Select a module to begin your journey.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-8">
          {options.map((opt, i) => (
            <div
              key={i}
              className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              {/* ICON */}
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400">
                <span className="material-symbols-outlined">
                  {opt.icon}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold mb-3">{opt.title}</h3>

              {/* DESC */}
              <p className="text-zinc-400 mb-8 leading-relaxed">
                {opt.desc}
              </p>

              {/* BUTTON */}
              <button
                onClick={() => navigate(opt.path)}
                className="w-full py-4 rounded-xl border border-white/10 text-sm font-bold group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all"
              >
                {opt.btn} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* GLOBAL GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full"></div>

    </div>
  );
}