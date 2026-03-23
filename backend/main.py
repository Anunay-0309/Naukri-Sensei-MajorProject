from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from backend.resume_parser import extract_text_from_pdf
from backend.jobs.domain_job_recommender import fetch_jobs_for_domain
from backend.core.domain_scorer import compute_domain_confidences

# NEW QUIZ IMPORTS
from backend.quiz.local_claim_extractor import extract_claims
from backend.quiz.quiz_generator import generate_quiz
from backend.quiz.quiz_evaluator import evaluate_quiz
from backend.quiz.radar_engine import compute_radar

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GLOBAL IN-MEMORY STORE
resume_store = {
    "text": None,
    "skills": None,
    "domains": None,
    "claims": None,
    "quiz": None
}


@app.get("/")
def home():
    return {"message": "AI Career Backend Running"}

def to_python(obj):
    import numpy as np

    if isinstance(obj, np.generic):
        return obj.item()

    if isinstance(obj, list):
        return [to_python(i) for i in obj]

    if isinstance(obj, dict):
        return {k: to_python(v) for k, v in obj.items()}

    return obj


# =========================
# RESUME UPLOAD + FULL PARSE
# =========================
@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract raw text
    text = extract_text_from_pdf(file_location)

    # Semantic domain pipeline (existing)
    skills, confs = compute_domain_confidences(text)

    # NEW: LLM CLAIM EXTRACTION
    claims = extract_claims(text)

    # Store everything
    resume_store["text"] = text
    resume_store["skills"] = skills
    resume_store["domains"] = confs
    resume_store["claims"] = claims
    resume_store["quiz"] = None   # reset old quiz

    # delete temp file
    os.remove(file_location)

    return {
        "detected_skills": skills[:20],
        "domain_scores": confs,
        "claims_extracted": True
    }


# =========================
# JOB RECOMMENDATION
# =========================
@app.post("/domain_jobs")
def get_domain_jobs(data = Body(...)):

    domain = data.get("domain")

    if not domain:
        return {"error": "Domain required"}

    if resume_store["skills"] is None:
        return {"error": "Upload resume first"}

    jobs = fetch_jobs_for_domain(domain, resume_store["skills"])

    return {
        "domain": domain,
        "jobs": jobs
    }


# =========================
# QUIZ GENERATION
# =========================
@app.post("/generate_quiz")
def create_quiz():

    if resume_store["claims"] is None:
        return {"error": "Upload resume first"}

    quiz = generate_quiz(resume_store["claims"])

    resume_store["quiz"] = quiz

    return quiz


# =========================
# QUIZ SUBMISSION
# =========================
@app.post("/submit_quiz")
def submit_quiz(data = Body(...)):

    if resume_store["quiz"] is None:
        return {"error": "Generate quiz first"}

    submission = {
        "mcq_answers": data.get("mcq_answers"),
        "subjective_answers": data.get("subjective_answers")
    }

    mcq_score, subjective_scores = evaluate_quiz(
        resume_store["quiz"],
        submission
    )

    radar = compute_radar(
    resume_store["quiz"],
    submission,
    subjective_scores
    )

    response = {
    "mcq_score": mcq_score,
    "subjective_scores": subjective_scores,
    "radar": radar
    }

    return to_python(response)