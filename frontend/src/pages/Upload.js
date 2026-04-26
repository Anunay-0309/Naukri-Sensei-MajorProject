import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/api";
import { useAppStore } from "../store/useAppStore";

export default function Upload() {
  const navigate = useNavigate();

  const setDomains = useAppStore((s) => s.setDomains);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const data = await uploadResume(file);

      console.log("UPLOAD RESPONSE:", data);

      // ✅ IMPORTANT FIX
      setDomains(data.domain_scores || {});

      setLoading(false);
      navigate("/options");

    } catch (err) {
      console.error("Upload failed:", err);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-8 pt-24 text-center">
        <h1 className="text-6xl font-bold mb-4">Refine your destiny.</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Upload your resume to receive AI-driven insights and enlightened
          career guidance from the Sensei.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="max-w-4xl mx-auto px-8 mt-16">

        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

          {!loading ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center">

              {/* ICON */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-indigo-400 text-3xl">
                    upload
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-semibold mb-2">
                Upload your resume
              </h3>

              {/* BROWSE */}
              <p className="text-zinc-500 mb-4">
                Drag and drop or{" "}
                <span
                  className="text-indigo-400 cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  browse files
                </span>
              </p>

              <p className="text-xs text-zinc-600 mb-6">
                Supported formats: PDF
              </p>

              {/* HIDDEN INPUT */}
              <input
                id="fileInput"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />

              {/* FILE NAME */}
              {file && (
                <p className="text-sm text-zinc-400 mb-4">
                  Selected: {file.name}
                </p>
              )}

              {/* BUTTON */}
              <button
                onClick={handleUpload}
                className="px-8 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                Analyze Resume
              </button>

            </div>
          ) : (
            <div className="space-y-6 text-center">

              <p className="text-zinc-400 text-sm">
                Analyzing your resume...
              </p>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[70%] animate-pulse"></div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap text-xs">

                <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Extracting Skills
                </div>

                <div className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                  Parsing Experience
                </div>

                <div className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                  Verifying Certs
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}