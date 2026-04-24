import json
from backend.quiz.groq_client import groq_chat

import random

seed = random.randint(1, 10000)


def build_interview_prompt(skills, claims, domain):
    return f"""
You are an expert technical interviewer.

Generate a structured interview based on the candidate profile.

CANDIDATE DATA:
- Domain: {domain}
- Skills: {skills}
- Projects/Claims: {claims}

INSTRUCTIONS:
- Generate 6 main interview questions
- Generate 3 backup questions (in case user skips)
- Questions must be open-ended (NOT MCQs)
- Each question must require a detailed answer
- Include:
    1 intro question
    1 behavioral question
    2-3 technical questions (based on skills)
    1 problem-solving or scenario question

VERY IMPORTANT:
For EACH question, also provide an "ideal_answer" which describes what a strong answer should include.
Do NOT write long paragraphs — just key points / structure.

FORMAT STRICTLY AS JSON:
{{
    "questions": [
        {{
            "id": 1,
            "type": "intro",
            "question": "...",
            "ideal_answer": "Key points expected in a good answer..."
        }}
    ],
    "backup_questions": [
        {{
            "id": 101,
            "type": "technical",
            "question": "...",
            "ideal_answer": "Key points expected..."
        }}
    ]
}}

IMPORTANT:
- Make questions slightly different each time.
- Use different phrasing.
- Use different examples.
- Random seed: {seed}

DO NOT include anything else.
"""


def generate_interview_questions(skills, claims, domain):
    prompt = build_interview_prompt(skills, claims, domain)

    response = groq_chat([
        {"role": "user", "content": prompt}
    ])

    try:
        data = json.loads(response)
    except Exception:
        data = fallback_questions(skills)

    return data


def fallback_questions(skills):
    base_questions = [
        {
            "id": 1,
            "type": "intro",
            "question": "Tell me about yourself.",
            "ideal_answer": "Background, skills, projects, and career goals."
        },
        {
            "id": 2,
            "type": "behavioral",
            "question": "Describe a challenging project you worked on.",
            "ideal_answer": "Problem, approach, tools used, outcome."
        },
        {
            "id": 3,
            "type": "technical",
            "question": f"Explain one of your key skills: {skills[0] if skills else 'your main skill'}.",
            "ideal_answer": "Concept explanation, real-world use, example."
        },
        {
            "id": 4,
            "type": "technical",
            "question": "What are the trade-offs in your approach to solving technical problems?",
            "ideal_answer": "Pros, cons, alternatives, reasoning."
        },
        {
            "id": 5,
            "type": "problem_solving",
            "question": "How would you approach solving a completely new problem?",
            "ideal_answer": "Understanding, breaking down, planning, testing."
        },
        {
            "id": 6,
            "type": "behavioral",
            "question": "Tell me about a time you failed and what you learned.",
            "ideal_answer": "Situation, failure, learning, improvement."
        }
    ]

    backup_questions = [
        {
            "id": 101,
            "type": "technical",
            "question": "Explain a project you are most proud of.",
            "ideal_answer": "Project goal, role, tech used, impact."
        },
        {
            "id": 102,
            "type": "behavioral",
            "question": "How do you handle tight deadlines?",
            "ideal_answer": "Planning, prioritization, execution."
        },
        {
            "id": 103,
            "type": "technical",
            "question": "What tools or frameworks do you use most and why?",
            "ideal_answer": "Tool explanation, use-case, advantages."
        }
    ]

    return {
        "questions": base_questions,
        "backup_questions": backup_questions
    }