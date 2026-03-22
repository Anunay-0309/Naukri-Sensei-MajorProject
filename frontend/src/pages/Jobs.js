import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { fetchJobs } from "../services/api";
import MainLayout from "../layout/MainLayout";

export default function Jobs() {
  const selectedDomain = useAppStore((s) => s.selectedDomain);
  const jobs = useAppStore((s) => s.jobs);
  const setJobs = useAppStore((s) => s.setJobs);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setJobs([]);   // IMPORTANT: remove flicker

      const data = await fetchJobs(selectedDomain);
      setJobs(data.jobs);

      setLoading(false);
    };

    loadJobs();
  }, [selectedDomain]);

  return (
    <MainLayout>
      <h2 className="text-4xl mb-8 font-semibold text-center">
        Job Matches
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">
          Finding best opportunities...
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>

              <p className="text-gray-600">{job.company}</p>

              <p className="text-gray-400">{job.location}</p>

              <p className="text-blue-500 mt-2">
                Match Score: {job.match_score}%
              </p>

              <a
                href={job.apply_link}
                target="_blank"
                className="text-black underline mt-2 inline-block"
              >
                Apply
              </a>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}