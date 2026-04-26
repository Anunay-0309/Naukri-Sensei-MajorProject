import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { fetchJobs } from "../services/api";

export default function Jobs() {
  const selectedDomain = useAppStore((s) => s.selectedDomain);
  const jobs = useAppStore((s) => s.jobs);
  const setJobs = useAppStore((s) => s.setJobs);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      if (!selectedDomain) return;

      setLoading(true);
      setJobs([]);

      try {
        const data = await fetchJobs(selectedDomain);

        console.log("JOBS RESPONSE:", data);

        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadJobs();
  }, [selectedDomain]);

  return (
    <div className="min-h-screen bg-[#050505] text-white px-8 py-16">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-xs uppercase text-indigo-400 tracking-widest">
              AI Recommendations
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Recommended for You
          </h1>

          <p className="text-zinc-400">
            Based on your selected domain:{" "}
            <span className="text-indigo-400">{selectedDomain}</span>
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-zinc-500">
            Finding best opportunities...
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {jobs.map((job, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 relative hover:bg-zinc-900/60 transition-all group"
              >

                {/* MATCH BADGE */}
                <div className="absolute top-6 right-6 px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-bold">
                  {job.match_score || "80"}% Match
                </div>

                {/* COMPANY LOGO (FIXED 🔥) */}
                <div className="w-12 h-12 mb-6">
                  <img
                    src={`https://logo.clearbit.com/${job.company
                      ?.toLowerCase()
                      .replace(/\s/g, "")}.com`}
                    alt="logo"
                    className="w-full h-full object-contain rounded-xl bg-white/5 p-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />

                  {/* FALLBACK */}
                  <div className="hidden w-full h-full rounded-xl bg-indigo-500/20 items-center justify-center text-indigo-400 font-bold">
                    {job.company?.[0]}
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-xl font-bold mb-1">
                  {job.title}
                </h3>

                {/* COMPANY */}
                <p className="text-zinc-500 mb-4">
                  {job.company}
                </p>

                {/* LOCATION */}
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6">
                  <span className="material-symbols-outlined text-sm">
                    location_on
                  </span>
                  {job.location}
                </div>

                {/* APPLY BUTTON */}
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 bg-indigo-500 text-white text-sm font-bold rounded-lg hover:scale-105 transition-all"
                >
                  Apply Now
                </a>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}