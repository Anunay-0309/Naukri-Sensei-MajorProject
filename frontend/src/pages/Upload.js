import { useState } from "react";
import { uploadResume } from "../services/api";
import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const setDomains = useAppStore((s) => s.setDomains);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const data = await uploadResume(file);
      setDomains(data.domain_scores);
      navigate("/options");
    } catch (e) {
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="text-center">
        <h2 className="text-4xl mb-8 font-semibold">
          Upload Your Resume
        </h2>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6"
        />

        <br />

        <button
          onClick={handleUpload}
          className="bg-black text-white px-8 py-3 rounded-xl hover:scale-105 transition"
        >
          {loading ? "Analyzing Resume..." : "Upload"}
        </button>
      </div>
    </MainLayout>
  );
}