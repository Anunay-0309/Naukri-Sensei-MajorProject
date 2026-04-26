import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function Domains() {
  const navigate = useNavigate();

  // ✅ USE YOUR STORE KEYS
  const domains = useAppStore((state) => state.domains);
  const setSelectedDomain = useAppStore((state) => state.setSelectedDomain);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-20 font-['Space_Grotesk']">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <h1 className="text-6xl font-bold tracking-tighter mb-4">
          Choose Your Domain
        </h1>

        <p className="text-zinc-400 mb-16 text-lg">
          Select your specialized field to begin your trajectory.
        </p>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {Object.entries(domains).map(([domain, score], i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedDomain(domain);
                navigate("/jobs");
              }}
              className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group hover:scale-[1.02]"
            >
              {/* ICON */}
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">
                  analytics
                </span>
              </div>

              {/* TITLE */}
              <h3 className="text-2xl font-bold mb-2">
                {domain}
              </h3>

              {/* SCORE */}
              <div className="text-indigo-400 text-xs font-bold uppercase tracking-widest">
                {score}% match
              </div>
            </div>
          ))}

        </div>

        {/* EMPTY STATE */}
        {Object.keys(domains).length === 0 && (
          <p className="text-zinc-500 mt-10 text-center">
            No domains found. Please upload resume again.
          </p>
        )}

      </div>
    </div>
  );
}