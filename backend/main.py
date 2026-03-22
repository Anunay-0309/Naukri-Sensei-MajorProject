from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
import shutil

from backend.resume_parser import extract_text_from_pdf  # TEMP until we switch parser fully
from backend.jobs.domain_job_recommender import fetch_jobs_for_domain
from backend.core.domain_scorer import compute_domain_confidences

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

resume_store = {
    "text": None,
    "skills": None,
    "domains": None
}

@app.get("/")
def home():
    return {"message": "AI Career Backend Running"}

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_location)

    skills, confs = compute_domain_confidences(text)

    resume_store["text"] = text
    resume_store["skills"] = skills
    resume_store["domains"] = confs

    return {
        "detected_skills": skills[:20],
        "domain_scores": confs
    }

@app.post("/domain_jobs")
def get_domain_jobs(data = Body(...)):

    domain = data.get("domain")

    if not domain:
        return {"error": "Domain required"}

    jobs = fetch_jobs_for_domain(domain, resume_store["skills"])

    return {
        "domain": domain,
        "jobs": jobs
    }