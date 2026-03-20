from fastapi import FastAPI, UploadFile, File
import shutil
from parser import extract_text_from_pdf
from skill_extractor import extract_skills
from question_engine import generate_quiz, QUESTION_BANK
from quiz_store import store_answers, get_answer_key
from fastapi import Body
from radar_engine import generate_radar

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    
    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_location)

    skills = extract_skills(text)

    quiz_data = generate_quiz(skills)

    store_answers(quiz_data["mcqs"], QUESTION_BANK)

    return {
    "skills_detected": skills,
    "quiz": quiz_data
    }



from subjective_engine import evaluate_subjective
from question_engine import SUBJECTIVE_BANK

@app.post("/submit_quiz")
def submit_quiz(data = Body(...)):

    answers = data.get("answers", {})
    subjective_answers = data.get("subjective_answers", [])

    answer_key = get_answer_key()

    skill_scores = {}

    # initialize all skills
    for qid in answer_key:
        skill = answer_key[qid]["skill"]
        skill_scores[skill] = 0

    mcq_total = len(answer_key)
    mcq_correct = 0

    # MCQ evaluation
    for qid, selected in answers.items():
        qid = int(qid)
        selected = int(selected)

        if qid in answer_key:
            skill = answer_key[qid]["skill"]
            correct = answer_key[qid]["correct"]

            if selected == correct:
                skill_scores[skill] += 1
                mcq_correct += 1

    # SUBJECTIVE evaluation
    subjective_scores = []

    for item in subjective_answers:
        skill = item.get("skill")
        user_answer = item.get("answer", "")

        expected_answer = SUBJECTIVE_BANK.get(skill, "")

        if expected_answer:
            score = evaluate_subjective(expected_answer, user_answer)
            subjective_scores.append(score)

            skill_scores[skill] = skill_scores.get(skill, 0) + (score * 2)

    # Weak detection
    weak = []
    for skill, val in skill_scores.items():
        if val < 1.5:
            weak.append(skill)

    radar = generate_radar(
        skill_scores,
        mcq_total,
        mcq_correct,
        subjective_scores
    )

    return {
        "skill_scores": skill_scores,
        "weak_areas": weak,
        "radar_metrics": radar
    }