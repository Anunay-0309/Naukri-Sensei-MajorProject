const BASE_URL = "http://127.0.0.1:8000";

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload_resume`, {
    method: "POST",
    body: formData
  });

  return res.json();
};

export const fetchJobs = async (domain) => {
  const res = await fetch(`${BASE_URL}/domain_jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ domain })
  });

  return res.json();
};

export const generateQuiz = async () => {
  const res = await fetch(`${BASE_URL}/generate_quiz`, {
    method: "POST"
  });

  return res.json();
};

export const submitQuiz = async (payload) => {
  const res = await fetch(`${BASE_URL}/submit_quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
};

export const startInterview = async () => {
  const res = await fetch(`${BASE_URL}/start_interview`, {
    method: "POST"
  });
  return res.json();
};

export const submitInterviewAnswer = async (payload) => {
  const res = await fetch(`${BASE_URL}/submit_interview_answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const skipInterviewQuestion = async () => {
  const res = await fetch(`${BASE_URL}/skip_interview_question`, {
    method: "POST"
  });
  return res.json();
};

export const simplifyQuestion = async (question) => {
  const res = await fetch(`${BASE_URL}/simplify_question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });
  return res.json();
};

export const endInterview = async () => {
  const res = await fetch(`${BASE_URL}/end_interview`, {
    method: "POST"
  });
  return res.json();
};