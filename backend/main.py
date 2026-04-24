from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import random

from backend.resume_parser import extract_text_from_pdf
from backend.jobs.domain_job_recommender import fetch_jobs_for_domain
from backend.core.domain_scorer import compute_domain_confidences

# QUIZ IMPORTS
from backend.quiz.local_claim_extractor import extract_claims
from backend.quiz.quiz_generator import generate_quiz
from backend.quiz.quiz_evaluator import evaluate_quiz
from backend.quiz.radar_engine import compute_radar
from backend.quiz.review_builder import build_review

# INTERVIEW IMPORTS
from backend.interview.interview_generator import generate_interview_questions
from backend.interview.interview_controller import (
    initialize_interview_session,
    submit_answer,
    skip_question,
    get_all_answers
)
from backend.interview.interview_evaluator import evaluate_interview
from backend.quiz.groq_client import groq_chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GLOBAL STORE
resume_store = {
    "text": None,
    "skills": None,
    "domains": None,
    "claims": None,
    "quiz": None,
    "interview": None
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
# RESUME UPLOAD
# =========================
@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_location)
    skills, confs = compute_domain_confidences(text)
    claims = extract_claims(text)

    resume_store["text"] = text
    resume_store["skills"] = skills
    resume_store["domains"] = confs
    resume_store["claims"] = claims
    resume_store["quiz"] = None
    resume_store["interview"] = None

    os.remove(file_location)

    return {
        "detected_skills": skills[:20],
        "domain_scores": confs,
        "claims_extracted": True
    }


# =========================
# JOBS
# =========================
@app.post("/domain_jobs")
def get_domain_jobs(data=Body(...)):

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
# QUIZ
# =========================
@app.post("/generate_quiz")
def create_quiz():

    if resume_store["claims"] is None:
        return {"error": "Upload resume first"}

    quiz = generate_quiz(resume_store["claims"])
    resume_store["quiz"] = quiz

    return quiz


@app.post("/submit_quiz")
def submit_quiz(data=Body(...)):

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

    review = build_review(
        resume_store["quiz"],
        submission
    )

    return to_python({
        "mcq_score": mcq_score,
        "subjective_scores": subjective_scores,
        "radar": radar,
        "review": review
    })


# =========================
# INTERVIEW START
# =========================
@app.post("/start_interview")
def start_interview():

    if resume_store["skills"] is None:
        return {"error": "Upload resume first"}

    domain = max(resume_store["domains"], key=resume_store["domains"].get)

    interview_data = generate_interview_questions(
        resume_store["skills"],
        resume_store["claims"],
        domain
    )

    first_question = initialize_interview_session(resume_store, interview_data)

    return {
        "question": first_question,
        "total_questions": len(interview_data["questions"])
    }


# =========================
# SUBMIT ANSWER
# =========================
@app.post("/submit_interview_answer")
def submit_interview_answer(data=Body(...)):

    answer_text = data.get("answer")
    question_id = data.get("question_id")

    # ✅ HANDLE NO ANSWER
    if not answer_text or len(answer_text.strip()) == 0:
        result = submit_answer(resume_store, question_id, "")

        fallback = "You didn’t answer this. A strong answer would briefly include the key idea and a relevant example."

        return {
            "feedback": fallback,
            "next_question": result.get("next_question"),
            "interview_complete": result.get("interview_complete", False)
        }

    result = submit_answer(resume_store, question_id, answer_text)

    # ✅ IMPROVED FEEDBACK PROMPT (VARIED STYLE)
    feedback_prompt = f"""
You are an interviewer.

Give short, natural feedback (1 sentence only).
Do NOT follow a fixed pattern.

Vary your tone:
- sometimes encouraging
- sometimes direct
- sometimes analytical

Avoid repeating phrases like:
"While you did..., you should..."

Answer:
{answer_text}
"""

    try:
        feedback_templates = [
        "Good answer. Let's move on.",
        "Decent attempt. Moving on.",
        "Alright, let's continue.",
        "Got it. Moving ahead.",
        "Okay, let's try the next one."
        ]

        feedback = random.choice(feedback_templates)
    except:
        feedback = "Thanks for your answer. Let's continue."

    return {
        "feedback": feedback,
        "next_question": result.get("next_question"),
        "interview_complete": result.get("interview_complete", False)
    }


# =========================
# SKIP QUESTION
# =========================
@app.post("/skip_interview_question")
def skip_interview_question():

    result = skip_question(resume_store)

    return result


# =========================
# SIMPLIFY QUESTION
# =========================
@app.post("/simplify_question")
def simplify_question(data=Body(...)):

    question = data.get("question")

    if not question:
        return {"error": "Question required"}

    # ✅ SHORT + CLEAN
    prompt = f"""
Rewrite this interview question in simpler words.
Keep it ONE short sentence.
Do NOT explain.

Question:
{question}
"""

    try:
        simplified = groq_chat([
            {"role": "user", "content": prompt}
        ])
    except:
        simplified = question

    return {
        "simplified_question": simplified
    }


# =========================
# END INTERVIEW
# =========================
@app.post("/end_interview")
def end_interview():

    answers = get_all_answers(resume_store)

    if not answers:
        return {"error": "No answers found"}

    report = evaluate_interview(answers)

    return to_python(report)