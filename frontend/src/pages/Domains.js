import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Domains() {
  const domains = useAppStore((s) => s.domains);
  const setSelectedDomain = useAppStore((s) => s.setSelectedDomain);
  const navigate = useNavigate();

  return (
    <MainLayout>
      <h2 className="text-3xl mb-6 text-center">Select Domain</h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(domains).map(([domain, score]) => (
          <button
            key={domain}
            onClick={() => {
              setSelectedDomain(domain);
              navigate("/jobs");
            }}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg"
          >
            {domain}
            <br />
            <span className="text-gray-500">{score}%</span>
          </button>
        ))}
      </div>
    </MainLayout>
  );
}