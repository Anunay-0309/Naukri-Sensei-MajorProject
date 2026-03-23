import json
import re
from .groq_client import groq_chat


QUIZ_PROMPT = """
You are a senior technical interviewer designing a candidate assessment.

You are given:
- Core technical skills
- Project domains

Your job:
Generate a realistic engineering quiz.

Constraints:
- Total 12 questions:
    - 4 Easy → conceptual clarity
    - 4 Medium → applied technical usage
    - 2 Hard → problem solving / debugging
    - 2 Subjective → project/system depth

Rules:
- Questions must be diverse (no repetition pattern)
- Must reflect real engineering scenarios
- Must relate to candidate projects where possible
- Avoid trivia, dates, history, definitions
- Avoid asking "primary function of X"
- Avoid conceptual textbook phrasing
- Prefer scenario-based questions
- Medium/Hard must require reasoning

Output ONLY valid JSON:

{
 "mcq":[
   {"question":"","options":[],"correct":"","difficulty":"","skill":""}
 ],
 "subjective":[
   {"question":"","skill":"","difficulty":"","ideal_answer":""}
 ]
}
"""


def extract_json(text):
    import json
    import re

    match = re.search(r"\{.*", text, re.DOTALL)
    if not match:
        return None

    json_text = match.group(0)

    # attempt to auto-close JSON
    open_braces = json_text.count("{")
    close_braces = json_text.count("}")

    if close_braces < open_braces:
        json_text += "}" * (open_braces - close_braces)

    return json_text


def compress_projects(projects):
    tags = []

    for p in projects:
        t = p["title"].lower()

        if "gan" in t:
            tags.append("GAN")

        if "deepfake" in t:
            tags.append("Deepfake Detection")

        if "nlp" in t:
            tags.append("NLP")

        if "vision" in t:
            tags.append("Computer Vision")

        if "ml" in t:
            tags.append("Machine Learning")

    return list(set(tags))


def filter_bad_questions(quiz):

    bad_words = ["date", "year", "history", "when was", "who invented"]

    clean = []
    for q in quiz["mcq"]:
        if not any(b in q["question"].lower() for b in bad_words):
            clean.append(q)

    quiz["mcq"] = clean[:10]
    return quiz


def generate_quiz(claims):

    core_skills = claims["skills"][:8]
    project_tags = compress_projects(claims["projects"])

    context = f"""
Skills: {core_skills}
Project Domains: {project_tags}
Level: student
"""

    messages = [
        {"role": "system", "content": QUIZ_PROMPT},
        {"role": "user", "content": context}
    ]

    response = groq_chat(messages)

    print("\n===== GROQ RAW RESPONSE =====\n")
    print(response)
    print("\n===== END =====\n")

    json_text = extract_json(response)

    if not json_text:
        raise Exception("Groq did not return JSON")

    quiz = json.loads(json_text)
    quiz = filter_bad_questions(quiz)

    return quiz