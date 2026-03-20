import re

# simple skill database (we expand later)
SKILLS_DB = [
    "python", "java", "c++", "machine learning", "deep learning",
    "data science", "react", "node", "sql", "mongodb",
    "nlp", "computer vision", "flask", "fastapi",
    "tensorflow", "pytorch", "statistics", "power bi",
    "excel", "html", "css", "javascript"
]

def extract_skills(resume_text):
    found = []

    text = resume_text.lower()

    for skill in SKILLS_DB:
        if re.search(r"\b" + re.escape(skill) + r"\b", text):
            found.append(skill)

    return list(set(found))