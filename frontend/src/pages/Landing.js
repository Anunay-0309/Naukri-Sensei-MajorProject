import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="text-center">
  <h1 className="text-7xl font-semibold mb-6">
    Naukri Sensei
  </h1>

  <p className="text-gray-500 text-lg mb-12 max-w-xl mx-auto">
    Discover your career direction using AI-powered resume intelligence,
    skill mapping and real-time job matching.
  </p>

  <button
    onClick={() => navigate("/upload")}
    className="bg-black text-white px-10 py-4 rounded-2xl hover:scale-105 transition"
  >
    Start Now
  </button>
</div>
    </MainLayout>
  );
}