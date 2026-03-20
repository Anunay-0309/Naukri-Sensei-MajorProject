import { useState } from "react";
import axios from "axios";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

export default function App() {

  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [subjective, setSubjective] = useState({});
  const [result, setResult] = useState(null);

  const uploadResume = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://127.0.0.1:8000/upload_resume", formData);
    setQuiz(res.data.quiz);
  };

  const selectOption = (qid, optionIndex) => {
    setAnswers({ ...answers, [qid]: optionIndex });
  };

  const submitQuiz = async () => {

    const subjective_answers = Object.keys(subjective).map(skill => ({
      skill,
      answer: subjective[skill]
    }));

    const res = await axios.post("http://127.0.0.1:8000/submit_quiz", {
      answers,
      subjective_answers
    });

    setResult(res.data);
  };

  const radarData = result ? [
    { subject: "Conceptual", value: result.radar_metrics.conceptual_knowledge },
    { subject: "Practical", value: result.radar_metrics.practical_understanding },
    { subject: "Depth", value: result.radar_metrics.project_depth },
    { subject: "Confidence", value: result.radar_metrics.confidence },
    { subject: "Authenticity", value: result.radar_metrics.resume_authenticity }
  ] : [];

  return (
    <div className="min-h-screen bg-white p-10">

      <h1 className="text-5xl font-light mb-10 text-center">AI Resume Intelligence</h1>

      {!quiz && (
        <div className="text-center">
          <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
          <br/><br/>
          <button onClick={uploadResume} className="px-6 py-3 bg-black text-white rounded-full">
            Generate Quiz
          </button>
        </div>
      )}

      {quiz && !result && (
        <div className="max-w-3xl mx-auto">

          <h2 className="text-2xl mb-6">MCQ Questions</h2>

          {quiz.mcqs.map(q => (
            <div key={q.id} className="mb-6 p-4 border rounded-xl">
              <p className="mb-2">{q.question}</p>
              {q.options.map((opt, i) => (
                <div key={i}>
                  <input type="radio"
                    name={`q${q.id}`}
                    onChange={()=>selectOption(q.id, i)}
                  /> {opt}
                </div>
              ))}
            </div>
          ))}

          <h2 className="text-2xl mt-10 mb-4">Subjective</h2>

          {quiz.subjective.map((q, i) => (
            <div key={i} className="mb-6">
              <p>{q.question}</p>
              <textarea
                className="w-full border p-2"
                onChange={(e)=>setSubjective({
                  ...subjective,
                  [q.skill]: e.target.value
                })}
              />
            </div>
          ))}

          <button onClick={submitQuiz}
            className="px-8 py-3 bg-black text-white rounded-full mt-4">
            Submit Quiz
          </button>

        </div>
      )}

      {result && (
        <div className="flex justify-center mt-10">
          <RadarChart outerRadius={150} width={500} height={400} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar dataKey="value" stroke="#000" fill="#000" fillOpacity={0.3}/>
          </RadarChart>
        </div>
      )}

    </div>
  );
}