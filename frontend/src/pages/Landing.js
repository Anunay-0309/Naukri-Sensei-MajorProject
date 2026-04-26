import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-['Space_Grotesk'] overflow-x-hidden">

      {/* GLOBAL GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-indigo-500 to-violet-500 text-transparent bg-clip-text">
            Naukri-Sensei
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <span className="hover:text-white cursor-pointer">Jobs</span>
            <span className="hover:text-white cursor-pointer">Quiz</span>
            <span className="hover:text-white cursor-pointer">Interview</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-40 pb-24 px-8 text-center relative">

        {/* HERO GLOW */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent blur-3xl -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-8">
          Kinetic Noir AI Mentorship
        </div>

        <h1 className="text-7xl font-bold tracking-tighter mb-6">
          Naukri-Sensei
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Your AI Career Mentor for Jobs, Skills, and Interviews
        </p>

        <p className="text-zinc-500 max-w-2xl mx-auto mt-4 mb-12">
          An all-in-one AI career assistant. Upload your resume, get job matches,
          take skill-based quizzes, and practice real-time AI interviews.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
        >
          Get Started
        </button>

        {/* HERO IMAGE */}
        <div className="mt-20 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
            alt="dashboard"
            className="w-full opacity-80"
          />
        </div>
      </section>

      {/* FEATURES */}
      <div className="max-w-7xl mx-auto px-8 space-y-40 py-20">

        {/* JOBS */}
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 transition-all duration-300 hover:scale-[1.02]">
            <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                className="h-[250px] w-full object-cover rounded-2xl"
                alt="jobs"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Personalized Jobs</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Stop hunting and start landing. Our AI engine scans thousands of listings
              to match you with roles aligned to your skills, experience, and career goals.
            </p>
          </div>
        </div>

        {/* QUIZ */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-20">
          <div className="flex-1 transition-all duration-300 hover:scale-[1.02]">
            <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <img
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                className="h-[250px] w-full object-cover rounded-2xl"
                alt="quiz"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Skill Assessment</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Validate your expertise through adaptive quizzes designed to test
              real-world knowledge and problem-solving ability.
            </p>
          </div>
        </div>

        {/* INTERVIEW */}
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 transition-all duration-300 hover:scale-[1.02]">
            <div className="rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <img
                src="https://images.unsplash.com/photo-1581091870627-3a8f8d0b2f8c"
                className="h-[250px] w-full object-cover rounded-2xl"
                alt="interview"
              />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Live AI Interview</h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Practice real-time AI interviews with voice interaction and receive
              instant feedback on fluency, confidence, and technical depth.
            </p>
          </div>
        </div>

      </div>

      {/* CTA */}
      <section className="py-32 px-8 text-center">
        <div className="max-w-4xl mx-auto bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl py-20 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <h2 className="text-5xl font-bold mb-6">
            Ready for enlightenment?
          </h2>

          <p className="text-zinc-400 mb-10">
            Join thousands of users accelerating their careers with AI.
          </p>

          <button
            onClick={() => navigate("/upload")}
            className="px-10 py-4 bg-indigo-500 hover:bg-indigo-600 rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
          
          <div className="mb-4 md:mb-0">
            <span className="text-white font-semibold">Naukri-Sensei</span> © 2026
          </div>

          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Support</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>

        </div>
      </footer>

    </div>
  );
}