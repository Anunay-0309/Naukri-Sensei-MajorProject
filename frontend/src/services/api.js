import axios from "axios";

const API = "http://localhost:8000";

// =========================
// RESUME
// =========================
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API}/upload_resume`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =========================
// JOBS
// =========================
export const fetchJobs = async (domain) => {
  const res = await axios.post(`${API}/domain_jobs`, {
    domain,
  });

  return res.data;
};

// =========================
// QUIZ
// =========================
export const generateQuiz = async () => {
  const res = await axios.post(`${API}/generate_quiz`);
  return res.data;
};

export const submitQuiz = async (answers) => {
  const res = await axios.post(`${API}/submit_quiz`, answers);
  return res.data;
};

// =========================
// INTERVIEW
// =========================
export const startInterview = async () => {
  const res = await axios.post(`${API}/start_interview`);
  return res.data;
};

export const submitInterviewAnswer = async (payload) => {
  const res = await axios.post(`${API}/submit_interview_answer`, payload);
  return res.data;
};

export const skipInterviewQuestion = async () => {
  const res = await axios.post(`${API}/skip_interview_question`);
  return res.data;
};

export const simplifyQuestion = async (question) => {
  const res = await axios.post(`${API}/simplify_question`, { question });
  return res.data;
};

export const endInterview = async () => {
  const res = await axios.post(`${API}/end_interview`);
  return res.data;
};