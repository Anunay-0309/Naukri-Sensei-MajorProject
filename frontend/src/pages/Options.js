import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Options() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="text-center">
        <h2 className="text-4xl mb-10 font-semibold">
          AI Career Dashboard
        </h2>

        <div className="flex flex-col gap-6 items-center">

          <button
            onClick={() => navigate("/domains")}
            className="w-72 bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            🎯 Job Match
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="w-72 bg-black text-white px-6 py-3 rounded-xl hover:scale-105 transition"
          >
            🧠 Skill Assessment Quiz
          </button>

          <button className="w-72 bg-gray-200 px-6 py-3 rounded-xl">
            ✍️ Resume Rewriter (Soon)
          </button>

          <button className="w-72 bg-gray-200 px-6 py-3 rounded-xl">
            📄 Resume Generator (Soon)
          </button>

        </div>
      </div>
    </MainLayout>
  );
}