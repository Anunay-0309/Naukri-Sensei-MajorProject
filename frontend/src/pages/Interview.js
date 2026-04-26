import { useEffect, useState, useRef } from "react";
import {
  startInterview,
  submitInterviewAnswer,
  skipInterviewQuestion,
  simplifyQuestion,
  endInterview
} from "../services/api";
import { useAppStore } from "../store/useAppStore";
import { useNavigate } from "react-router-dom";

export default function Interview() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [started, setStarted] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const { resumeUploaded } = useAppStore();
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // 🔐 Redirect if no resume
  useEffect(() => {
    if (!resumeUploaded) {
      navigate("/upload");
    }
  }, [resumeUploaded, navigate]);

  // 🎤 Speak
  const speak = (text) => {
    return new Promise((resolve) => {
      if (!text) return resolve();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();

      utterance.voice =
        voices.find(v => v.name === "Google US English") || voices[0];

      utterance.rate = 0.95;

      utterance.onend = resolve;

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  };

  // 🎥 Camera
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  // 🚀 Start Interview
  const handleStartInterview = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      setStarted(true);
      await startCamera();

      const data = await startInterview();
      setQuestion(data.question);
    } catch {
      alert("Allow camera & mic");
    }
  };

  // 🔄 Ask question
  useEffect(() => {
    if (question && started) {
      (async () => {
        await speak(question.question);
        startListening();
      })();
    }
  }, [question]);

  // 🎤 Listening
  const startListening = () => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;

    recognitionRef.current = recognition;

    let transcript = "";
    let timer;

    recognition.start();
    setListening(true);

    recognition.onresult = (e) => {
      const text = e.results[e.results.length - 1][0].transcript;
      transcript += " " + text;
      setAnswer(transcript);

      clearTimeout(timer);

      timer = setTimeout(() => {
        if (transcript.trim().length > 3) {
          recognition.stop();
          setListening(false);
          handleSubmit(transcript);
        }
      }, 1500);
    };
  };

  // 🚀 Submit
  const handleSubmit = async (ans) => {
    const res = await submitInterviewAnswer({
      question_id: question.id,
      answer: ans
    });

    setFeedback(res.feedback);

    await speak(res.feedback);

    if (res.interview_complete) {
      const report = await endInterview();
      navigate("/interview-feedback", { state: report });
    } else {
      setQuestion(res.next_question);
    }

    setAnswer("");
  };

  const handleSkip = async () => {
    const res = await skipInterviewQuestion();
    setQuestion(res.next_question);
  };

  const handleSimplify = async () => {
    const res = await simplifyQuestion(question.question);
    setQuestion({ ...question, question: res.simplified_question });
  };

  // 🟢 START SCREEN
  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="text-4xl mb-6">AI Interview Practice</h1>
        <button
          onClick={handleStartInterview}
          className="px-6 py-3 bg-indigo-500 rounded-xl"
        >
          Start Interview
        </button>
      </div>
    );
  }

  // 🎤 MAIN UI
  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">

      {/* HEADER */}
      <header className="p-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/options")}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Exit Session
        </button>

        <div className="text-xs bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
          Sensei Live
        </div>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <div className="mb-6 text-indigo-400 text-sm">
          {listening ? "🎤 Listening..." : "Thinking..."}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
          "{question?.question}"
        </h1>

        <p className="text-zinc-500 mt-4">
          Speak naturally. Pause to submit.
        </p>

      </div>

      {/* CONTROLS */}
      <div className="p-10 grid grid-cols-3 items-center">

        {/* LEFT */}
        <div className="space-y-3">
          <button
            onClick={handleSimplify}
            className="px-4 py-2 bg-zinc-900 rounded-xl border"
          >
            Simplify
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-zinc-900 rounded-xl border"
          >
            Skip
          </button>
        </div>

        {/* MIC */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
            🎤
          </div>

          {/* fake visualizer */}
          <div className="flex gap-1 mt-4">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/40 animate-pulse"
                style={{ height: `${20 + Math.random() * 50}px` }}
              />
            ))}
          </div>
        </div>

        {/* CAMERA */}
        <div className="flex flex-col items-end">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-40 rounded-xl border border-white/10"
          />

          <button
            onClick={async () => {
              const report = await endInterview();
              navigate("/interview-feedback", { state: report });
            }}
            className="mt-4 px-4 py-2 bg-red-500 rounded-xl"
          >
            End
          </button>
        </div>

      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 px-6 py-3 rounded-xl text-sm">
          {feedback}
        </div>
      )}
    </div>
  );
}