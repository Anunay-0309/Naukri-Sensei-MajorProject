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
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState(null);
  const [listening, setListening] = useState(false);
  const [started, setStarted] = useState(false);

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const { resumeUploaded } = useAppStore();
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // 🔐 Redirect
  useEffect(() => {
    if (!resumeUploaded) {
      navigate("/upload");
    }
  }, [resumeUploaded, navigate]);

  // 🎤 Better voice (less robotic)
  const speak = (text) => {
  return new Promise((resolve) => {
    if (!text) return resolve();

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    const selected =
      voices.find(v => v.name === "Google US English") ||
      voices[0]; // fallback

    if (selected) utterance.voice = selected;

    utterance.rate = 0.95;

    utterance.onend = () => resolve();

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
};

  // 🎥 Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🚀 Start Interview
  const handleStartInterview = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStarted(true);
      await startCamera();

      const data = await startInterview();
      setQuestion(data.question);

    } catch {
      alert("Allow camera & microphone");
    }
  };

  // 🔄 Flow
  useEffect(() => {
    if (question && started) {
      (async () => {
        await speak(question.question);
        startListening();
      })();
    }
  // eslint-disable-next-line
  }, [question]);

  // 🎤 Listening
  const startListening = () => {
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognitionRef.current = recognition;

    let finalTranscript = "";
    let silenceTimer;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      finalTranscript = finalTranscript + " " + transcript;
      setAnswer(finalTranscript);

      const SILENCE_LIMIT = 1500; // 1.5 sec (faster)

    clearTimeout(silenceTimer);

    silenceTimer = setTimeout(() => {
  if (finalTranscript.trim().length > 3) {
        recognition.stop();
        setListening(false);
        handleAutoSubmit(finalTranscript);
    }
    }, SILENCE_LIMIT);
    };

    recognition.onend = () => setListening(false);
  };

  // 🧠 No response
  const handleNoResponse = async () => {
    const fallback =
      "Let's move ahead. Try to give a brief structured answer next time.";

    setFeedback(fallback);
    await speak(fallback);

    setQuestion((prev) => prev); // trigger next via backend flow
  };

  // 🚀 Auto submit
  const handleAutoSubmit = async (autoAnswer) => {
    if (!autoAnswer.trim()) {
      await handleNoResponse();
      return;
    }

    try {
      const res = await submitInterviewAnswer({
        question_id: question.id,
        answer: autoAnswer
      });

      // 🔥 varied feedback tone (frontend variation)
      const variations = [
        res.feedback,
        "That was a decent attempt. " + res.feedback,
        "Good effort. " + res.feedback,
        "Interesting answer. " + res.feedback
      ];

      const randomFeedback =
        variations[Math.floor(Math.random() * variations.length)];

      setFeedback(randomFeedback);
      setAnswer("");

      await speak(randomFeedback);

      if (res.interview_complete) {
        handleEndInterview();
      } else {
        setQuestion(res.next_question);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // ⛔ End interview
  const handleEndInterview = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      speechSynthesis.cancel();

      const reportData = await endInterview();

      setCompleted(true);
      setReport(reportData);

    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    const res = await skipInterviewQuestion();
    setQuestion(res.next_question);
  };

  const handleSimplify = async () => {
    const res = await simplifyQuestion(question.question);
    setQuestion({
      ...question,
      question: res.simplified_question
    });
  };

  // 🟢 Start screen
  if (!started) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-semibold">AI Interview Practice</h1>
        <button
          onClick={handleStartInterview}
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          Start Interview
        </button>
      </div>
    );
  }

  // 📊 Report
  if (completed) {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">
          Interview Report
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.entries(report.scores || {}).map(([k, v]) => (
            <div key={k} className="bg-gray-100 p-4 rounded-xl">
              <p className="text-sm">{k}</p>
              <p className="text-xl font-semibold">{v}</p>
            </div>
          ))}
        </div>

        <p>{report.overall_feedback}</p>

        <ul className="list-disc ml-6">
          {report.tips?.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6">

      <div className="max-w-2xl bg-gray-50 p-6 rounded-xl mb-6">
        {question?.question}
      </div>

      <textarea
        value={answer}
        readOnly
        className="w-full max-w-2xl p-4 border rounded-xl mb-4"
        rows={4}
      />

      <div className="flex gap-3 mb-6">
        <button onClick={handleSkip} className="border px-4 py-2 rounded-full">
          Skip
        </button>

        <button onClick={handleSimplify} className="border px-4 py-2 rounded-full">
          Simplify
        </button>

        <button
          onClick={handleEndInterview}
          className="bg-red-500 text-white px-4 py-2 rounded-full"
        >
          End Interview
        </button>
      </div>

      {feedback && <p className="italic">{feedback}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        className="fixed bottom-6 right-6 w-40 rounded-xl"
      />
    </div>
  );
}