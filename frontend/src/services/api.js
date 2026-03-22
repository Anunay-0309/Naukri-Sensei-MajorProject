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